import React from 'react';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FiZap, FiFacebook, FiLink2, FiSearch, FiGrid, FiList, FiCreditCard } from 'react-icons/fi';
import Modal from 'react-modal';
import { useSidebar } from '../components/SidebarContext';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: #0b0b0e;
  color: #fff;
  font-family: 'Poppins', 'Inter', Arial, sans-serif;
  padding: 32px 0 0 0;
  position: relative;
  overflow: hidden;
`;
const Main = styled.main`
  margin-left: ${props => props.marginLeft || 320}px;
  padding: 0 48px 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  position: relative;
  z-index: 1;
  transition: margin-left 0.35s cubic-bezier(.77,0,.18,1);
  @media (max-width: 900px) {
    margin-left: 0;
    padding: 0 8px 40px 8px;
  }
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 36px;
  background: #23232b;
  border-radius: 22px;
  box-shadow: 0 4px 32px #2d1a4d33, 0 1.5px 8px #0006 inset;
  padding: 32px 38px 32px 32px;
`;
const HeaderIcon = styled.div`
  background: linear-gradient(135deg, #7c3aed 0%, #a084ff 100%);
  color: #fff;
  border-radius: 18px;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.7rem;
  box-shadow: 0 8px 32px #2d1a4d33, 0 1.5px 8px #0006 inset;
`;
const Title = styled.h1`
  font-size: 2.7rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(90deg, #a084ff 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  letter-spacing: -1.2px;
  text-shadow: 0 2px 18px #2d1a4d33;
`;
const SubTitle = styled.div`
  color: #b3b3c6;
  font-size: 1.18rem;
  font-weight: 600;
  margin-top: 8px;
`;
const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 36px;
  margin-bottom: 48px;
  max-width: 1200px;
  width: 100%;
  align-items: stretch;
  justify-items: center;
  justify-content: center;
`;
const IntegrationCard = styled.div`
  min-width: 280px;
  min-height: 140px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  max-width: 370px;
  background: #101014;
  border: 1.5px solid #2d1a4d;
  border-radius: 22px;
  box-shadow: 0 8px 32px 0 #2d1a4d22, 0 1.5px 8px #0006 inset;
  padding: 32px 28px 28px 28px;
  transition: box-shadow 0.22s, transform 0.18s cubic-bezier(0.4,0.2,0.2,1);
  position: relative;
  overflow: hidden;
  &:hover {
    box-shadow: 0 12px 36px #7c3aed44, 0 2px 12px #2d1a4d55 inset;
    border: 1.5px solid #a084ff;
    transform: scale(1.025) translateY(-2px);
  }
`;
const OverviewCard = styled.div`
  background: #101014;
  border: 1.5px solid #2d1a4d;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 #7c3aed18, 0 1.5px 8px #0006 inset;
  padding: 28px 32px;
  margin-bottom: 32px;
  display: flex;
  gap: 48px;
  align-items: center;
  justify-content: flex-start;
  max-width: 1100px;
  width: 100%;
`;
const OverviewItem = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: #a084ff;
  span {
    color: #b3b3c6;
    font-weight: 600;
    font-size: 17px;
    margin-left: 6px;
  }
`;
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #101014;
  border-radius: 14px;
  padding: 12px 20px;
  margin-bottom: 32px;
  max-width: 1100px;
  width: 100%;
`;
const SearchInput = styled.input`
  background: #18181f;
  border: 1.5px solid #2d1a4d;
  color: #fff;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 1rem;
  outline: none;
  width: 100%;
  max-width: 340px;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.5px solid #a084ff;
    box-shadow: 0 0 0 2px #a084ff33;
  }
`;
const Badge = styled.span`
  position: absolute;
  top: 18px;
  right: 18px;
  background: #7c3aed;
  color: #ede6fa;
  font-size: 0.92rem;
  font-weight: 800;
  border-radius: 10px;
  padding: 6px 18px;
  z-index: 2;
  box-shadow: 0 2px 12px #2d1a4d22;
  letter-spacing: 0.5px;
`;
const ConfigureButton = styled.button`
  width: 100%;
  margin-top: 18px;
  background: #a084ff;
  border: none;
  color: #18181f;
  border-radius: 12px;
  padding: 14px 0;
  font-size: 1.13rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 2px 12px #2d1a4d22;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  &:hover {
    background: #7c3aed;
    color: #ede6fa;
    box-shadow: 0 4px 18px #2d1a4d33;
  }
`;

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
    <Container>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Main marginLeft={sidebarWidth}>
        <div style={{ marginTop: 32 }} />
        <Header>
          <HeaderIcon>
            <FiZap />
          </HeaderIcon>
          <div>
            <Title>Integrações</Title>
            <SubTitle>Gerencie e conecte suas integrações</SubTitle>
          </div>
        </Header>
        <OverviewCard>
          <OverviewItem>{ativas} <span>Ativas</span></OverviewItem>
          <OverviewItem>{disponiveis} <span>Disponíveis</span></OverviewItem>
          <OverviewItem style={{ color: '#b3b3c6' }}>{emBreve} <span>Em breve</span></OverviewItem>
        </OverviewCard>
        <SearchBar>
          <FiSearch style={{ color: '#a084ff', fontSize: 20 }} />
          <SearchInput placeholder="Buscar integrações..." value={busca} onChange={e => setBusca(e.target.value)} />
        </SearchBar>
        <CardsGrid>
          {/* Pushin Pay */}
          <IntegrationCard>
            <Badge>Disponível</Badge>
            <div style={{ background: 'transparent', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiZap size={32} color="#a084ff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 19, color: '#ede6fa' }}>Pushin Pay</div>
              <div style={{ color: '#b3b3c6', fontSize: 15 }}>Importe produtos automaticamente</div>
            </div>
            <ConfigureButton onClick={() => setModalOpen('pushin_pay')}><span style={{ fontSize: 20, marginRight: 6 }}>+</span> Configurar</ConfigureButton>
          </IntegrationCard>
          {/* Mercado Pago */}
          <IntegrationCard>
            <Badge>Disponível</Badge>
            <div style={{ background: 'transparent', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiCreditCard size={32} color="#a084ff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 19, color: '#ede6fa' }}>Mercado Pago</div>
              <div style={{ color: '#b3b3c6', fontSize: 15 }}>Receba pagamentos via Mercado Pago</div>
            </div>
            <ConfigureButton onClick={() => setModalOpen('mercado_pago')}><span style={{ fontSize: 20, marginRight: 6 }}>+</span> Configurar</ConfigureButton>
          </IntegrationCard>
          {/* Facebook Pixel */}
          <IntegrationCard>
            <Badge>Disponível</Badge>
            <div style={{ background: 'transparent', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiFacebook size={32} color="#a084ff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 19, color: '#ede6fa' }}>Facebook Pixel</div>
              <div style={{ color: '#b3b3c6', fontSize: 15 }}>Rastreie conversões e eventos</div>
            </div>
            <ConfigureButton onClick={() => setModalOpen('facebook_pixel')}><span style={{ fontSize: 20, marginRight: 6 }}>+</span> Configurar</ConfigureButton>
          </IntegrationCard>
          {/* UTMFY */}
          <IntegrationCard>
            <Badge>Disponível</Badge>
            <div style={{ background: 'transparent', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiLink2 size={32} color="#a084ff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 19, color: '#ede6fa' }}>UTMFY</div>
              <div style={{ color: '#b3b3c6', fontSize: 15 }}>UTM tracking avançado</div>
            </div>
            <ConfigureButton onClick={() => setModalOpen('utmfy')}><span style={{ fontSize: 20, marginRight: 6 }}>+</span> Configurar</ConfigureButton>
          </IntegrationCard>
        </CardsGrid>
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
      </Main>
    </Container>
  );
} 