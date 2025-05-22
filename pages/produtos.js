import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { supabase } from '../lib/supabaseClient';
import { listPushinPayProducts } from '../lib/pushinpay';
import { FiCheckCircle, FiEdit2, FiTrash2, FiCopy, FiBox, FiPlus, FiUsers, FiBell, FiX, FiCreditCard, FiZap } from 'react-icons/fi';
import { useSidebar } from '../components/SidebarContext';
import { useNotification } from '../components/NotificationContext';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';

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
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
  background: none;
  box-shadow: none;
  padding: 0;
  border-radius: 0;
  border: none;
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
  border-radius: 18px;
  border: none;
  box-shadow: none;
  margin-bottom: 24px;
  padding: 0;
  backdrop-filter: none;
`;

const FiltersBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  background: #101014;
  border-radius: 14px;
  padding: 14px 18px;
  box-shadow: none;
  border: 1px solid #23232b;
`;

const SearchInput = styled.input`
  flex: 1;
  background: #18181f;
  border: 1px solid #23232b;
  color: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border: 1px solid #fff;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #23232b;
  color: #fff;
  border: 1px solid #23232b;
  font-weight: 600;
  font-size: 1rem;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.18s, border 0.18s;
  box-shadow: none;
  &:hover {
    background: #18181f;
    border-color: #fff;
  }
`;

const TableCard = styled(Card)`
  padding: 0;
  border-radius: 16px;
  box-shadow: 0 2px 8px #0003;
  background: #131316;
`;

const TableTitle = styled.div`
  color: #fff;
  font-size: 1.18rem;
  font-weight: 800;
  padding: 20px 20px 0 20px;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  th, td {
    padding: 16px 12px;
    font-size: 1.04rem;
  }
  thead tr {
    background: #18181f;
    color: #e0e0e0;
    font-weight: 700;
    font-size: 1.08rem;
    border-radius: 10px 10px 0 0;
  }
  tbody tr {
    background: #131316;
    transition: background 0.18s;
  }
  tbody tr:nth-child(even) {
    background: #18181f;
    }
  tbody tr:hover {
    background: #18181f;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.98rem;
  font-weight: 600;
  color: ${({ status }) => status === 'Pago' ? '#00FFB2' : status === 'Atrasado' ? '#FF5F5F' : '#FFB800'};
  background: ${({ status }) => status === 'Pago' ? 'rgba(0,255,178,0.06)' : status === 'Atrasado' ? 'rgba(255,95,95,0.06)' : 'rgba(255,184,0,0.06)'};
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

const EmptyMessage = styled.td`
  text-align: center;
  color: #b3b3c6;
  font-size: 1.08rem;
  padding: 40px 0;
  font-weight: 500;
  letter-spacing: 0.1px;
`;

const DeleteErrorMsg = styled.div`
  position: absolute;
  left: 50%;
  top: 120px;
  transform: translateX(-50%);
  color: #ff4d6d;
  background: #18181f;
  border: 1.5px solid #23232b;
  border-radius: 12px;
  padding: 18px 32px;
  font-size: 1.13rem;
  font-weight: 700;
  text-align: center;
  z-index: 10;
  box-shadow: 0 2px 12px #0003;
`;

const ProductModalGrid = styled.form`
  display: flex;
  gap: 32px;
  background: #18121e;
  border-radius: 18px;
  border: 1.5px solid #a084ff22;
  box-shadow: 0 2px 16px #0004;
  padding: 38px 32px;
  min-width: 0;
  max-width: 900px;
  width: 98vw;
  color: #fff;
  max-height: 90vh;
  overflow-y: auto;
  @media (max-width: 900px) {
    flex-direction: column;
    padding: 18px 4px;
    gap: 18px;
  }
