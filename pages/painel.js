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
import { FiDollarSign, FiCalendar, FiCreditCard, FiGrid, FiFileText, FiActivity, FiZap } from 'react-icons/fi';
import { useSidebar } from '../components/SidebarContext';

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
  background: linear-gradient(135deg, #0a0012 0%, #1a0036 100%);
  color: #fff;
  font-family: 'Poppins', 'Inter', Arial, sans-serif;
  padding: 32px 0 0 0;
  position: relative;
  overflow: hidden;
`;

const Main = styled.main`
  margin-left: 370px;
  padding: 40px 48px 40px 48px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: relative;
  z-index: 1;
  @media (max-width: 900px) {
    margin-left: 0;
    padding: 24px 8px;
  }
`;

const DashboardContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const WelcomeHeader = styled.div`
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  background: rgba(24, 24, 31, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(90, 15, 214, 0.3);
  margin-bottom: 10px;
`;
const DashboardTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 4px;
  background: linear-gradient(90deg, #a084ff 0%, #5a0fd6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const WelcomeTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0 0 2px 0;
  letter-spacing: -1px;
  line-height: 1.1;
  display: inline-block;
  background: linear-gradient(90deg, #fff 0%, #a084ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const WelcomeHighlight = styled.span`
  color: #5a0fd6;
`;
const WelcomeSub = styled.div`
  color: #b3b3c6;
  font-size: 1.08rem;
  font-weight: 400;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 18px;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;
const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(24, 24, 31, 0.72);
  border-radius: 16px;
  box-shadow: 0 2px 8px #0004;
  border: 1px solid rgba(90, 15, 214, 0.3);
  padding: 22px 28px;
  min-height: 64px;
  gap: 18px;
  margin-bottom: 0;
  transition: box-shadow 0.18s, border 0.18s, transform 0.14s cubic-bezier(0.4,0.2,0.2,1);
  will-change: transform, box-shadow, border;
  backdrop-filter: blur(12px);
  &:hover {
    box-shadow: 0 4px 16px #0006;
    border: 1px solid rgba(90, 15, 214, 0.3);
    transform: scale(1.012) translateY(-2px);
  }
`;
const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;
const CardTitle = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.98rem;
  font-weight: 600;
  margin-bottom: 2px;
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
  background: ${({ theme }) => theme.colors.cardSolid};
  border-radius: ${({ theme }) => theme.borderRadius.card};
  border: 1px solid rgba(90, 15, 214, 0.3);
  box-shadow: 0 2px 8px #0004;
  padding: 28px 22px 18px 22px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin-top: 0;
  transition: box-shadow 0.18s, border 0.18s, transform 0.14s cubic-bezier(0.4,0.2,0.2,1);
  will-change: transform, box-shadow, border;
  &:hover {
    box-shadow: 0 4px 16px #0006;
    border: 1px solid rgba(90, 15, 214, 0.3);
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
  background: ${({ theme }) => theme.colors.cardSolid};
  border-radius: ${({ theme }) => theme.borderRadius.card};
  border: 1px solid rgba(90, 15, 214, 0.3);
  box-shadow: 0 2px 8px #0004;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
  transition: none;
  will-change: unset;
  &:hover {
    box-shadow: 0 2px 8px #0004;
    border: 1px solid rgba(90, 15, 214, 0.3);
    transform: none;
  }
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
  background: #14141A;
  border-radius: 12px;
  padding: 20px 22px;
  border: 1px solid rgba(90, 15, 214, 0.3);
  justify-content: space-between;
  margin-bottom: 8px;
`;
const PaymentIconCircle = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #18181F 60%, #23232B 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px #0006;
  border: 1.5px solid #23232B;
  margin-right: 18px;
  transition: box-shadow 0.18s, transform 0.18s;
  &:hover {
    box-shadow: 0 4px 18px #5a0fd633;
    transform: scale(1.07);
    border-color: #5a0fd6;
  }
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

const CardIconGlass = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(90, 15, 214, 0.08);
  box-shadow: 0 1px 4px #0002;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border: 1px solid rgba(90, 15, 214, 0.3);
  backdrop-filter: blur(6px);
`;

const FadeIn = styled.div`
  animation: fadeInUp 0.8s cubic-bezier(0.4,0.2,0.2,1);
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: none; }
  }
`;

export default function Painel() {
  const { collapsed, setCollapsed } = useSidebar();
  const sidebarWidth = collapsed ? 84 : 320;
  const chartRef = useRef();

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
        pointBackgroundColor: '#a084ff',
        pointBorderColor: '#fff',
        tension: 0.5,
        fill: 'origin',
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(124, 58, 237, 0.7)');   // Roxo forte no topo
          gradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.25)');
          gradient.addColorStop(1, 'rgba(124, 58, 237, 0.03)');  // Quase transparente na base
          return gradient;
        },
      },
    ],
  };

  return (
    <Container>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Main style={{ marginLeft: sidebarWidth }}>
        <DashboardContent>
          <FadeIn>
            <WelcomeHeader>
              <DashboardTitle>Dashboard</DashboardTitle>
              <WelcomeTitle>
                Bem vindo(a) de volta, <WelcomeHighlight>Ulisses!</WelcomeHighlight>
              </WelcomeTitle>
              <WelcomeSub>Acompanhe o resumo que fizemos para você.</WelcomeSub>
            </WelcomeHeader>
          </FadeIn>
          <FadeIn>
            <CardsGrid>
              {cardsData.map((card, i) => (
                <Card key={i}>
                  <CardInfo>
                    <CardTitle>
                      <CardIconGlass>
                        {card.icon && React.cloneElement(card.icon, { size: 22, color: '#a084ff' })}
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