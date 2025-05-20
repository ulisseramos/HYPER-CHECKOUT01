import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
  FiHome, FiBarChart2, FiBox, FiUsers, FiSettings, FiHelpCircle, FiGift, FiChevronDown, FiMoon, FiLayers, FiMenu, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { FaChartBar } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useSidebar } from './SidebarContext';
import { useTheme } from 'styled-components';

const menu = [
  { label: 'Dashboard', icon: <FiHome />, path: '/painel' },
  { label: 'Vendas', icon: <FiBarChart2 />, path: '/pagamentos' },
  { label: 'Produtos', icon: <FiBox />, path: '/produtos' },
  { label: 'Clientes', icon: <FiUsers />, path: '/clientes' },
  { label: 'Integrações', icon: <FiLayers />, path: '/integracoes' },
  { label: 'Relatórios', icon: <FaChartBar />, path: '/relatorios' },
  { label: 'Suporte', icon: <FiHelpCircle />, path: '/suporte' },
];

const SidebarContainer = styled.aside`
  width: ${({ collapsed }) => (collapsed ? '84px' : '320px')};
  background: #0b0b0e;
  box-shadow: 0 4px 24px 0 #0004, 0 1.5px 8px #0008 inset;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1.5px solid ${({ theme }) => theme.colors.inputBorder};
  position: fixed;
  left: 0; top: 0; bottom: 0;
  z-index: 100;
  font-family: ${({ theme }) => theme.fonts.body};
  transition: width 0.35s cubic-bezier(.77,0,.18,1);
  overflow: hidden;
`;
const LogoWrapper = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  padding: 12px 0 18px 0;
  width: 100%;
  margin-top: 18px;
`;
const LogoCircle = styled.div`
  background: ${({ theme }) => theme.colors.cardSolid};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid ${({ theme }) => theme.colors.primary}BB;
  box-shadow: 0 2px 16px ${({ theme }) => theme.colors.primary}55;
  width: 72px;
  height: 72px;
  margin-bottom: 12px;
  transition: transform 0.18s;
`;
const LogoMain = styled.span`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 40px;
  letter-spacing: -1px;
`;
const LogoText = styled.span`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  font-size: 32px;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LogoHighlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 800;
  font-size: 32px;
  margin: 0 2px;
`;
const LogoSub = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 22px;
  margin-top: 4px;
  letter-spacing: 0.5px;
`;
const MenuNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
  padding-left: 24px;
  padding-right: 24px;
`;
const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ collapsed }) => (collapsed ? 'center' : 'flex-start')};
  gap: 12px;
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: ${({ active }) => (active ? 700 : 500)};
  color: ${({ active }) => (active ? '#7c3aed' : '#b3b3c6')};
  background: ${({ active }) => (active ? 'rgba(124, 58, 237, 0.10)' : 'transparent')};
  border: none;
  border-radius: 16px;
  min-width: ${({ collapsed }) => (collapsed ? '56px' : '100%')};
  width: 100%;
  height: 56px;
  padding: ${({ collapsed }) => (collapsed ? '0' : '0 24px 0 28px')};
  margin: 0 0 0 0;
  cursor: pointer;
  box-shadow: none !important;
  transition: background 0.18s, color 0.18s, width 0.22s, min-width 0.22s, padding 0.22s;
  outline: none;
  position: relative;
  filter: none;
  overflow: visible;
  &:hover {
    background: #5a0fd6;
    color: #fff;
    box-shadow: none !important;
  }
`;
const MenuIcon = styled.span`
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ active }) => (active ? '#7c3aed' : '#b3b3c6')};
  transition: color 0.18s;
  ${MenuButton}:hover & {
    color: #fff;
  }
`;
const Tooltip = styled.div`
  position: absolute;
  left: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  font-size: 15px;
  padding: 7px 18px;
  border-radius: 12px;
  box-shadow: 0 4px 24px ${({ theme }) => theme.colors.primary}55;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  z-index: 999;
  white-space: nowrap;
  pointer-events: none;
`;
const Footer = styled.div`
  padding: 16px;
  border-top: 2px solid ${({ theme }) => theme.colors.inputBorder};
`;
const RewardBar = styled.div`
  background: #15141A;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 18px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 14px;
  box-shadow: 0 1px 6px ${({ theme }) => theme.colors.primary}11;
  border: 1px solid ${({ theme }) => theme.colors.primary}35;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const RewardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 4px;
`;
const RewardProgress = styled.div`
  background: ${({ theme }) => theme.colors.cardSolid};
  border-radius: 8px;
  height: 8px;
  margin: 8px 0;
  width: 100%;
`;
const RewardFill = styled.div`
  background: ${({ theme }) => theme.colors.primary}b3;
  width: 0%;
  height: 8px;
  border-radius: 8px;
  transition: width 0.3s;
`;
const RewardPercent = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 400;
  font-size: 13px;
