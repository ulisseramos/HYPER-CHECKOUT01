import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import styled, { keyframes } from 'styled-components';
import { supabase } from '../lib/supabaseClient';
import { listPushinPayProducts } from '../lib/pushinpay';
import { FiCheckCircle, FiEdit2, FiTrash2, FiCopy, FiBox, FiPlus, FiUsers, FiBell, FiX } from 'react-icons/fi';
import { useSidebar } from '../components/SidebarContext';
import { useNotification } from '../components/NotificationContext';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(90, 15, 214, 0.5); }
  50% { box-shadow: 0 0 20px rgba(90, 15, 214, 0.8); }
  100% { box-shadow: 0 0 5px rgba(90, 15, 214, 0.5); }
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
  padding: 48px 48px 40px 48px;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  z-index: 1;
  transition: margin-left 0.35s cubic-bezier(.77,0,.18,1);
  @media (max-width: 900px) {
    margin-left: 0;
    padding: 48px 8px 40px 8px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 22px;
  margin-bottom: 18px;
  background: none;
  box-shadow: none;
  padding: 0;
  border-radius: 0;
  border: none;
`;

const HeaderIcon = styled.div`
  background: linear-gradient(135deg, #7c3aed 0%, #5a0fd6 100%);
  color: #fff;
  border-radius: 16px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.1rem;
  box-shadow: 0 4px 18px #7c3aed33, 0 1.5px 8px #0006 inset;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(90deg, #a084ff 0%, #5a0fd6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  letter-spacing: -1.2px;
`;

const SubTitle = styled.div`
  color: #b3b3c6;
  font-size: 1.13rem;
  font-weight: 500;
  margin-top: 2px;
`;

const Tabs = styled.div`
  display: flex;
  background: #101014;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  border-bottom: 2px solid #2d1a4d;
  box-shadow: 0 2px 8px #7c3aed11;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 18px;
  background: none;
  border: none;
  border-bottom: ${({ active }) => active ? '3px solid #a084ff' : 'none'};
  font-weight: 700;
  color: ${({ active }) => active ? '#a084ff' : '#b3b3c6'};
  font-size: 1.13rem;
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s, background 0.18s;
  border-radius: 0;
  letter-spacing: 0.2px;
  &:hover {
    background: #18181f;
    color: #a084ff;
  }
`;

const Card = styled.div`
  background: #101014;
  border-radius: 20px;
  box-shadow: 0 4px 24px 0 #7c3aed18, 0 1.5px 8px #0006 inset;
  border: 1.5px solid #2d1a4d;
  margin-bottom: 40px;
  padding: 0;
  backdrop-filter: blur(18px);
`;

const CardSection = styled.div`
  padding: 32px 32px 18px 32px;
`;

const FiltersBar = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
  background: #101014;
  border-radius: 14px;
  padding: 14px 18px;
  box-shadow: 0 2px 8px #7c3aed11;
`;

const SearchInput = styled.input`
  flex: 1;
  background: #18181f;
  border: 1.5px solid #2d1a4d;
  color: #fff;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.5px solid #a084ff;
    box-shadow: 0 0 0 2px #a084ff33;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(90deg, #5a0fd6 0%, #7c3aed 100%);
  color: #fff;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 8px #5a0fd61a;
  &:hover {
    background: linear-gradient(90deg, #7c3aed 0%, #5a0fd6 100%);
    animation: ${glowAnimation} 1.5s infinite;
  }
`;

const TableCard = styled(Card)`
  padding: 0;
`;

const TableTitle = styled.div`
  color: #ede6fa;
  font-size: 1.25rem;
  font-weight: 900;
  padding: 24px 24px 0 24px;
  background: linear-gradient(90deg, #fff 0%, #b3b3c6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: none;
  box-shadow: none;
  th, td {
    padding: 16px 12px;
    text-align: left;
    font-size: 1rem;
  }
  thead tr {
    background: rgba(24,18,43,0.98);
    position: sticky;
    top: 0;
    z-index: 2;
  }
  th {
    font-weight: 600;
    color: #b3b3c6;
    border-bottom: 1.5px solid #2d1a4d;
    background: none;
  }
  tbody tr {
    border-bottom: 1px solid #18181F;
    transition: background 0.18s;
    &:hover {
      background: rgba(90, 15, 214, 0.06);
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.98rem;
  font-weight: 600;
  color: ${({ status }) => status === 'Pago' ? '#5a0fd6' : status === 'Atrasado' ? '#ff4d6d' : '#fbbf24'};
  background: ${({ status }) => status === 'Pago' ? 'rgba(90, 15, 214, 0.13)' : status === 'Atrasado' ? 'rgba(255,77,109,0.13)' : 'rgba(251,191,36,0.13)'};
  border-radius: 8px;
  padding: 6px 14px;
`;

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
  min-width: 400px;
  background: #101014;
  border-radius: 24px;
  box-shadow: 0 8px 32px #5a0fd633;
  border: 2.5px solid #2d1a4d;
  padding: 48px;
  color: #fff;
  font-family: 'Poppins', 'Inter', Arial, sans-serif;
  @media (max-width: 500px) {
    min-width: 90vw;
    padding: 24px 8px;
  }
`;

const ModalTitle = styled.h2`
  color: #5a0fd6;
  margin-bottom: 28px;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.2px;
`;

const ModalLabel = styled.label`
  font-weight: 700;
  color: #fff;
  font-size: 1.08rem;
`;

const ModalInput = styled.input`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 28px;
  background: rgba(34,25,77,0.18);
  border: 1.5px solid #2d1a4d;
  color: #fff;
  border-radius: 10px;
  padding: 14px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.5px solid #5a0fd6;
    box-shadow: 0 0 0 2px #5a0fd633;
  }
`;

const ModalSelect = styled.select`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 28px;
  background: rgba(34,25,77,0.18);
  border: 1.5px solid #2d1a4d;
  color: #fff;
  border-radius: 10px;
  padding: 14px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.5px solid #5a0fd6;
    box-shadow: 0 0 0 2px #5a0fd633;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;

const NotificationBell = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 2000;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BellIcon = styled.div`
  position: relative;
  font-size: 2.1rem;
  color: #a084ff;
  transition: color 0.18s;
  &:hover {
    color: #fff;
  }
`;

const BellBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4d6d;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: 50%;
  padding: 2px 7px;
  min-width: 22px;
  min-height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #101014;
`;

const NotifDropdown = styled.div`
  position: fixed;
  top: 70px;
  right: 48px;
  width: 340px;
  max-height: 420px;
  background: #101014;
  border-radius: 18px;
  box-shadow: 0 8px 32px #0008;
  border: 1.5px solid #2d1a4d;
  z-index: 1300;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeInNotif 0.18s;
  @keyframes fadeInNotif {
    from { opacity: 0; transform: translateY(-18px); }
    to { opacity: 1; transform: none; }
  }
`;

const NotifHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 10px 22px;
  background: #18181f;
  border-bottom: 1.5px solid #23232b;
`;

const NotifTitle = styled.div`
  color: #a084ff;
  font-size: 1.18rem;
  font-weight: 800;
`;

const NotifClose = styled.button`
  background: none;
  border: none;
  color: #b3b3c6;
  font-size: 1.3rem;
  cursor: pointer;
  transition: color 0.18s;
  &:hover { color: #ff4d6d; }
`;

const NotifList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 0 10px 0;
  background: #101014;
`;

const NotifItem = styled.div`
  padding: 14px 22px;
  border-bottom: 1px solid #23232b;
  color: #ede6fa;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: ${({ unread }) => unread ? '#18181f' : 'none'};
`;

const NotifMsg = styled.div`
  font-weight: 600;
  color: #ede6fa;
`;

const NotifMeta = styled.div`
  font-size: 0.93rem;
  color: #b3b3c6;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

function IconCheck() {
  return <FiCheckCircle style={{ color: 'var(--color-purple)', fontSize: 22, verticalAlign: 'middle', filter: 'drop-shadow(0 1px 1px var(--color-purple)33)', transition: 'transform 0.2s' }} />;
}
function IconEdit() {
  return <FiEdit2 style={{ color: 'var(--color-purple)', fontSize: 20, cursor: 'pointer', verticalAlign: 'middle', transition: 'color 0.2s, transform 0.2s', filter: 'drop-shadow(0 1px 1px var(--color-purple)33)' }} />;
}
function IconDelete() {
  return <FiTrash2 style={{ color: '#ff4d6d', fontSize: 22, cursor: 'pointer', verticalAlign: 'middle', transition: 'color 0.2s, transform 0.2s', filter: 'drop-shadow(0 1px 1px var(--color-purple)33)' }} />;
}
function IconCopy() {
  return <FiCopy style={{ color: 'var(--color-purple2)', fontSize: 20, verticalAlign: 'middle', transition: 'color 0.2s' }} />;
}

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showIntegrate, setShowIntegrate] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutLink, setCheckoutLink] = useState('');
  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const [checkouts, setCheckouts] = useState([]);
  const [activeTab, setActiveTab] = useState('produto');
  const [search, setSearch] = useState('');
  const { collapsed, setCollapsed } = useSidebar();
  const sidebarWidth = collapsed ? 84 : 320;
  const [showNotif, setShowNotif] = useState(false);
  const { notifs, markAllRead } = useNotification();

  useEffect(() => {
    const importarProdutos = async () => {
      setLoading(true);
      setError('');
      setShowIntegrate(false);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }
      const userId = session.user.id;
      const { data: integrations } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('integration_name', 'pushin_pay')
        .single();
      const token = integrations?.api_key;
      if (!token) {
        setShowIntegrate(true);
        setLoading(false);
        return;
      }
      let produtosPushin = [];
      try {
        produtosPushin = await listPushinPayProducts(token);
      } catch (e) {
        setError('Erro ao buscar produtos na Pushin Pay: ' + e.message);
        setLoading(false);
        return;
      }
      for (const prod of produtosPushin) {
        await supabase.from('products').upsert({
          user_id: userId,
          external_product_id: prod.external_product_id,
          name: prod.name,
          description: prod.description,
          price: prod.price,
        }, { onConflict: ['user_id', 'external_product_id'] });
      }
      const { data: meusProdutos, error: errProdutos } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId);
      if (errProdutos) {
        setError('Erro ao carregar produtos.');
      } else {
        setProdutos(meusProdutos.map(prod => {
          const pushin = produtosPushin.find(p => p.external_product_id === prod.external_product_id);
          return { ...prod, imageUrl: pushin?.imageUrl };
        }));
      }
      const { data: meusCheckouts } = await supabase
        .from('checkouts')
        .select('*')
        .eq('user_id', userId);
      setCheckouts(meusCheckouts || []);
      setLoading(false);
    };
    importarProdutos();
  }, []);

  const handleOpenCheckoutForm = (produto) => {
    setCheckoutProduct(produto);
    setCheckoutName('');
    setCheckoutLink('');
    setShowCheckoutForm(true);
  };

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (!checkoutProduct) return;
    setCreatingCheckout(true);
    setCheckoutLink('');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError('Usuário não autenticado.');
      setCreatingCheckout(false);
      return;
    }
    const userId = session.user.id;
    const { data, error: err } = await supabase.from('checkouts').insert({
      user_id: userId,
      product_id: checkoutProduct.id,
      checkout_name: checkoutName,
    }).select().single();
    if (err) {
      setError('Erro ao criar checkout: ' + err.message);
      setCreatingCheckout(false);
      return;
    }
    const generatedLink = `${window.location.origin}/checkout/${data.id}`;
    await supabase.from('checkouts').update({ generated_link: generatedLink }).eq('id', data.id);
    const novoCheckout = { ...data, generated_link: generatedLink };
    setCheckoutLink(generatedLink);
    setCheckouts([...checkouts, novoCheckout]);
    setShowCheckoutForm(false);
    setCreatingCheckout(false);
  };

  const getCheckoutsForProduct = (productId) => checkouts.filter(c => c.product_id === productId);

  const handleDeleteCheckout = async (checkoutId) => {
    await supabase.from('checkouts').delete().eq('id', checkoutId);
    setCheckouts(checkouts.filter(c => c.id !== checkoutId));
  };

  // Filtro de busca
  const filteredCheckouts = checkouts.filter(ck => {
    if (!search) return true;
    const prod = produtos.find(p => p.id === ck.product_id);
    return (
      (prod?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (ck.generated_link || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  // Fecha dropdown ao clicar fora
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (showNotif) setShowNotif(false);
    }
    if (showNotif) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotif]);

  const unreadCount = notifs.filter(n => n.unread).length;

  function handleBellClick(e) {
    e.stopPropagation();
    setShowNotif(s => !s);
  }
  function handleNotifClose(e) {
    e.stopPropagation();
    setShowNotif(false);
  }

  return (
    <Container>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <NotificationBell onClick={handleBellClick} title="Notificações">
        <BellIcon>
          <FiBell />
          {unreadCount > 0 && <BellBadge>{unreadCount}</BellBadge>}
        </BellIcon>
      </NotificationBell>
      {showNotif && (
        <NotifDropdown onClick={e => e.stopPropagation()}>
          <NotifHeader>
            <NotifTitle>Notificações</NotifTitle>
            <NotifClose onClick={handleNotifClose}><FiX /></NotifClose>
          </NotifHeader>
          <NotifList>
            {notifs.length === 0 && (
              <NotifItem unread>
                <NotifMsg>Nenhuma notificação.</NotifMsg>
              </NotifItem>
            )}
            {notifs.map(n => (
              <NotifItem key={n.id} unread={n.unread}>
                <NotifMsg>{n.msg}</NotifMsg>
                <NotifMeta>
                  <span>{n.type}</span>
                  <span>•</span>
                  <span>{n.date instanceof Date ? n.date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : n.date}</span>
                </NotifMeta>
              </NotifItem>
            ))}
          </NotifList>
          <button style={{ background: '#23232b', color: '#ede6fa', fontWeight: 600, fontSize: 14, padding: 11, cursor: 'pointer', width: '100%', border: 'none', borderTop: '1px solid #23232b', borderRadius: '0 0 16px 16px', transition: 'background 0.18s, color 0.18s', letterSpacing: 0.1 }} onClick={markAllRead}>Marcar todas como lidas</button>
        </NotifDropdown>
      )}
      <Main marginLeft={sidebarWidth}>
        <div style={{ marginTop: 32 }} />
        <Header>
          <HeaderIcon>
            <FiBox />
          </HeaderIcon>
          <Title>Produtos</Title>
          <SubTitle>Gerencie seus produtos e checkouts</SubTitle>
        </Header>
        <Card>
          <Tabs>
            <TabButton active={activeTab === 'produto'} onClick={() => setActiveTab('produto')}>
              <FiBox style={{ marginRight: 8 }} /> Produto
            </TabButton>
            <TabButton active={activeTab === 'clientes'} onClick={() => setActiveTab('clientes')}>
              <FiUsers style={{ marginRight: 8 }} /> Clientes/Alunos
            </TabButton>
          </Tabs>
          {activeTab === 'produto' && (
            <CardSection>
              <FiltersBar>
                <SearchInput
                  type="text"
                  placeholder="Buscar cursos..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <ActionButton onClick={() => setShowCheckoutForm(true)}>
                  <FiPlus /> Novo Checkout
                </ActionButton>
                <ActionButton style={{ background: 'rgba(34,25,77,0.18)', color: '#b3b3c6' }}>Atualizar</ActionButton>
              </FiltersBar>
            </CardSection>
          )}
          {activeTab === 'clientes' && (
            <CardSection>
              <h3 style={{ color: '#5a0fd6', fontWeight: 700 }}>Em breve: listagem de clientes/alunos...</h3>
            </CardSection>
          )}
        </Card>
        {activeTab === 'produto' && (
          <TableCard>
            <TableTitle>Checkouts Gerados</TableTitle>
            <CardSection style={{ paddingTop: 0 }}>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Id do Produto Principal</th>
                    <th>Link Checkout</th>
                    <th>Criado em:</th>
                    <th style={{ textAlign: 'center' }}>Publicado</th>
                    <th style={{ textAlign: 'center' }}>Editar</th>
                    <th style={{ textAlign: 'center' }}>Excluir</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCheckouts.map((ck, i) => {
                    const prod = produtos.find(p => p.id === ck.product_id);
                    return (
                      <tr key={ck.id}>
                        <td>{prod?.external_product_id || '-'}</td>
                        <td style={{ display: 'flex', alignItems: 'center' }}>
                          <SearchInput as="input" value={ck.generated_link} readOnly style={{ width: '70%', marginRight: 12 }} />
                          <ActionButton type="button" style={{ padding: '7px 16px', fontSize: 20, background: 'rgba(76,12,122,0.15)' }} onClick={() => navigator.clipboard.writeText(ck.generated_link)}>
                            <FiCopy />
                          </ActionButton>
                        </td>
                        <td>{ck.created_at ? new Date(ck.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '-'}</td>
                        <td style={{ textAlign: 'center' }}><FiCheckCircle style={{ color: '#5a0fd6', fontSize: 22 }} /></td>
                        <td style={{ textAlign: 'center' }}><FiEdit2 style={{ color: '#5a0fd6', fontSize: 20, cursor: 'pointer' }} /></td>
                        <td style={{ textAlign: 'center' }}><FiTrash2 style={{ color: '#ff4d6d', fontSize: 22, cursor: 'pointer' }} onClick={() => handleDeleteCheckout(ck.id)} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </StyledTable>
            </CardSection>
          </TableCard>
        )}
        {showCheckoutForm && (
          <ModalOverlay>
            <ModalForm onSubmit={handleCreateCheckout}>
              <ModalTitle>Criar Novo Checkout</ModalTitle>
              <div style={{ marginBottom: 28 }}>
                <ModalLabel>Escolha o produto principal:</ModalLabel>
                <ModalSelect value={checkoutProduct?.id || ''} onChange={e => setCheckoutProduct(produtos.find(p => p.id === Number(e.target.value)))} required>
                  <option value="">Selecione...</option>
                  {produtos.map(prod => (
                    <option key={prod.id} value={prod.id}>{prod.name} (ID: {prod.external_product_id})</option>
                  ))}
                </ModalSelect>
              </div>
              <ModalInput
                type="text"
                placeholder="Nome do checkout (opcional)"
                value={checkoutName}
                onChange={e => setCheckoutName(e.target.value)}
              />
              <ModalActions>
                <ActionButton type="submit" disabled={creatingCheckout}>
                  {creatingCheckout ? 'Criando...' : 'Criar Checkout'}
                </ActionButton>
                <ActionButton type="button" style={{ background: 'rgba(24,24,31,0.98)', color: '#5a0fd6', border: '2.5px solid #2d1a4d' }} onClick={() => setShowCheckoutForm(false)}>Cancelar</ActionButton>
              </ModalActions>
            </ModalForm>
          </ModalOverlay>
        )}
      </Main>
    </Container>
  );
} 