`;
const ProductImageSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-width: 260px;
  max-width: 340px;
`;
const ProductImageTitle = styled.h2`
  color: #a084ff;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  text-align: center;
`;
const ImageUploadBox = styled.div`
  border: 2px dashed #a084ff44;
  border-radius: 18px;
  background: #13101a;
  width: 100%;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 8px;
`;
const UploadIcon = styled.div`
  font-size: 2.6rem;
  color: #a084ff;
  margin-bottom: 10px;
`;
const UploadText = styled.div`
  color: #fff;
  text-align: center;
  font-size: 1.08rem;
  margin-bottom: 8px;
`;
const UploadInfo = styled.div`
  color: #b3b3c6;
  font-size: 0.98rem;
`;
const ProductDetailsSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 0;
`;
const ProductDetailsTitle = styled.h2`
  color: #a084ff;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 24px;
`;
const ProductLabel = styled.label`
  font-weight: 600;
  color: #fff;
  font-size: 1.04rem;
  margin-bottom: 2px;
  margin-top: 10px;
`;
const ProductInput = styled.input`
  width: 100%;
  margin-top: 8px;
  margin-bottom: 22px;
  background: #18181f;
  border: 1.2px solid #23232b;
  color: #fff;
  border-radius: 10px;
  padding: 13px 8px;
  font-size: 1.04rem;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.2px solid #a084ff;
    box-shadow: 0 0 0 1.5px #a084ff22;
  }
`;
const ProductSelect = styled.select`
  width: 100%;
  margin-top: 8px;
  margin-bottom: 10px;
  background: #18181f;
  border: 1.2px solid #23232b;
  color: #fff;
  border-radius: 10px;
  padding: 13px 8px;
  font-size: 1.04rem;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.2px solid #a084ff;
    box-shadow: 0 0 0 1.5px #a084ff22;
  }
`;
const ProductTextarea = styled.textarea`
  width: 100%;
  margin-top: 8px;
  margin-bottom: 22px;
  background: #18181f;
  border: 1.2px solid #23232b;
  color: #fff;
  border-radius: 10px;
  padding: 13px 8px;
  font-size: 1.04rem;
  outline: none;
  min-height: 80px;
  resize: vertical;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.2px solid #a084ff;
    box-shadow: 0 0 0 1.5px #a084ff22;
  }
`;
const ProductRow = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0;
  }
`;

