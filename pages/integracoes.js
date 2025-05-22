import React from 'react';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FiZap, FiFacebook, FiLink2, FiSearch, FiGrid, FiList, FiCreditCard } from 'react-icons/fi';
import Modal from 'react-modal';
import { useSidebar } from '../components/SidebarContext';
import styled from 'styled-components';

// Styled components para modal (copiado de produtos.js)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(76,12,122,0.13);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalForm = styled.form`
  max-width: 440px;
  min-width: 0;
  background: #101014;
  border-radius: 20px;
  box-shadow: 0 2px 16px #0004;
  border: 1.5px solid #a084ff22;
  padding: 36px;
  color: #fff;
  font-family: 'Poppins', 'Inter', Arial, sans-serif;
  @media (max-width: 600px) {
    max-width: 98vw;
    padding: 16px 4px;
  }
`;
const ModalTitle = styled.h2`
  color: #fff;
  margin-bottom: 22px;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.1px;
  text-align: left;
`;
const ModalLabel = styled.label`
  font-weight: 600;
  color: #b3b3c6;
  font-size: 1.04rem;
  margin-bottom: 2px;
  text-align: left;
`;
const ModalInput = styled.input`
  width: 100%;
  margin-top: 8px;
  margin-bottom: 20px;
  background: #18181f;
  border: 1.2px solid #23232b;
  color: #fff;
  border-radius: 10px;
  padding: 13px 15px;
  font-size: 1.04rem;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.2px solid #a084ff;
    box-shadow: 0 0 0 1.5px #a084ff22;
  }
`;
const ModalSelect = styled.select`
  width: 100%;
  margin-top: 8px;
  margin-bottom: 20px;
  background: #18181f;
  border: 1.2px solid #23232b;
  color: #fff;
  border-radius: 10px;
  padding: 13px 15px;
  font-size: 1.04rem;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.2px solid #a084ff;
    box-shadow: 0 0 0 1.5px #a084ff22;
  }
`;
const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;

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
  gap: 18px;
  margin-bottom: 24px;
  background: none;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
`;
const HeaderIcon = styled.div`
  background: #18181f;
  color: #fff;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
  box-shadow: none;
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  margin: 0;
  color: #fff;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
  letter-spacing: -1px;
`;
const SubTitle = styled.div`
  color: #b3b3c6;
  font-size: 1.08rem;
  font-weight: 400;
  margin: 0 0 0 8px;
`;
const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ visualizacao }) => visualizacao === 'list' ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))'};
  gap: 32px;
  margin-bottom: 28px;
  max-width: ${({ visualizacao }) => visualizacao === 'list' ? '700px' : '1200px'};
  width: 100%;
  padding: 0 24px;
  @media (max-width: 700px) {
    padding: 0 8px;
    max-width: 400px;
  }
`;
const IntegrationCard = styled.div`
  display: flex;
  align-items: center;
  background: #101014;
  border-radius: 18px;
  border: none;
  box-shadow: none;
  padding: 20px 28px;
  min-height: 56px;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: background 0.18s, transform 0.14s cubic-bezier(0.4,0.2,0.2,1);
  max-width: 320px;
  width: 100%;
  margin-bottom: 0;
  &:hover {
    background: #18181f;
    transform: scale(1.01) translateY(-2px);
  }
`;
const IntegrationIconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-right: 14px;
  background: #18181f;
  border-radius: 8px;
  width: 48px;
  height: 48px;
  border: none;
`;
const IntegrationInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`;
const IntegrationName = styled.div`
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
`;
const IntegrationDesc = styled.div`
  color: #b3b3c6;
  font-size: 0.92rem;
`;
const Badge = styled.span`
  position: absolute;
  top: 12px;
  right: 18px;
  background: #23232b;
  color: #ede6fa;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 7px;
  padding: 4px 14px;
  z-index: 2;
  box-shadow: none;
  letter-spacing: 0.2px;
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
  gap: 12px;
  background: #101014;
  border-radius: 14px;
  padding: 12px 18px;
  margin-bottom: 24px;
  max-width: 1100px;
  width: 100%;
  box-shadow: none;
  border: 1px solid #23232b;
`;
const SearchInput = styled.input`
  background: #18181f;
  border: 1px solid #23232b;
  color: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 1rem;
  outline: none;
  width: 100%;
  max-width: 340px;
  transition: border 0.2s;
  &:focus {
    border: 1px solid #fff;
  }
