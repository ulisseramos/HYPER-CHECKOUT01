import React from 'react';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FiZap, FiFacebook, FiLink2, FiSearch, FiGrid, FiList, FiCreditCard } from 'react-icons/fi';
import Modal from 'react-modal';
import { useSidebar } from '../components/SidebarContext';

export default function Integracoes() {
  const [pushinPayToken, setPushinPayToken] = useState('');
  const [facebookPixel, setFacebookPixel] = useState('');
  const [utmfyToken, setUtmfyToken] = useState('');
  const [mercadoPagoToken, setMercadoPagoToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(null); // 'pushin_pay' | 'facebook_pixel' | 'utmfy' | 'mercado_pago' | null
  const { collapsed, setCollapsed } = useSidebar();
  const sidebarWidth = collapsed ? 84 : 320;
  const [busca, setBusca] = useState('');
  const [soDisponiveis, setSoDisponiveis] = useState(true);
  const [visualizacao, setVisualizacao] = useState('grid');
  const ativas = 0;
  const disponiveis = 8;
  const emBreve = 7;

  // Carregar integrações do usuário ao abrir a página
  useEffect(() => {
    const fetchIntegrations = async () => {
      setLoading(true);
      setError('');
      setSuccess('');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const userId = session.user.id;
      const { data, error } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId);
      if (error) {
        setError('Erro ao carregar integrações.');
      } else if (data) {
        setPushinPayToken(data.find(i => i.integration_name === 'pushin_pay')?.api_key || '');
        setFacebookPixel(data.find(i => i.integration_name === 'facebook_pixel')?.api_key || '');
        setUtmfyToken(data.find(i => i.integration_name === 'utmfy')?.api_key || '');
        setMercadoPagoToken(data.find(i => i.integration_name === 'mercado_pago')?.api_key || '');
      }
      setLoading(false);
    };
    fetchIntegrations();
  }, []);

  // Salvar integrações
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError('Usuário não autenticado.');
      setLoading(false);
      return;
    }
    const userId = session.user.id;
    // Upsert para cada integração
    const upserts = [
      { integration_name: 'pushin_pay', api_key: pushinPayToken },
      { integration_name: 'facebook_pixel', api_key: facebookPixel },
      { integration_name: 'utmfy', api_key: utmfyToken },
      { integration_name: 'mercado_pago', api_key: mercadoPagoToken },
    ];
    for (const integ of upserts) {
      if (integ.api_key) {
        await supabase.from('user_integrations').upsert({
          user_id: userId,
          integration_name: integ.integration_name,
          api_key: integ.api_key,
        }, { onConflict: ['user_id', 'integration_name'] });
      } else {
        // Se o campo estiver vazio, remove a integração
        await supabase.from('user_integrations')
          .delete()
          .eq('user_id', userId)
          .eq('integration_name', integ.integration_name);
      }
    }
    setSuccess('Integrações salvas com sucesso!');
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <main style={{ marginLeft: sidebarWidth, flex: 1, padding: '40px 0 0 0', minHeight: '100vh', transition: 'margin 0.22s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Cabeçalho premium */}
        <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto 32px auto', padding: '0 32px' }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-main)', letterSpacing: 0.5, marginBottom: 8, textShadow: '0 2px 16px var(--purple-glow)' }}>
            Integraç<span style={{ color: 'var(--purple)' }}>õ</span>es
          </h1>
        </div>
        {/* Card de visão geral */}
        <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto 32px auto', padding: '0 32px' }}>
          <div className="card" style={{ display: 'flex', gap: 48, alignItems: 'center', justifyContent: 'flex-start', background: 'var(--bg-card)', border: '1.5px solid var(--purple)', borderRadius: 18, boxShadow: 'var(--shadow)', padding: '28px 32px', marginBottom: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--purple-glow)' }}>{ativas} <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 17, marginLeft: 6 }}>Ativas</span></div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--purple)' }}>{disponiveis} <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 17, marginLeft: 6 }}>Disponíveis</span></div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#444' }}>{emBreve} <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 17, marginLeft: 6 }}>Em breve</span></div>
          </div>
        </div>
        {/* Grid de integrações */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginBottom: 40, maxWidth: 1100, width: '100%', margin: '0 auto', alignItems: 'stretch', padding: '0 32px' }}>
          {/* Pushin Pay */}
          <div className="card" style={{ minWidth: 240, minHeight: 80, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 18, maxWidth: 340, background: 'var(--bg-card)', border: '1px solid rgba(123,44,191,0.38)', borderRadius: 12, boxShadow: 'var(--shadow)', padding: '20px 18px', transition: 'box-shadow 0.2s, border 0.2s', position: 'relative' }} onClick={() => setModalOpen('pushin_pay')} onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 18px rgba(123,44,191,0.18), var(--shadow)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}>
            <div style={{ background: 'transparent', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiZap size={32} color="var(--purple)" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 19, color: 'var(--text-main)' }}>Pushin Pay</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 15 }}>Importe produtos automaticamente</div>
            </div>
          </div>
          {/* Mercado Pago */}
          <div className="card" style={{ minWidth: 240, minHeight: 80, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 18, maxWidth: 340, background: 'var(--bg-card)', border: '1px solid rgba(123,44,191,0.38)', borderRadius: 12, boxShadow: 'var(--shadow)', padding: '20px 18px', transition: 'box-shadow 0.2s, border 0.2s', position: 'relative' }} onClick={() => setModalOpen('mercado_pago')} onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 18px rgba(123,44,191,0.18), var(--shadow)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}>
            <div style={{ background: 'transparent', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiCreditCard size={32} color="var(--purple)" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 19, color: 'var(--text-main)' }}>Mercado Pago</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 15 }}>Receba pagamentos via Mercado Pago</div>
            </div>
          </div>
          {/* Facebook Pixel */}
          <div className="card" style={{ minWidth: 240, minHeight: 80, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 18, maxWidth: 340, background: 'var(--bg-card)', border: '1px solid rgba(123,44,191,0.38)', borderRadius: 12, boxShadow: 'var(--shadow)', padding: '20px 18px', transition: 'box-shadow 0.2s, border 0.2s', position: 'relative' }} onClick={() => setModalOpen('facebook_pixel')} onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 18px rgba(123,44,191,0.18), var(--shadow)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}>
            <div style={{ background: 'transparent', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiFacebook size={32} color="var(--purple)" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 19, color: 'var(--text-main)' }}>Facebook Pixel</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 15 }}>Rastreie conversões e eventos</div>
            </div>
          </div>
          {/* UTMFY */}
          <div className="card" style={{ minWidth: 240, minHeight: 80, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 18, maxWidth: 340, background: 'var(--bg-card)', border: '1px solid rgba(123,44,191,0.38)', borderRadius: 12, boxShadow: 'var(--shadow)', padding: '20px 18px', transition: 'box-shadow 0.2s, border 0.2s', position: 'relative' }} onClick={() => setModalOpen('utmfy')} onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 18px rgba(123,44,191,0.18), var(--shadow)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}>
            <div style={{ background: 'transparent', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiLink2 size={32} color="var(--purple)" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 19, color: 'var(--text-main)' }}>UTMFY</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 15 }}>UTM tracking avançado</div>
            </div>
          </div>
        </div>
        {/* Modal de integração */}
        <Modal
          isOpen={!!modalOpen}
          onRequestClose={() => setModalOpen(null)}
          className="modal"
          overlayClassName="ReactModal__Overlay"
          ariaHideApp={false}
        >
          <h2 style={{ marginTop: 0, marginBottom: 24, color: 'var(--purple)', fontWeight: 900, fontSize: 26, letterSpacing: 0.2 }}>
            {modalOpen === 'pushin_pay' && 'Pushin Pay'}
            {modalOpen === 'facebook_pixel' && 'Facebook Pixel'}
            {modalOpen === 'utmfy' && 'UTMFY'}
            {modalOpen === 'mercado_pago' && 'Mercado Pago'}
          </h2>
          <form onSubmit={handleSave} style={{ minWidth: 320 }}>
            {modalOpen === 'pushin_pay' && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ color: 'var(--text-main)', fontWeight: 700 }}>Token Pushin Pay</label>
                <input
                  type="text"
                  value={pushinPayToken}
                  onChange={e => setPushinPayToken(e.target.value)}
                  placeholder="Cole seu token da Pushin Pay"
                  style={{ width: '100%', marginTop: 4 }}
                />
              </div>
            )}
            {modalOpen === 'facebook_pixel' && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ color: 'var(--text-main)', fontWeight: 700 }}>ID do Facebook Pixel</label>
                <input
                  type="text"
                  value={facebookPixel}
                  onChange={e => setFacebookPixel(e.target.value)}
                  placeholder="Cole seu ID do Facebook Pixel"
                  style={{ width: '100%', marginTop: 4 }}
                />
              </div>
            )}
            {modalOpen === 'utmfy' && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ color: 'var(--text-main)', fontWeight: 700 }}>Token UTMFY</label>
                <input
                  type="text"
                  value={utmfyToken}
                  onChange={e => setUtmfyToken(e.target.value)}
                  placeholder="Cole seu token do UTMFY"
                  style={{ width: '100%', marginTop: 4 }}
                />
              </div>
            )}
            {modalOpen === 'mercado_pago' && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ color: 'var(--text-main)', fontWeight: 700 }}>Token Mercado Pago</label>
                <input
                  type="text"
                  value={mercadoPagoToken}
                  onChange={e => setMercadoPagoToken(e.target.value)}
                  placeholder="Cole seu token do Mercado Pago"
                  style={{ width: '100%', marginTop: 4 }}
                />
              </div>
            )}
            {error && <div style={{ color: 'var(--error)', marginBottom: 8 }}>{error}</div>}
            {success && <div style={{ color: 'var(--success)', marginBottom: 8 }}>{success}</div>}
            <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              <button type="submit" disabled={loading} style={{ minWidth: 120 }}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button type="button" onClick={() => setModalOpen(null)} style={{ background: 'var(--bg-card)', color: 'var(--purple)', minWidth: 120, border: '1.5px solid var(--purple)' }}>
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
        <style jsx global>{`
          @media (max-width: 900px) {
            main {
              padding: 24px 2vw 24px 2vw !important;
            }
            .card {
              min-width: 180px !important;
              max-width: 100% !important;
            }
            div[style*='grid-template-columns'] {
              grid-template-columns: 1fr 1fr !important;
            }
          }
          @media (max-width: 600px) {
            main {
              padding: 12px 0 12px 0 !important;
            }
            div[style*='grid-template-columns'] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
} 