const CardSection = styled.div`
  padding: 32px 32px 18px 32px;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  input { display: none; }
  span {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background: ${props => props.checked ? '#7b61ff' : '#23232b'};
    border-radius: 24px;
    transition: background 0.2s;
  }
  span:before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.2s;
    transform: ${props => props.checked ? 'translateX(20px)' : 'none'};
    box-shadow: 0 1px 6px #0003;
  }
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
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    integration: 'pushin_pay',
  });
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutTab, setCheckoutTab] = useState('geral');
  const [appearance, setAppearance] = useState({
    cor: '#a084ff',
    titulo: '',
    mensagem: '',
    logo: '',
    corCronometro: '#00E676',
    corFonteCronometro: '#fff',
    campos: { nome: true, cpf: true, email: true, telefone: true, observacao: false },
    placeholderNome: '',
    placeholderEmail: '',
    textoBotao: '',
    mensagemErro: '',
    tema: 'escuro',
    pixelFacebook: '',
    urlRedirecionamento: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const router = useRouter();

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
      // Sempre buscar produtos do banco, mesmo sem integração
      const { data: meusProdutos, error: errProdutos } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId);
      if (errProdutos) {
        setError('Erro ao carregar produtos.');
      } else {
        setProdutos(meusProdutos.map(p => ({
          ...p,
          generated_link: p.generated_link || p.generatedLink || '',
        })));
      }
      // Buscar checkouts normalmente
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
    // Sempre cria um novo checkout único para o produto/usuário
    const { data, error: err } = await supabase.from('checkouts').insert({
      user_id: userId,
      product_id: checkoutProduct.id,
      checkout_name: checkoutName,
    }).select().single();
    if (err || !data) {
      setError('Erro ao criar checkout: ' + (err?.message || 'Não foi possível criar o checkout.')); 
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

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setCreatingProduct(true);
    setError('');
    // Sempre tenta renovar a sessão antes de criar produto
    let { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session) {
      // Tenta renovar a sessão automaticamente
      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !refreshed?.session) {
        setCreatingProduct(false);
        window.location.href = '/login';
        return;
      }
      sessionData = refreshed;
    }
    const userId = sessionData.session.user.id;
    console.log('Produto a ser criado:', newProduct);
    // 1. Cria o produto
    const { data: produtoCriado, error: err } = await supabase.from('products').insert({
      user_id: userId,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      imageUrl: newProduct.imageUrl,
      integration: newProduct.integration,
    }).select().single();
    if (err) {
      console.log('Erro detalhado do Supabase:', err);
      if (err.message && err.message.toLowerCase().includes('jwt expired')) {
        setError('Sua sessão expirou. Faça login novamente.');
        // window.location.href = '/login';
      } else {
        setError('Erro ao criar produto: ' + err.message);
      }
      setCreatingProduct(false);
      return;
    }
    // 2. Cria o checkout relacionado ao produto
    let generatedLink = '';
    try {
      const { data: checkout, error: errCheckout } = await supabase.from('checkouts').insert({
        user_id: userId,
        product_id: produtoCriado.id,
        checkout_name: produtoCriado.name || '',
      }).select().single();
      if (!errCheckout && checkout) {
        generatedLink = `${window.location.origin}/checkout/${checkout.id}`;
        await supabase.from('checkouts').update({ generated_link: generatedLink }).eq('id', checkout.id);
        // Atualiza o produto com o link
        await supabase.from('products').update({ generated_link: generatedLink }).eq('id', produtoCriado.id);
      }
    } catch (e) {
      // Se der erro, só ignora o link
    }
    // Buscar a lista atualizada do banco
    const { data: meusProdutos, error: errProdutos } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId);
    if (errProdutos) {
      setError('Erro ao carregar produtos.');
    } else {
      setProdutos(meusProdutos.map(p => ({
        ...p,
        generated_link: p.generated_link || p.generatedLink || '',
      })));
    }
    setShowCreateProduct(false);
    setNewProduct({ name: '', description: '', price: '', imageUrl: '', integration: 'pushin_pay' });
    setCreatingProduct(false);
  };

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
          <HeaderIcon><FiBox /></HeaderIcon>
          <div>
          <Title>Produtos</Title>
          <SubTitle>Gerencie seus produtos e checkouts</SubTitle>
          </div>
        </Header>
        <Card>
          <Tabs>
            <TabButton active={activeTab === 'produto'} onClick={() => setActiveTab('produto')}>
              <FiBox style={{ marginRight: 8 }} /> Produto
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
                <ActionButton onClick={() => setShowCreateProduct(true)}>
                  <FiPlus /> Novo Produto
                </ActionButton>
              </FiltersBar>
            </CardSection>
          )}
          {activeTab === 'meus_checkouts' && (
            <CardSection>
              <h3 style={{ color: '#a084ff', fontWeight: 700, marginBottom: 24 }}>Meus Checkouts</h3>
              {!produtoSelecionado ? (
                <div style={{ color: '#b3b3c6' }}>Selecione um produto para editar o checkout.</div>
              ) : (
                <div style={{ background: '#18181f', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{produtoSelecionado.name}</span>
                  <ActionButton onClick={() => handleOpenCheckoutForm(produtoSelecionado)} style={{ fontSize: 15, padding: '8px 18px' }}>Editar Checkout</ActionButton>
                </div>
              )}
            </CardSection>
          )}
        </Card>
        {/* Tabela de produtos cadastrados */}
          <TableCard>
          <TableTitle>Meus Produtos</TableTitle>
            <CardSection style={{ paddingTop: 0 }}>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Id do Produto Principal</th>
                    <th>Link Checkout</th>
                    <th>Criado em:</th>
                  <th>Publicado</th>
                    <th style={{ textAlign: 'center' }}>Editar</th>
                    <th style={{ textAlign: 'center' }}>Excluir</th>
                  </tr>
                </thead>
                <tbody>
                {produtos.length === 0 && (
                  <tr><EmptyMessage colSpan={6}>Nenhum produto cadastrado.</EmptyMessage></tr>
                )}
                {produtos.map((prod, i) => (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                        <td style={{ display: 'flex', alignItems: 'center' }}>
                      {prod.generated_link ? (
                        <SearchInput as="input" value={prod.generated_link} readOnly style={{ width: '70%', marginRight: 12 }} />
                      ) : (
                        <span style={{ color: '#b3b3c6' }}>-</span>
                      )}
                      {prod.generated_link && (
                        <ActionButton type="button" style={{ padding: '7px 16px', fontSize: 20, background: 'rgba(76,12,122,0.15)' }} onClick={() => navigator.clipboard.writeText(prod.generated_link)}>
                            <FiCopy />
                          </ActionButton>
                      )}
                    </td>
                    <td>{prod.created_at ? new Date(prod.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '-'}</td>
                    <td style={{ textAlign: 'center' }}><FiCheckCircle style={{ color: '#00FFB2', fontSize: 22, opacity: 1 }} /></td>
                    <td style={{ textAlign: 'center' }}>
                      <ActionButton onClick={() => {
                        setProdutoSelecionado(prod);
                        setShowCheckoutModal(true);
                      }} style={{ fontSize: 15, padding: '8px 18px' }}>Editar</ActionButton>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <FiTrash2 style={{ color: '#b3b3c6', fontSize: 22, cursor: 'pointer', opacity: 0.8 }} onClick={async () => {
                        setDeleteError('');
                        if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
                        const { error } = await supabase.from('products').delete().eq('id', prod.id);
                        if (error) {
                          setDeleteError('Erro ao excluir produto: ' + error.message);
                        } else {
                          setProdutos(produtos.filter(p => p.id !== prod.id));
                        }
                      }} />
                        </td>
                      </tr>
                ))}
                </tbody>
              </StyledTable>
            </CardSection>
          </TableCard>
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
        {showCreateProduct && (
          <ModalOverlay>
            <ProductModalGrid onSubmit={handleCreateProduct}>
              <ProductImageSection>
                <ProductImageTitle>Imagem do Produto</ProductImageTitle>
                <ImageUploadBox>
                  <UploadIcon>⬆️</UploadIcon>
                  <UploadText>
                    Arraste e solte um arquivo<br />ou clique para selecionar
                  </UploadText>
                  <UploadInfo>Máximo 15.00MB</UploadInfo>
                  {/* Aqui você pode implementar o input de upload real depois */}
                </ImageUploadBox>
              </ProductImageSection>
              <ProductDetailsSection>
                <ProductDetailsTitle>Detalhes do Produto</ProductDetailsTitle>
                <ProductLabel>Nome do Produto</ProductLabel>
                <ProductInput required value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} />
                <ProductRow>
                  <div style={{ flex: 1, marginRight: 12 }}>
                    <ProductLabel>Categoria</ProductLabel>
                    <ProductSelect value={newProduct.integration} onChange={e => setNewProduct(p => ({ ...p, integration: e.target.value }))}>
                      <option value="">Selecione a categoria</option>
                <option value="pushin_pay">Pushin Pay</option>
                    </ProductSelect>
                  </div>
                  <div style={{ flex: 1 }}>
                    <ProductLabel>Preço</ProductLabel>
                    <ProductInput required type="number" min="0" step="0.01" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} />
                  </div>
                </ProductRow>
                <ProductLabel>Descrição do Produto</ProductLabel>
                <ProductTextarea required value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} />
                <ModalActions style={{ marginTop: 18 }}>
                <ActionButton type="submit" disabled={creatingProduct}>{creatingProduct ? 'Criando...' : 'Criar Produto'}</ActionButton>
                <ActionButton type="button" style={{ background: 'rgba(24,24,31,0.98)', color: '#5a0fd6', border: '2.5px solid #2d1a4d' }} onClick={() => setShowCreateProduct(false)}>Cancelar</ActionButton>
              </ModalActions>
              {error && <div style={{ color: '#ff4d6d', marginTop: 8 }}>{error}</div>}
              </ProductDetailsSection>
            </ProductModalGrid>
          </ModalOverlay>
        )}
        {showCheckoutModal && produtoSelecionado && (
          <ModalOverlay>
            <ProductModalGrid style={{ maxWidth: 900, minWidth: 0, width: '98vw', flexDirection: 'column', gap: 0, padding: '32px 32px 24px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <FiCreditCard size={28} color="#a084ff" />
                <h2 style={{ color: '#a084ff', fontWeight: 800, fontSize: 24, margin: 0 }}>Checkout</h2>
              </div>
              <div style={{ display: 'flex', gap: 18, marginBottom: 28, borderBottom: '1.5px solid #23232b' }}>
                <div onClick={() => setCheckoutTab('geral')} style={{ color: checkoutTab === 'geral' ? '#a084ff' : '#b3b3c6', fontWeight: checkoutTab === 'geral' ? 700 : 600, fontSize: 17, padding: '8px 0', borderBottom: checkoutTab === 'geral' ? '2.5px solid #a084ff' : 'none', cursor: 'pointer' }}>Geral</div>
                <div onClick={() => setCheckoutTab('aparencia')} style={{ color: checkoutTab === 'aparencia' ? '#a084ff' : '#b3b3c6', fontWeight: checkoutTab === 'aparencia' ? 700 : 600, fontSize: 17, padding: '8px 0', borderBottom: checkoutTab === 'aparencia' ? '2.5px solid #a084ff' : 'none', cursor: 'pointer' }}>Aparência</div>
                <div onClick={() => setCheckoutTab('pagamento')} style={{ color: checkoutTab === 'pagamento' ? '#a084ff' : '#b3b3c6', fontWeight: checkoutTab === 'pagamento' ? 700 : 600, fontSize: 17, padding: '8px 0', borderBottom: checkoutTab === 'pagamento' ? '2.5px solid #a084ff' : 'none', cursor: 'pointer' }}>Pagamento</div>
              </div>
              {checkoutTab === 'geral' && (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setCreatingProduct(true);
                  setError('');
                  const { error } = await supabase.from('products').update({ name: produtoSelecionado.name, integration: produtoSelecionado.integration }).eq('id', produtoSelecionado.id);
                  if (error) {
                    setError('Erro ao salvar: ' + error.message);
                  } else {
                    setShowCheckoutModal(false);
                  }
                  setCreatingProduct(false);
                }}>
                  <ProductLabel>Nome do Produto</ProductLabel>
                  <ProductInput value={produtoSelecionado.name} onChange={e => setProdutoSelecionado(p => ({ ...p, name: e.target.value }))} />
                  <ProductLabel>Integração de Pagamento</ProductLabel>
                  <ProductSelect value={produtoSelecionado.integration} onChange={e => setProdutoSelecionado(p => ({ ...p, integration: e.target.value }))}>
                    <option value="pushin_pay">Pushin Pay</option>
                  </ProductSelect>
                  <ProductLabel>Descrição</ProductLabel>
                  <ProductInput value={produtoSelecionado.description} disabled />
                  <ProductLabel>Preço</ProductLabel>
                  <ProductInput value={produtoSelecionado.price} disabled />
                  <ProductLabel>Link do Checkout</ProductLabel>
                  <ProductInput value={produtoSelecionado.generated_link || ''} disabled />
                  <ModalActions style={{ marginTop: 18 }}>
                    <ActionButton type="submit" disabled={creatingProduct}>{creatingProduct ? 'Salvando...' : 'Salvar Alterações'}</ActionButton>
                    <ActionButton type="button" style={{ background: 'rgba(24,24,31,0.98)', color: '#5a0fd6', border: '2.5px solid #2d1a4d' }} onClick={() => setShowCheckoutModal(false)}>Cancelar</ActionButton>
                  </ModalActions>
                  {error && <div style={{ color: '#ff4d6d', marginTop: 8 }}>{error}</div>}
                </form>
              )}
              {checkoutTab === 'aparencia' && (
                <form onSubmit={e => { e.preventDefault(); setShowCheckoutModal(false); }}>
                  <div style={{ marginBottom: 32, background: '#18181f', borderRadius: 14, boxShadow: '0 2px 8px #0002', padding: 24 }}>
                    <div style={{ fontWeight: 700, color: '#a084ff', fontSize: 16, marginBottom: 16 }}>Logo, Tema e Cores</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 18 }}>
                      <div style={{ flex: 1 }}>
                        <ProductLabel>Banner (URL da imagem)</ProductLabel>
                        <ProductInput value={appearance.logo} onChange={e => setAppearance(a => ({ ...a, logo: e.target.value }))} placeholder="Cole a URL do banner do checkout" />
                      </div>
                      {appearance.logo && (
                        <div style={{ background: '#23232b', borderRadius: 12, boxShadow: '0 2px 8px #0004', padding: 10, display: 'flex', alignItems: 'center', minHeight: 60, minWidth: 80 }}>
                          <img src={appearance.logo} alt="Logo preview" style={{ maxHeight: 48, maxWidth: 120, borderRadius: 8, background: '#23232b', padding: 4 }} />
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Tema</span>
                        <Switch checked={appearance.tema === 'escuro'} style={{ marginLeft: 8 }}>
                          <input type="checkbox" checked={appearance.tema === 'escuro'} onChange={e => setAppearance(a => ({ ...a, tema: e.target.checked ? 'escuro' : 'claro' }))} />
                          <span />
                        </Switch>
                        <span style={{ color: '#b3b3c6', fontWeight: 600, fontSize: 14, marginLeft: 8 }}>{appearance.tema === 'escuro' ? 'Escuro' : 'Claro'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 8 }}>
                      {[{label: 'Principal', key: 'cor'}, {label: 'Cronômetro', key: 'corCronometro'}, {label: 'Fonte Cronômetro', key: 'corFonteCronometro'}].map(corOpt => (
                        <div key={corOpt.key} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                          <span style={{ color: '#fff', fontWeight: 600, fontSize: 15, minWidth: 120 }}>{corOpt.label}</span>
                          <input type="color" value={appearance[corOpt.key]} onChange={e => setAppearance(a => ({ ...a, [corOpt.key]: e.target.value }))} style={{ width: 36, height: 36, border: 'none', background: 'none', marginLeft: 8 }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 32, background: '#18181f', borderRadius: 14, boxShadow: '0 2px 8px #0002', padding: 24 }}>
                    <div style={{ fontWeight: 700, color: '#a084ff', fontSize: 16, marginBottom: 16 }}>Campos do Checkout</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 400 }}>
                      {[
                        { key: 'nome', label: 'Nome', placeholder: 'Placeholder do Nome', placeholderKey: 'placeholderNome' },
                        { key: 'cpf', label: 'CPF' },
                        { key: 'email', label: 'E-mail', placeholder: 'Placeholder do E-mail', placeholderKey: 'placeholderEmail' },
                        { key: 'telefone', label: 'Telefone' },
                        { key: 'observacao', label: 'Observação' },
                      ].map(campo => (
                        <div key={campo.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: appearance.campos[campo.key] ? '#a084ff22' : 'transparent', borderRadius: 8, padding: '8px 16px', transition: 'background 0.2s', marginBottom: campo.placeholder ? 8 : 0 }}>
                          <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{campo.label}</span>
                          <Switch checked={appearance.campos[campo.key]}>
                            <input type="checkbox" checked={appearance.campos[campo.key]} onChange={e => setAppearance(a => ({ ...a, campos: { ...a.campos, [campo.key]: e.target.checked } }))} />
                            <span />
                          </Switch>
                        </div>
                      ))}
                      {/* Placeholders para Nome e Email */}
                      {appearance.campos.nome && (
                        <ProductInput style={{ marginTop: 0, marginBottom: 10 }} value={appearance.placeholderNome} onChange={e => setAppearance(a => ({ ...a, placeholderNome: e.target.value }))} placeholder="Placeholder do campo Nome (opcional)" />
                      )}
                      {appearance.campos.email && (
                        <ProductInput style={{ marginTop: 0, marginBottom: 10 }} value={appearance.placeholderEmail} onChange={e => setAppearance(a => ({ ...a, placeholderEmail: e.target.value }))} placeholder="Placeholder do campo E-mail (opcional)" />
                      )}
                    </div>
                    <div style={{ color: '#b3b3c6', fontSize: 13, marginTop: 10 }}>
                      <span>Todos os campos ativados são obrigatórios para o cliente preencher.</span>
                    </div>
                  </div>
                  <div style={{ marginBottom: 32, background: '#18181f', borderRadius: 14, boxShadow: '0 2px 8px #0002', padding: 24 }}>
                    <div style={{ fontWeight: 700, color: '#a084ff', fontSize: 16, marginBottom: 16 }}>Textos e Mensagens</div>
                    <ProductLabel>Título do Checkout</ProductLabel>
                    <ProductInput value={appearance.titulo} onChange={e => setAppearance(a => ({ ...a, titulo: e.target.value }))} />
                    <ProductLabel>Mensagem de Agradecimento</ProductLabel>
                    <ProductInput value={appearance.mensagem} onChange={e => setAppearance(a => ({ ...a, mensagem: e.target.value }))} />
                    <ProductLabel>Texto do Botão de Pagamento</ProductLabel>
                    <ProductInput value={appearance.textoBotao} onChange={e => setAppearance(a => ({ ...a, textoBotao: e.target.value }))} placeholder="Ex: Pagar com PIX" />
                    <ProductLabel>Mensagem de Erro Personalizada</ProductLabel>
                    <ProductInput value={appearance.mensagemErro} onChange={e => setAppearance(a => ({ ...a, mensagemErro: e.target.value }))} placeholder="Ex: Preencha todos os campos obrigatórios" />
                  </div>
                  <div style={{ marginBottom: 32, background: '#18181f', borderRadius: 14, boxShadow: '0 2px 8px #0002', padding: 24 }}>
                    <div style={{ fontWeight: 700, color: '#a084ff', fontSize: 16, marginBottom: 16 }}>Integrações e Redirecionamento</div>
                    <ProductLabel>Pixel do Facebook</ProductLabel>
                    <ProductInput value={appearance.pixelFacebook} onChange={e => setAppearance(a => ({ ...a, pixelFacebook: e.target.value }))} placeholder="Cole o código do Pixel do Facebook" />
                    <ProductLabel>Link de Redirecionamento após Pagamento</ProductLabel>
                    <ProductInput value={appearance.urlRedirecionamento} onChange={e => setAppearance(a => ({ ...a, urlRedirecionamento: e.target.value }))} placeholder="https://seudominio.com/obrigado" />
                  </div>
                  <ModalActions style={{ marginTop: 18 }}>
                    <ActionButton type="submit">Salvar Aparência</ActionButton>
                    <ActionButton type="button" style={{ background: 'rgba(24,24,31,0.98)', color: '#5a0fd6', border: '2.5px solid #2d1a4d' }} onClick={() => setShowCheckoutModal(false)}>Cancelar</ActionButton>
                  </ModalActions>
                </form>
              )}
              {checkoutTab === 'pagamento' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 32, marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#23232b', borderRadius: 10, padding: '16px 32px', border: '2px solid #00E676' }}>
                    <FiZap size={28} color="#00E676" />
                    <span style={{ color: '#00E676', fontWeight: 700, fontSize: 18 }}>PIX</span>
                    <input type="radio" checked readOnly style={{ accentColor: '#00E676', width: 22, height: 22, marginLeft: 18 }} />
                  </div>
                </div>
              )}
            </ProductModalGrid>
          </ModalOverlay>
        )}
        {deleteError && <DeleteErrorMsg>{deleteError}</DeleteErrorMsg>}
      </Main>
    </Container>
  );
} 