`;
const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.inputBorder} 0%, ${({ theme }) => theme.colors.primary}33 100%);
  margin: 10px 0 10px 0;
  border-radius: 1px;
`;

const CustomLogo = ({ collapsed }) => (
  <LogoWrapper href="/" aria-label="HyperCheckout Home">
    <LogoCircle>
      <LogoMain>H</LogoMain>
    </LogoCircle>
    {!collapsed && (
      <>
        <LogoText>
          HYP<LogoHighlight>Ξ</LogoHighlight>R
        </LogoText>
        <LogoSub>CHECKOUT</LogoSub>
      </>
    )}
  </LogoWrapper>
);

export default function Sidebar({ collapsed: collapsedProp = false, onCollapse }) {
  const theme = useTheme();
  const [showTooltip, setShowTooltip] = useState('');
  const { collapsed, setCollapsed } = useSidebar();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const active = router.pathname;
  const user = { name: 'Ulisses ramos', email: 'ulissesramosp@gmail.com' };
  const sidebarWidth = collapsed ? 84 : 320;
  const dropdownRef = useRef();

  // Fecha dropdown ao clicar fora
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
    if (onCollapse) onCollapse(!collapsed);
  };

  const handleLogout = () => {
    Cookies.remove('auth_token');
    router.replace('/login');
  };

  return (
    <SidebarContainer collapsed={collapsed}>
      <div>
        {/* Logo */}
        <CustomLogo collapsed={collapsed} />
        {/* Menu */}
        <MenuNav>
          {menu.map((item, idx) => {
            const isActive = active === item.path;
            const showDivider = item.label === 'Integrações';
            return (
              <React.Fragment key={item.label}>
                {showDivider && <Divider />}
                <div style={{ position: 'relative' }}>
                  <MenuButton
                    onClick={() => router.push(item.path)}
                    onMouseEnter={() => setShowTooltip(item.label)}
                    onMouseLeave={() => setShowTooltip('')}
                    active={isActive}
                    collapsed={collapsed}
                  >
                    <MenuIcon active={isActive}>{item.icon}</MenuIcon>
                    {!collapsed && item.label}
                  </MenuButton>
                  {collapsed && showTooltip === item.label && (
                    <Tooltip style={{ left: 70, top: '50%', transform: 'translateY(-50%)', background: '#23232b', color: '#ede6fa', fontWeight: 700, fontSize: 16, borderRadius: 12, boxShadow: '0 4px 24px #a084ff33', border: '2px solid #a084ff', padding: '10px 22px', zIndex: 9999, whiteSpace: 'nowrap' }}>
                      {item.label}
                    </Tooltip>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </MenuNav>
      </div>
      {/* Footer */}
      <Footer>
        {/* Barra de recompensa */}
        {!collapsed && (
          <RewardBar>
            <RewardTitle>
              <FiGift style={{ color: '#5a0fd6', fontSize: 18 }} />
              Próxima Recompensa
            </RewardTitle>
            <RewardProgress>
              <RewardFill />
            </RewardProgress>
            <RewardPercent>0%</RewardPercent>
          </RewardBar>
        )}
        {/* Perfil com dropdown */}
        {!collapsed && (
          <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
            <button
              style={{
                background: theme.colors.card,
                borderRadius: 12,
                padding: '14px 18px',
                marginBottom: 16,
                color: theme.colors.text,
                fontWeight: 400,
                fontSize: 15,
                boxShadow: theme.shadows.card,
                border: `1px solid ${theme.colors.cardBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                minHeight: 60,
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none',
              }}
              onClick={() => setShowDropdown(s => !s)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img
                  src="https://ui-avatars.com/api/?name=Ulisses+ramos&background=23232B&color=ede6fa&size=44&rounded=true"
                  alt="Avatar"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `1px solid ${theme.colors.inputBorder}`,
                    boxShadow: theme.shadows.card,
                    marginRight: 10,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                  <div style={{ fontWeight: 600, fontSize: 16, fontFamily: theme.fonts.body, color: theme.colors.text, lineHeight: 1.1 }}>{user.name}</div>
                  <div style={{ color: theme.colors.textSecondary, fontSize: 13, fontWeight: 500, fontFamily: theme.fonts.body, marginTop: 2, lineHeight: 1.1 }}>{user.email}</div>
                </div>
              </div>
              <FiChevronDown style={{ color: theme.colors.primary, fontSize: 20, marginLeft: 12 }} />
            </button>
            {showDropdown && (
              <div style={{
                position: 'absolute',
                left: 0,
                bottom: 'calc(100% + 6px)',
                minWidth: 220,
                background: '#18181F',
                border: '1.5px solid #a084ff55',
                borderRadius: 16,
                boxShadow: '0 8px 32px 0 #a084ff33',
                zIndex: 3000,
                padding: '8px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                animation: 'fadeInUp .18s',
              }}>
                <div style={{
                  padding: '12px 24px',
                  color: '#b3b3c6',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'not-allowed',
                  opacity: 0.7,
                  borderBottom: '1px solid #23232B',
                  userSelect: 'none',
                }}>
                  Minha Conta
                </div>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#a084ff',
                    fontWeight: 700,
                    fontSize: 16,
                    padding: '14px 24px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderBottom: '1px solid #23232B',
                    transition: 'background 0.15s',
                  }}
                  onClick={() => { router.push('/configuracoes'); setShowDropdown(false); }}
                >
                  <FiSettings style={{ marginRight: 10, fontSize: 18, verticalAlign: -2 }} /> Configurações
                </button>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff4d6d',
                    fontWeight: 700,
                    fontSize: 16,
                    padding: '14px 24px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onClick={handleLogout}
                >
                  <span style={{ marginRight: 10, fontSize: 18, verticalAlign: -2, display: 'inline-block' }}>↗</span> Sair
                </button>
              </div>
            )}
          </div>
        )}
        {/* Modal de perfil/configurações */}
        {showProfileModal && (
          <div
            className="modal"
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(14,14,18,0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000
            }}
            onClick={() => setShowProfileModal(false)}
          >
            <div
              style={{
                background: '#18181F',
                borderRadius: 16,
                border: '1px solid rgba(123,97,255,0.6)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                padding: 32,
                minWidth: 320,
                color: '#fff',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ margin: 0, marginBottom: 24, color: '#5a0fd6', fontWeight: 900 }}>Configurações</h2>
              <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{user.name}</div>
                <div style={{ color: '#B3B3C6', fontSize: 15 }}>{user.email}</div>
              </div>
              <button
                style={{
                  width: '100%',
                  padding: 14,
                  background: 'linear-gradient(90deg, #7B61FF 0%, #A084FF 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: 16,
                  boxShadow: '0px 0px 12px #7B61FF80'
                }}
                onClick={handleLogout}
              >
                Sair da Conta
              </button>
            </div>
          </div>
        )}
        {/* Botão modo escuro */}
        <button style={{ width: '100%', background: 'transparent', border: '2px solid #5a0fd6', color: '#fff', borderRadius: 14, padding: '10px 0', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(.77,0,.18,1)', boxShadow: '0 0 8px #5a0fd633' }}>
          <FiMoon style={{ color: '#5a0fd6', fontSize: 18 }} />
          {!collapsed && 'Modo Escuro'}
        </button>
      </Footer>
      {/* Responsividade: esconder sidebar em telas muito pequenas */}
      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @media (max-width: 700px) {
          aside {
            width: ${collapsed ? 0 : sidebarWidth}px !important;
            min-width: 0 !important;
            max-width: 100vw !important;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            bottom: 0;
            transition: width 0.35s cubic-bezier(.77,0,.18,1);
          }
        }
      `}</style>
    </SidebarContainer>
  );
} 