`;
const ConfigureButton = styled.button`
  width: 100%;
  margin-top: 14px;
  background: #23232b;
  border: 1px solid #23232b;
  color: #fff;
  border-radius: 10px;
  padding: 12px 0;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: none;
  transition: background 0.18s, border 0.18s;
  &:hover {
    background: #18181f;
    border-color: #fff;
    color: #fff;
  }
`;
// Toggle customizado
const ToggleDisponiveis = styled.label`
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 600;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  user-select: none;
  input[type='checkbox'] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #a084ff;
    border-radius: 5px;
    background: #18181f;
    display: grid;
    place-content: center;
    margin: 0;
    transition: border 0.18s, background 0.18s;
  }
  input[type='checkbox']:checked {
    background: #a084ff;
    border-color: #a084ff;
  }
  input[type='checkbox']:checked::after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background: #fff;
  }
`;
const ViewButton = styled.button`
  background: ${({ active }) => active ? '#a084ff' : 'transparent'};
  border: none;
  border-radius: 12px;
  padding: 7px 13px;
  color: #fff;
  opacity: ${({ active }) => active ? 1 : 0.7};
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.18s, opacity 0.18s;
  &:hover {
    background: ${({ active }) => active ? '#a084ff' : '#23232b'};
    opacity: 1;
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
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhooks, setWebhooks] = useState([]);
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '', method: 'POST', headers: '', body: '' });
  const [creatingWebhook, setCreatingWebhook] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Adiciona o estado para saber se está no client
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Função para buscar webhooks do usuário
  useEffect(() => {
    async function fetchWebhooks() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const userId = session.user.id;
      const { data } = await supabase.from('webhooks').select('*').eq('user_id', userId);
      setWebhooks(data || []);
    }
    fetchWebhooks();
  }, []);

  // Função para criar webhook
  const handleCreateWebhook = async (e) => {
    e.preventDefault();
    setCreatingWebhook(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const userId = session.user.id;
    const { data, error } = await supabase.from('webhooks').insert({
      user_id: userId,
      name: newWebhook.name,
      url: newWebhook.url,
      method: newWebhook.method,
      headers: newWebhook.headers,
      body: newWebhook.body,
    }).select().single();
    if (!error) setWebhooks([...webhooks, data]);
    setShowWebhookModal(false);
    setNewWebhook({ name: '', url: '', method: 'POST', headers: '', body: '' });
    setCreatingWebhook(false);
  };

  return (
    <Container>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Main marginLeft={sidebarWidth}>
        <div style={{ marginTop: 32 }} />
        <Header>
            <Title>Integrações</Title>
        </Header>
        {/* Barra de busca, toggle e visualização */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1200, marginBottom: 24 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
            <SearchBar style={{ marginBottom: 0, flex: 1, maxWidth: 420 }}>
              <FiSearch style={{ color: '#b3b3c6', fontSize: 18 }} />
          <SearchInput placeholder="Buscar integrações..." value={busca} onChange={e => setBusca(e.target.value)} />
        </SearchBar>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginLeft: 18 }}>
            <ToggleDisponiveis>
              <input type="checkbox" checked={soDisponiveis} onChange={e => setSoDisponiveis(e.target.checked)} />
              Disponíveis
            </ToggleDisponiveis>
            <ViewButton active={visualizacao === 'grid'} onClick={() => setVisualizacao('grid')}><FiGrid /></ViewButton>
            <ViewButton active={visualizacao === 'list'} onClick={() => setVisualizacao('list')}><FiList /></ViewButton>
          </div>
        </div>
        {/* OVERVIEW CARD */}
        <div style={{ width: '100%', maxWidth: 1200, marginBottom: 32 }}>
          <div style={{ border: '1.2px solid #a084ff22', borderRadius: 14, background: '#101014', padding: '18px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ color: '#b3b3c6', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Visão Geral</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>0 <span style={{ color: '#b3b3c6', fontWeight: 600, fontSize: 16 }}>Ativas</span></span>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>8 <span style={{ color: '#b3b3c6', fontWeight: 600, fontSize: 16 }}>Disponíveis</span></span>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>7 <span style={{ color: '#b3b3c6', fontWeight: 600, fontSize: 16 }}>Em breve</span></span>
            </div>
          </div>
        </div>
        <CardsGrid visualizacao={visualizacao}>
          {/* Pushin Pay */}
          <IntegrationCard onClick={() => setModalOpen('pushin_pay')}>
            <IntegrationIconCircle><FiZap size={32} color="#fff" /></IntegrationIconCircle>
            <IntegrationInfo>
              <IntegrationName>Pushin Pay</IntegrationName>
              <IntegrationDesc>Importe produtos automaticamente</IntegrationDesc>
            </IntegrationInfo>
            <Badge>Disponível</Badge>
          </IntegrationCard>
          {/* Mercado Pago */}
          <IntegrationCard>
            <IntegrationIconCircle><FiCreditCard size={32} color="#fff" /></IntegrationIconCircle>
            <IntegrationInfo>
              <IntegrationName>Mercado Pago</IntegrationName>
              <IntegrationDesc>Receba pagamentos via Mercado Pago</IntegrationDesc>
            </IntegrationInfo>
            <Badge style={{ background: '#23232b', color: '#b3b3c6' }}>Em breve</Badge>
          </IntegrationCard>
          {/* Facebook Pixel */}
          <IntegrationCard>
            <IntegrationIconCircle><FiFacebook size={32} color="#fff" /></IntegrationIconCircle>
            <IntegrationInfo>
              <IntegrationName>Facebook Pixel</IntegrationName>
              <IntegrationDesc>Rastreie conversões e eventos</IntegrationDesc>
            </IntegrationInfo>
            <Badge style={{ background: '#23232b', color: '#b3b3c6' }}>Em breve</Badge>
          </IntegrationCard>
          {/* UTMFY */}
          <IntegrationCard onClick={() => setModalOpen('utmfy')}>
            <IntegrationIconCircle><FiLink2 size={32} color="#fff" /></IntegrationIconCircle>
            <IntegrationInfo>
              <IntegrationName>UTMFY</IntegrationName>
              <IntegrationDesc>UTM tracking avançado</IntegrationDesc>
            </IntegrationInfo>
            <Badge>Disponível</Badge>
          </IntegrationCard>
          {/* Webhook */}
          <IntegrationCard onClick={() => setShowWebhookModal(true)}>
            <IntegrationIconCircle><FiLink2 size={32} color="#fff" /></IntegrationIconCircle>
            <IntegrationInfo>
              <IntegrationName>Webhook</IntegrationName>
              <IntegrationDesc>Conecte com qualquer API</IntegrationDesc>
            </IntegrationInfo>
            <Badge style={{ background: '#23232b', color: '#b3b3c6' }}>Custom</Badge>
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
        {isClient && showWebhookModal && (
          <ModalOverlay>
            <ModalForm onSubmit={handleCreateWebhook}>
              <ModalTitle>Novo Webhook</ModalTitle>
              <ModalLabel>Nome</ModalLabel>
              <ModalInput required value={newWebhook.name} onChange={e => setNewWebhook(w => ({ ...w, name: e.target.value }))} />
              <ModalLabel>URL do endpoint</ModalLabel>
              <ModalInput required value={newWebhook.url} onChange={e => setNewWebhook(w => ({ ...w, url: e.target.value }))} />
              <ModalLabel>Método</ModalLabel>
              <ModalSelect value={newWebhook.method} onChange={e => setNewWebhook(w => ({ ...w, method: e.target.value }))}>
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </ModalSelect>
              <ModalLabel>Headers (JSON, opcional)</ModalLabel>
              <ModalInput value={newWebhook.headers} onChange={e => setNewWebhook(w => ({ ...w, headers: e.target.value }))} />
              <ModalLabel>Body (JSON, opcional)</ModalLabel>
              <ModalInput value={newWebhook.body} onChange={e => setNewWebhook(w => ({ ...w, body: e.target.value }))} />
              <ModalActions>
                <ConfigureButton type="submit" disabled={creatingWebhook}>{creatingWebhook ? 'Criando...' : 'Criar Webhook'}</ConfigureButton>
                <ConfigureButton type="button" style={{ background: '#18181f', color: '#a084ff', border: '1.5px solid #23232b' }} onClick={() => setShowWebhookModal(false)}>Cancelar</ConfigureButton>
              </ModalActions>
            </ModalForm>
          </ModalOverlay>
        )}
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