// Forçar novo deploy na Vercel
import React, { useState } from 'react';
import styled, { ThemeProvider, keyframes } from 'styled-components';
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
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { FiLogOut, FiX, FiUser, FiSettings, FiHelpCircle, FiTrendingUp, FiUsers, FiShoppingBag, FiPercent, FiDollarSign } from 'react-icons/fi';
import { useSidebar } from '../components/SidebarContext';
import Sidebar from '../components/Sidebar';

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

const theme = {
  background: '#0E0E12',
  card: 'rgba(255, 255, 255, 0.05)',
  primary: '#7B61FF',
  secondary: '#A084FF',
  accent: '#C1B2FF',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  border: 'rgba(255, 255, 255, 0.18)',
  success: '#00FFB2',
  error: '#FF5F5F',
  warning: '#FFB800',
};

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(123, 97, 255, 0.5); }
  50% { box-shadow: 0 0 20px rgba(123, 97, 255, 0.8); }
  100% { box-shadow: 0 0 5px rgba(123, 97, 255, 0.5); }
`;

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  color: ${props => props.theme.text};
  font-family: 'Inter', Arial, sans-serif;
  padding: 32px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0012 0%, #1a0036 100%);
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  background: ${props => props.theme.card};
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.border};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const Card = styled.div`
  background: ${props => props.theme.card};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.border};
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.45);
    border-color: ${props => props.theme.primary};

    &::before {
      opacity: 1;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const CardValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CardTrend = styled.p`
  color: ${props => props.theme.success};
  margin: 8px 0 0 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
`;

const ChartCard = styled(Card)`
  padding: 32px;
`;

const ChartTitleStyled = styled.h3`
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserButton = styled.button`
  background: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.primary};
  font-size: 16px;
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  &:hover {
    background: rgba(123, 97, 255, 0.1);
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 15px ${props => props.theme.primary}40;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(14, 14, 18, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.card};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.border};
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 24px;
  width: 90%;
  max-width: 400px;
  position: relative;
  animation: ${glowAnimation} 2s infinite;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, ${props => props.theme.primary} 0%, ${props => props.theme.secondary} 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  transition: all 0.3s ease;
  box-shadow: 0px 0px 12px ${props => props.theme.primary}80;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 0px 20px ${props => props.theme.primary}80;
  }
`;

const Main = styled.div`
  margin-left: ${props => props.marginLeft}px;
`;

const Dashboard = () => {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { collapsed, setCollapsed } = useSidebar();
  const sidebarWidth = collapsed ? 84 : 320;

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('auth_token');
    router.replace('/login');
  };

  const toggleModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogoutModal(!showLogoutModal);
  };

  const salesData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Vendas',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: theme.primary,
        backgroundColor: `${theme.primary}40`,
        tension: 0.4,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receita',
        data: [1200, 1900, 300, 500, 200, 300],
        backgroundColor: theme.primary,
      },
    ],
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
        <Main style={{ marginLeft: sidebarWidth }}>
          <ContentWrapper>
            <HeaderSection>
              <div>
                <Title>Bem vindo(a) de volta, <span>Ulisses!</span></Title>
                <Subtitle>Acompanhe o resumo que fazemos para você.</Subtitle>
              </div>
              <UserButton onClick={toggleModal}>
                <FiUser size={20} />
                Minha Conta
              </UserButton>
            </HeaderSection>

            <StatsGrid>
              <Card>
                <CardHeader>
                  <FiTrendingUp size={24} color={theme.primary} />
                  <CardTitle>Vendas Totais</CardTitle>
                </CardHeader>
                <CardValue>R$ 4.200</CardValue>
                <CardTrend>
                  <FiTrendingUp size={16} /> +12% este mês
                </CardTrend>
              </Card>

              <Card>
                <CardHeader>
                  <FiUsers size={24} color={theme.primary} />
                  <CardTitle>Novos Clientes</CardTitle>
                </CardHeader>
                <CardValue>24</CardValue>
                <CardTrend>
                  <FiTrendingUp size={16} /> +8% este mês
                </CardTrend>
              </Card>

              <Card>
                <CardHeader>
                  <FiShoppingBag size={24} color={theme.primary} />
                  <CardTitle>Pedidos</CardTitle>
                </CardHeader>
                <CardValue>156</CardValue>
                <CardTrend>
                  <FiTrendingUp size={16} /> +5% este mês
                </CardTrend>
              </Card>

              <Card>
                <CardHeader>
                  <FiPercent size={24} color={theme.primary} />
                  <CardTitle>Taxa de Conversão</CardTitle>
                </CardHeader>
                <CardValue>3.2%</CardValue>
                <CardTrend>
                  <FiTrendingUp size={16} /> +0.8% este mês
                </CardTrend>
              </Card>
            </StatsGrid>

            <ChartsGrid>
              <ChartCard>
                <ChartTitleStyled>
                  <FiTrendingUp size={24} color={theme.primary} />
                  Vendas por Mês
                </ChartTitleStyled>
                <Line 
                  data={salesData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: theme.textSecondary
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: theme.textSecondary
                        }
                      }
                    }
                  }}
                />
              </ChartCard>

              <ChartCard>
                <ChartTitleStyled>
                  <FiDollarSign size={24} color={theme.primary} />
                  Receita por Mês
                </ChartTitleStyled>
                <Bar 
                  data={revenueData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: theme.textSecondary
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: theme.textSecondary
                        }
                      }
                    }
                  }}
                />
              </ChartCard>
            </ChartsGrid>

            {showLogoutModal && (
              <Modal onClick={() => setShowLogoutModal(false)}>
                <ModalContent onClick={e => e.stopPropagation()}>
                  <LogoutButton onClick={handleLogout}>
                    <FiLogOut /> Sair da Conta
                  </LogoutButton>
                </ModalContent>
              </Modal>
            )}
          </ContentWrapper>
        </Main>
      </Container>
    </ThemeProvider>
  );
};

export default Dashboard; 