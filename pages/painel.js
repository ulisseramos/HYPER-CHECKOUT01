import React, { useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import styled from 'styled-components';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { FiDollarSign, FiCalendar, FiCreditCard, FiGrid, FiFileText, FiActivity, FiZap, FiBell, FiX } from 'react-icons/fi';
import { useSidebar } from '../components/SidebarContext';
import { keyframes } from 'styled-components';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const Container = styled.div`
  min-height: 100vh;
  background: #0b0b0e;
  color: #F1F1F6;
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
  gap: 0;
  position: relative;
  z-index: 1;
  transition: margin-left 0.35s cubic-bezier(.77,0,.18,1);
  @media (max-width: 900px) {
    margin-left: 0;
    padding: 0 8px 40px 8px;
  }
`;

const DashboardContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const WelcomeHeader = styled.div`
  width: 100%;
  max-width: 100%;
  flex: 1;
  min-width: 0;
  padding: 0;
  border-radius: 18px;
  background: none;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  margin-bottom: 0 !important;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0;
`;

const DashboardTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 0;
  background: linear-gradient(90deg, #a084ff 0%, #5a0fd6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: anywhere;
`;
const WelcomeTitle = styled.h2`
  font-size: 2.1rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: -1.2px;
  line-height: 1.08;
  display: inline-block;
  background: linear-gradient(90deg, #fff 0%, #a084ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: anywhere;
  @media (max-width: 700px) {
    font-size: 1.3rem;
  }
`;
const WelcomeHighlight = styled.span`
  color: #a084ff;
  font-weight: 900;
  text-shadow: 0 2px 12px #7c3aed33;
`;
const WelcomeSub = styled.div`
  color: #bcb8d0;
  font-size: 1.05rem;
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.2px;
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: anywhere;
  @media (max-width: 700px) {
    font-size: 0.95rem;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 18px;
  margin-top: 0;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;
const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background: #101014;
  border-radius: 16px;
  border: 1.2px solid #23232b;
  box-shadow: none;
  padding: 28px 36px 24px 36px;
  min-height: 110px;
  position: relative;
  overflow: hidden;
`;
const CardIconGlass = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #18181f;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.2px solid #23232b;
  position: absolute;
  top: 18px;
  left: 24px;
`;
const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  padding-left: 64px;
  padding-top: 2px;
`;
const CardTitle = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.98rem;
  font-weight: 600;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const CardValue = styled.div`
  font-size: 1.45rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0.7px;
`;
const CardDetailsLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.98rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  padding-bottom: 2px;
  transition: color 0.18s;
  &::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 2px;
    background: linear-gradient(90deg, #a084ff 0%, #5a0fd6 100%);
    border-radius: 2px;
    transform: scaleX(0);
    transition: transform 0.22s cubic-bezier(0.4,0.2,0.2,1);
    transform-origin: left;
  }
  &:hover {
    color: #fff;
    &::after { transform: scaleX(1); }
  }
`;

const ChartCard = styled.div`
  background: #101014;
  border-radius: 16px;
  border: 1.2px solid #23232b;
  box-shadow: none;
  padding: 32px 28px 22px 28px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin-top: 0;
  transition: border 0.18s, transform 0.14s cubic-bezier(0.4,0.2,0.2,1);
  will-change: transform, border;
  &:hover {
    border: 1.5px solid #23232b;
    transform: scale(1.01) translateY(-2px);
  }
`;
const ChartTitleStyled = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
  font-weight: 900;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const ChartSub = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.92rem;
  margin-bottom: 10px;
  opacity: 0.8;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: stretch;
  width: 100%;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentMethodsCard = styled.div`
  background: #101014;
  border-radius: 16px;
  border: 1.2px solid #23232b;
  box-shadow: none;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
  transition: none;
  will-change: unset;
`;
const PaymentTitle = styled.div`
  background: linear-gradient(90deg, #5a0fd6 0%, #00e6ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.3rem;
  font-weight: 900;
  margin-bottom: 2px;
`;
const PaymentSub = styled.div`
  color: #b3b3c6;
  font-size: 1rem;
  margin-bottom: 12px;
`;
const PaymentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const PaymentItem = styled.div`
  display: flex;
  align-items: center;
  background: #101014;
  border-radius: 12px;
  padding: 20px 22px;
  border: 1.2px solid #23232b;
  justify-content: space-between;
  margin-bottom: 8px;
`;
const PaymentIconCircle = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #16161a;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.2px solid #23232b;
  margin-right: 18px;
`;
const PaymentInfo = styled.div`
  flex: 1;
`;
const PaymentName = styled.div`
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
`;
const PaymentDesc = styled.div`
  color: #b3b3c6;
  font-size: 0.98rem;
`;
const PaymentValue = styled.div`
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
`;
const PaymentSoon = styled.div`
  color: #b3b3c6;
  font-size: 0.95rem;
  font-style: italic;
`;

const BarChartCard = styled(ChartCard)`
  height: 100%;
  min-height: 0;
  max-height: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: none;
  will-change: unset;
  &:hover {
    box-shadow: 0 2px 8px #0004;
    border: 1px solid rgba(90, 15, 214, 0.3);
    transform: none;
  }
`;
const BarChartTitle = styled.div`
  color: #ede6fa;
  font-size: 1.25rem;
  font-weight: 900;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const BarChartSub = styled.div`
  color: #b3b3c6;
  font-size: 0.92rem;
  margin-bottom: 10px;
  opacity: 0.8;
`;

const barData = {
  labels: [
    '00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h',
  ],
  datasets: [
    {
      label: 'Vendas',
      data: [50, 60, 80, 120, 150, 200, 300, 400, 600, 800, 900, 1000, 700, 800, 900, 1200, 800, 600, 900, 700, 800, 600, 400, 200],
      backgroundColor: '#5a0fd6',
      borderRadius: 6,
      barPercentage: 0.7,
      categoryPercentage: 0.8,
    },
  ],
};

const PixIcon = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 20L20 13.5L26.5 20L20 26.5L13.5 20Z" fill="#ede6fa"/>
    <path d="M20 15.5L24.5 20L20 24.5L15.5 20L20 15.5Z" fill="#ede6fa"/>
  </svg>
);

const paymentMethods = [
  {
    name: 'Cartão',
    desc: 'Pagamentos com cartão de crédito e débito',
    value: 'R$ ***',
    icon: <FiCreditCard size={24} />,
    soon: true,
  },
  {
    name: 'PIX',
    desc: 'Transferências instantâneas via PIX',
    value: 'R$ ***',
    icon: <PixIcon />,
    soon: true,
  },
  {
    name: 'Boleto',
    desc: 'Pagamentos via boleto bancário',
    value: 'R$ ***',
    icon: <FiFileText size={24} />,
    soon: true,
  },
];

const cardsData = [
  {
    id: 'vendas_hoje',
    title: 'Total em Vendas hoje',
    value: 'R$ 0,00',
    icon: <FiDollarSign />,
  },
  {
    id: 'vendas_mes',
    title: 'Total em Vendas este mês',
    value: 'R$ 0,00',
    icon: <FiCalendar />,
  },
  {
    id: 'saldo',
    title: 'Saldo disponível',
    value: 'R$ 0,00',
    icon: <FiCreditCard />,
    details: true,
  },
];

const FadeIn = styled.div`
  animation: fadeInUp 0.8s cubic-bezier(0.4,0.2,0.2,1);
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: none; }
  }
`;

const MetaCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;
  max-width: 260px;
  background: #101014;
  border-radius: 14px;
  box-shadow: none;
  border: 1.2px solid #23232b;
  padding: 16px 22px 14px 22px;
  gap: 8px;
  margin-left: 32px;
  @media (max-width: 900px) {
    margin-left: 0;
    align-self: flex-end;
    margin-top: 8px;
  }
`;
const MetaLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.13rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
  gap: 8px;
  letter-spacing: 0.5px;
`;
const MetaProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: #23232b;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px #0002 inset;
`;
const MetaProgress = styled.div`
  height: 100%;
  width: ${props => props.percent || 0}%;
  background: linear-gradient(90deg, #a084ff 0%, #5a0fd6 100%);
  border-radius: 8px;
  transition: width 0.4s cubic-bezier(0.4,0.2,0.2,1);
`;

const NotificationBell = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 2000;
  cursor: pointer;
  background: #101014;
  border: 1.5px solid #2d1a4d;
  border-radius: 16px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border 0.18s, background 0.18s;
  &:hover {
    border: 1.5px solid #a084ff;
    background: #18181f;
  }
`;
const BellIcon = styled.div`
  position: relative;
  font-size: 1.85rem;
  color: #a084ff;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const BellBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ff4d6d;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 500;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  pointer-events: none;
  animation: ${pulseAnim} 1.2s infinite;
`;
const pulseAnim = keyframes`
  0% { box-shadow: 0 0 0 0 #ff4d6d55; }
  70% { box-shadow: 0 0 0 6px #ff4d6d00; }
  100% { box-shadow: 0 0 0 0 #ff4d6d00; }
`;
const NotifDropdown = styled.div`
  position: fixed;
  top: 70px;
  right: 24px;
  width: 340px;
  max-height: 420px;
  background: #18181f;
  border-radius: 16px;
  box-shadow: 0 4px 24px #0006;
  border: 1.5px solid #23232b;
  z-index: 2100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeInNotif 0.18s;
  transition: box-shadow 0.18s, border 0.18s;
  @keyframes fadeInNotif {
    from { opacity: 0; transform: translateY(-18px); }
    to { opacity: 1; transform: none; }
  }
`;
const NotifHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 8px 20px;
  background: #18181f;
  border-bottom: 1px solid #23232b;
`;
const NotifTitle = styled.div`
  color: #fff;
  font-size: 1.08rem;
  font-weight: 700;
  letter-spacing: 0.1px;
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
  background: #18181f;
`;
const NotifItem = styled.div`
  padding: 13px 20px;
  border-bottom: 1px solid #23232b;
  color: #ede6fa;
  font-size: 0.98rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: ${({ unread }) => unread ? '#202027' : 'none'};
`;
const NotifMsg = styled.div`
  font-weight: 500;
  color: #fff;
`;
const NotifMeta = styled.div`
  font-size: 0.89rem;
  color: #b3b3c6;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function Painel() {
  const { collapsed, setCollapsed } = useSidebar();
  const sidebarWidth = collapsed ? 84 : 320;
  const chartRef = useRef();
  const [showNotif, setShowNotif] = React.useState(false);
  const [notifs, setNotifs] = React.useState([
    { id: 1, msg: 'Novo pagamento via PIX recebido!', type: 'PIX', date: new Date(), unread: true },
    { id: 2, msg: 'Pagamento aprovado!', type: 'Pagamento', date: new Date(Date.now() - 3600 * 1000), unread: true },
    { id: 3, msg: 'Checkout criado com sucesso.', type: 'Checkout', date: new Date(Date.now() - 2 * 3600 * 1000), unread: false },
  ]);
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
  function markAllRead() {
    setNotifs(n => n.map(nf => ({ ...nf, unread: false })));
  }

  // Função para criar gradiente roxo no gráfico de linha (área preenchida, mais bonito)
  const getGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.55)'); // Roxo mais forte no topo
    gradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.18)');
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0.01)'); // Quase transparente na base
    return gradient;
  };

  // Novo lineData com visual roxo
  const lineData = {
    labels: ['05/mai', '06/mai', '07/mai', '08/mai', '09/mai', '10/mai', '11/mai'],
    datasets: [
      {
        label: 'Vendas',
        data: [3400, 3200, 3100, 3600, 3150, 3250, 3850],
        borderColor: '#7c3aed',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#7c3aed',
        pointRadius: 7,
        pointHoverRadius: 10,
        borderWidth: 4,
        tension: 0.45,
        fill: true,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(124, 58, 237, 0.7)'); // Roxo sólido no topo
          gradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.35)'); // Roxo médio no meio
          gradient.addColorStop(1, 'rgba(124, 58, 237, 0.18)'); // Roxo translúcido na base
          return gradient;
        },
      },
    ],
  };

  // Exemplo de valores (pode ser dinâmico depois)
  const metaAtual = 0;
  const metaTotal = 10000;
  const metaPercent = Math.round((metaAtual / metaTotal) * 100);

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
                  <span>{n.date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </NotifMeta>
              </NotifItem>
            ))}
          </NotifList>
          <button style={{ background: '#23232b', color: '#ede6fa', fontWeight: 600, fontSize: 14, padding: 11, cursor: 'pointer', width: '100%', border: 'none', borderTop: '1px solid #23232b', borderRadius: '0 0 16px 16px', transition: 'background 0.18s, color 0.18s', letterSpacing: 0.1 }} onClick={markAllRead}>Marcar todas como lidas</button>
        </NotifDropdown>
      )}
      <Main marginLeft={sidebarWidth} style={{ marginTop: 36 }}>
        <WelcomeHeader>
          <DashboardTitle>Dashboard</DashboardTitle>
          <WelcomeTitle>
            Bem vindo(a) de volta, <WelcomeHighlight>Ulisses!</WelcomeHighlight>
          </WelcomeTitle>
          <WelcomeSub>Acompanhe o resumo que fizemos para você.</WelcomeSub>
        </WelcomeHeader>
        <div style={{ height: 18 }} />
        {/* Filtros de Produtos e Período */}
        <div style={{ display: 'flex', gap: 18, marginBottom: 28, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <label htmlFor="filtro-produto" style={{ color: '#b3b3c6', fontSize: 13, marginLeft: 4, marginBottom: 6, display: 'block', fontWeight: 700, letterSpacing: 0.2 }}>Produtos</label>
            <div style={{ position: 'relative' }}>
              <select id="filtro-produto" style={{
                width: '100%',
                background: 'linear-gradient(90deg, #18181F 60%, #23232B 100%)',
                color: '#ede6fa',
                border: '1.7px solid #2d1a4d',
                borderRadius: 14,
                padding: '16px 44px 16px 18px',
                fontSize: 16,
                outline: 'none',
                marginBottom: 0,
                boxShadow: '0 2px 12px #7c3aed18',
                fontWeight: 600,
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                transition: 'border 0.18s, box-shadow 0.18s',
              }}
                onFocus={e => e.target.style.border = '1.7px solid #7c3aed'}
                onBlur={e => e.target.style.border = '1.7px solid #2d1a4d'}
              >
                <option>Produtos</option>
                <option>Produto 1</option>
                <option>Produto 2</option>
              </select>
              {/* Ícone seta custom */}
              <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L11 14L16 9" stroke="#a084ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <label htmlFor="filtro-periodo" style={{ color: '#b3b3c6', fontSize: 13, marginLeft: 4, marginBottom: 6, display: 'block', fontWeight: 700, letterSpacing: 0.2 }}>Período</label>
            <div style={{ position: 'relative' }}>
              <select id="filtro-periodo" style={{
                width: '100%',
                background: 'linear-gradient(90deg, #18181F 60%, #23232B 100%)',
                color: '#ede6fa',
                border: '1.7px solid #2d1a4d',
                borderRadius: 14,
                padding: '16px 44px 16px 18px',
                fontSize: 16,
                outline: 'none',
                marginBottom: 0,
                boxShadow: '0 2px 12px #7c3aed18',
                fontWeight: 600,
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                transition: 'border 0.18s, box-shadow 0.18s',
              }}
                onFocus={e => e.target.style.border = '1.7px solid #7c3aed'}
                onBlur={e => e.target.style.border = '1.7px solid #2d1a4d'}
              >
                <option>Últimos 7 dias</option>
                <option>Hoje</option>
                <option>Ontem</option>
                <option>Últimos 30 dias</option>
                <option>Este mês</option>
                <option>Mês passado</option>
              </select>
              {/* Ícone seta custom */}
              <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L11 14L16 9" stroke="#a084ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <DashboardContent>
          <FadeIn>
            <CardsGrid>
              {cardsData.map((card, i) => (
                <Card key={i}>
                  <CardInfo>
                    <CardTitle>
                      <CardIconGlass>
                        {card.icon && React.cloneElement(card.icon, { size: 26, color: '#b3b3c6' })}
                      </CardIconGlass>
                      {card.title}
                    </CardTitle>
                    <CardValue>{card.value}</CardValue>
                  </CardInfo>
                  {card.details && <CardDetailsLink href="#">Ver detalhes</CardDetailsLink>}
                </Card>
              ))}
            </CardsGrid>
          </FadeIn>
          <div style={{ height: 24 }} />
          <DashboardGrid>
            <FadeIn style={{ height: '100%' }}>
              <ChartCard style={{ height: '100%' }}>
                <ChartTitleStyled>
                  <FiActivity size={22} color="#a259ff" style={{ marginRight: 8 }} />
                  <span style={{ color: '#ede6fa', fontSize: '1.25rem', fontWeight: 900 }}>Visão Geral das Vendas Diárias</span>
                </ChartTitleStyled>
                <ChartSub>Desempenho das vendas nos últimos 7 dias (dados simulados).</ChartSub>
                <div style={{ width: '100%', height: 320 }}>
                  <Line
                    ref={chartRef}
                    data={lineData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      elements: {
                        line: {
                          borderJoinStyle: 'round',
                          borderCapStyle: 'round',
                          shadowColor: '#7c3aed',
                          shadowBlur: 12,
                        },
                        point: {
                          radius: 5,
                          backgroundColor: '#a084ff',
                          borderColor: '#fff',
                          borderWidth: 2,
                          hoverRadius: 8,
                          hoverBackgroundColor: '#fff',
                          hoverBorderColor: '#7c3aed',
                          hoverBorderWidth: 2,
                        },
                      },
                      scales: {
                        x: {
                          grid: { color: 'rgba(124, 58, 237, 0.10)' },
                          ticks: { color: '#a084ff', font: { family: 'Inter' } },
                        },
                        y: {
                          grid: { color: 'rgba(124, 58, 237, 0.10)' },
                          ticks: { color: '#a084ff', font: { family: 'Inter' } },
                          beginAtZero: false,
                        },
                      },
                      animation: {
                        duration: 900,
                        easing: 'easeInOutQuart',
                      },
                      plugins: {
                        tooltip: {
                          backgroundColor: 'rgba(24, 16, 44, 0.98)',
                          titleColor: '#a084ff',
                          bodyColor: '#ede6fa',
                          borderColor: '#7c3aed',
                          borderWidth: 1.5,
                          padding: 14,
                          cornerRadius: 10,
                          displayColors: false,
                        },
                      },
                    }}
                  />
                </div>
              </ChartCard>
            </FadeIn>
            <FadeIn>
              <PaymentMethodsCard>
                <PaymentTitle>Métodos de Pagamento</PaymentTitle>
                <PaymentSub>Estatísticas por método de pagamento (em breve)</PaymentSub>
                <PaymentList>
                  {paymentMethods.map((method, i) => (
                    <PaymentItem key={i}>
                      <PaymentIconCircle>
                        {method.icon && React.cloneElement(method.icon, { size: 28, color: '#ede6fa' })}
                      </PaymentIconCircle>
                      <PaymentInfo>
                        <PaymentName>{method.name}</PaymentName>
                        <PaymentDesc>{method.desc}</PaymentDesc>
                      </PaymentInfo>
                      {method.soon ? <PaymentSoon>Em breve</PaymentSoon> : <PaymentValue>{method.value}</PaymentValue>}
                    </PaymentItem>
                  ))}
                </PaymentList>
              </PaymentMethodsCard>
            </FadeIn>
          </DashboardGrid>
        </DashboardContent>
      </Main>
    </Container>
  );
} 