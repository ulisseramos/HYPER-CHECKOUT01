import React, { useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import styled, { useTheme } from 'styled-components';
import { FiUser, FiLock, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit2, FiEye, FiEyeOff, FiBell, FiCamera, FiBellOff, FiShield, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background: #0b0b0e;
`;

const Main = styled.main`
  margin-left: 320px;
  padding: 64px 0 64px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 900px) {
    margin-left: 0;
    padding: 32px 0;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-bottom: 32px;
  margin-top: 12px;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  background: #23232B;
  color: #b3b3c6;
  border: 1.5px solid #23232B;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 8px 18px 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px #0002;
  transition: background 0.18s, color 0.18s, border 0.18s;
  &:hover {
    background: #18181F;
    color: #7c3aed;
    border-color: #7c3aed;
  }
`;

const BackButtonFixed = styled(BackButton)`
  position: fixed;
  top: 32px;
  left: 340px;
  z-index: 10;
  @media (max-width: 900px) {
    left: 16px;
    top: 16px;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  justify-content: center;
`;

const TabButton = styled.button`
  background: ${({ active, theme }) => active ? theme.colors.cardSolid : '#23232B'};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textSecondary};
  border: 1.5px solid ${({ active, theme }) => active ? theme.colors.primary : theme.colors.cardBorder};
  border-radius: 12px;
  font-size: 1.08rem;
  font-weight: 700;
  padding: 10px 32px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 2px 8px #0002;
  transition: background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s;
  &:hover {
    background: #18181F;
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 16px #7c3aed22;
  }
`;

const Card = styled.div`
  background: #131316;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 #0007;
  border: 1.5px solid #23232b;
  padding: 56px 48px 44px 48px;
  max-width: 1040px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
  margin: 0 auto;
  @media (max-width: 1200px) {
    max-width: 98vw;
    padding: 28px 4vw 28px 4vw;
  }
  @media (max-width: 600px) {
    padding: 12px 2vw 12px 2vw;
  }
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
`;

const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  min-width: 120px;
  font-weight: 600;
  letter-spacing: 0.2px;
`;

const InfoValue = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.08rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  margin: 24px 0 32px 0;
`;

const EditButton = styled.button`
  background: #18181f;
  color: #ede6fa;
  border: 1.5px solid #23232b;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px 28px;
  margin-top: 18px;
  align-self: flex-end;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s;
  &:hover {
    background: #23232b;
    color: #ede6fa;
    border-color: #ede6fa;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 13px 16px;
  background: #18181f;
  border: 1.5px solid #23232b;
  border-radius: 10px;
  color: #ede6fa;
  font-size: 1.07rem;
  margin-top: 4px;
  margin-bottom: 0;
  outline: none;
  font-family: 'Inter', Arial, sans-serif;
  font-weight: 500;
  transition: border 0.18s, box-shadow 0.18s, background 0.18s;
  &:focus {
    border-color: #b3b3c6;
  }
`;

const Feedback = styled.div`
  color: ${({ error, theme }) => error ? theme.colors.error : theme.colors.primary};
  background: ${({ error, theme }) => error ? theme.colors.errorBg : theme.colors.card};
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
`;

const AvatarBig = styled.div`
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background: #18181f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  font-weight: 700;
  color: #ede6fa;
  margin-bottom: 10px;
  border: 2.5px solid #23232b;
  box-shadow: 0 2px 12px #0005;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.18s, border 0.18s;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const CameraButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #18181fcc;
  border: 2px solid #23232b;
  color: #b3b3c6;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px #0003;
  font-size: 1.3rem;
  z-index: 2;
  transition: background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s;
  &:hover {
    background: #23232b;
    color: #ede6fa;
    border-color: #ede6fa;
    box-shadow: 0 4px 14px #0006;
  }
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0 0 0;
`;

const Switch = styled.input.attrs({ type: 'checkbox' })`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: ${({ checked, theme }) => checked ? theme.colors.primary : theme.colors.inputBorder};
  appearance: none;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  &:before {
    content: '';
    position: absolute;
    left: 4px;
    top: 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.2s;
    left: ${({ checked }) => checked ? '24px' : '4px'};
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  background: ${({ status, theme }) => status === 'Ativa' ? theme.colors.primary + '22' : theme.colors.error + '22'};
  color: ${({ status, theme }) => status === 'Ativa' ? theme.colors.primary : theme.colors.error};
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 3px 14px;
  margin-left: 10px;
  border: 1px solid ${({ status, theme }) => status === 'Ativa' ? theme.colors.primary + '44' : theme.colors.error + '44'};
`;

const NotifActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ active, theme }) => active ? theme.colors.primary + '22' : '#23232B'};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textSecondary};
  border: 1.5px solid ${({ active, theme }) => active ? theme.colors.primary : theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius.button};
  font-size: 1.08rem;
  font-weight: 600;
  padding: 13px 32px;
  margin-top: 18px;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s;
  outline: none;
  &:hover {
    background: ${({ theme }) => theme.colors.primary + '33'};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SecurityCard = styled(Card)`
  background: #131316;
  box-shadow: 0 4px 24px 0 #0007;
  border: 1.5px solid #23232b;
  padding: 56px 48px 44px 48px;
  max-width: 1040px;
  margin: 0 auto;
  border-radius: 18px;
  position: relative;
  align-items: center;
  @media (max-width: 1200px) {
    max-width: 98vw;
    padding: 28px 4vw 28px 4vw;
  }
  @media (max-width: 600px) {
    padding: 12px 2vw 12px 2vw;
  }
`;

const SecurityHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 32px;
`;

const SecurityAvatar = styled(AvatarBig)`
  width: 132px !important;
  height: 132px !important;
  font-size: 2.8rem !important;
  border: 2.5px solid #23232b;
  box-shadow: 0 2px 12px #0005;
  position: static;
  margin-bottom: 18px !important;
  background: #18181f;
`;

const SecurityTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  margin-bottom: 8px;
`;

const SecurityIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #23232B;
  color: #b3b3c6;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 1.5rem;
  box-shadow: none;
`;

const SecurityTitle = styled(SectionTitle)`
  font-size: 1.35rem !important;
  font-weight: 800;
  margin-bottom: 0 !important;
  text-align: left;
  color: #ede6fa;
  letter-spacing: 0.5px;
`;

const SecurityForm = styled.form`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: flex-start;
`;

const SecurityLabel = styled.label`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
`;

const SecurityInput = styled(Input)`
  border-width: 1.5px;
  text-align: left;
  background: #18181f;
  color: #ede6fa;
  &:focus {
    border-color: #b3b3c6;
    box-shadow: 0 0 0 1.5px #b3b3c622;
  }
`;

const SecurityButton = styled(EditButton)`
  width: 100%;
  margin-top: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  background: #18181f;
  color: #ede6fa;
  border: 1.5px solid #23232b;
  box-shadow: none;
  transition: background 0.18s, color 0.18s, border 0.18s, transform 0.18s;
  &:hover {
    background: #23232b;
    color: #ede6fa;
    border-color: #ede6fa;
    transform: translateY(-1px) scale(1.01);
  }
`;

export default function Configuracoes() {
  const theme = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState('perfil');
  // Buscar dados reais do usuário autenticado
  const [user, setUser] = useState({ nome: '', email: '', cadastro: '', status: 'Ativa', avatar: '' });
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [senha, setSenha] = useState('');
  const [senha2, setSenha2] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [notificacoes, setNotificacoes] = useState(true);

  React.useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      let nome = user?.user_metadata?.name;
      if (!nome) nome = user?.email?.split('@')[0] || 'Usuário';
      setUser({
        nome,
        email: user?.email || '',
        cadastro: user?.created_at ? user.created_at.split('T')[0] : '',
        status: 'Ativa',
        avatar: '',
      });
      setNome(nome);
      setEmail(user?.email || '');
    }
    fetchUser();
  }, []);

  const handleSalvar = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setUser({ nome, email, telefone, endereco, nascimento });
      setEditando(false);
      setLoading(false);
      setFeedback('Informações atualizadas!');
    }, 1000);
  };

  const handleSalvarSenha = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSenha('');
      setSenha2('');
      setShowPass(false);
      setShowPass2(false);
      setLoading(false);
      setFeedback('Senha alterada com sucesso!');
    }, 1000);
  };

  return (
    <PageContainer>
      <Sidebar />
      <Main>
        <BackButtonFixed onClick={() => router.back()}><FiArrowLeft size={20} /> Voltar</BackButtonFixed>
        <TopBar>
          <h1 style={{ color: theme.colors.text, fontFamily: theme.fonts.heading, fontWeight: 800, fontSize: '2rem', margin: 0, textAlign: 'center', flex: 1 }}>Configurações da Conta</h1>
        </TopBar>
        <Tabs>
          <TabButton active={tab === 'perfil'} onClick={() => { setTab('perfil'); setFeedback(null); }}>Perfil</TabButton>
          <TabButton active={tab === 'seguranca'} onClick={() => { setTab('seguranca'); setFeedback(null); }}>Segurança</TabButton>
        </Tabs>
        {tab === 'perfil' && (
          <Card>
            <SectionTitle style={{ fontSize: '1.5rem', marginBottom: 28 }}><FiUser size={28} /> Informações do Usuário</SectionTitle>
            <div style={{ color: theme.colors.textSecondary, marginBottom: 24, fontSize: 18 }}>Gerencie suas informações pessoais e de conta</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 32 }}>
              <AvatarBig>
                {user.nome.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
              </AvatarBig>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: theme.colors.text, marginBottom: 2 }}>{user.nome}</div>
                <div style={{ fontSize: 18, color: theme.colors.textSecondary }}>{user.email}</div>
                <div style={{ marginTop: 8, fontSize: 16, color: theme.colors.textSecondary }}>
                  Status da Conta: <StatusBadge status={user.status}>{user.status}</StatusBadge>
                </div>
                <div style={{ marginTop: 2, fontSize: 15, color: theme.colors.textSecondary }}>
                  Data de Cadastro: <b style={{ color: theme.colors.text }}>{user.cadastro}</b>
                </div>
                <NotifActionButton
                  type="button"
                  active={notificacoes}
                  onClick={() => setNotificacoes(n => !n)}
                >
                  <FiBell style={{ fontSize: 20 }} />
                  {notificacoes ? 'Desativar notificações' : 'Ativar notificações'}
                </NotifActionButton>
              </div>
            </div>
            {feedback && <Feedback>{feedback}</Feedback>}
            {!editando ? (
              <>
                <InfoRow><InfoLabel>Nome:</InfoLabel><InfoValue>{user.nome}</InfoValue></InfoRow>
                <InfoRow><InfoLabel>Email:</InfoLabel><InfoValue><FiMail /> {user.email}</InfoValue></InfoRow>
                <EditButton type="button" onClick={() => setEditando(true)}><FiEdit2 style={{ marginRight: 6 }} /> Editar Informações</EditButton>
              </>
            ) : (
              <form onSubmit={handleSalvar} style={{ width: '100%' }}>
                <InfoRow><InfoLabel>Nome:</InfoLabel><Input value={nome} onChange={e => setNome(e.target.value)} /></InfoRow>
                <InfoRow><InfoLabel>Email:</InfoLabel><Input value={email} onChange={e => setEmail(e.target.value)} /></InfoRow>
                <EditButton type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</EditButton>
                <EditButton type="button" style={{ background: theme.colors.cardBorder, color: theme.colors.text, marginTop: 8 }} onClick={() => setEditando(false)}>Cancelar</EditButton>
              </form>
            )}
          </Card>
        )}
        {tab === 'seguranca' && (
          <SecurityCard>
            <SecurityHeader>
              <SecurityAvatar>
                {user.nome.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
              </SecurityAvatar>
              <SecurityTitleRow>
                <SecurityIcon><FiShield size={22} /></SecurityIcon>
                <SecurityTitle><FiLock style={{ marginRight: 10, fontSize: 20, color: '#b3b3c6' }} /> Segurança da Conta</SecurityTitle>
              </SecurityTitleRow>
            </SecurityHeader>
            <div style={{ color: theme.colors.textSecondary, marginBottom: 18, fontSize: 15, textAlign: 'left' }}>Altere sua senha de acesso</div>
            {feedback && <Feedback>{feedback}</Feedback>}
            <SecurityForm onSubmit={handleSalvarSenha}>
              <div style={{ width: '100%' }}>
                <SecurityLabel>Nova senha:</SecurityLabel>
                <div style={{ position: 'relative' }}>
                  <SecurityInput type={showPass ? 'text' : 'password'} value={senha} onChange={e => setSenha(e.target.value)} placeholder="Digite a nova senha" autoComplete="new-password" />
                  <span style={{ position: 'absolute', right: 12, top: 16, cursor: 'pointer', color: theme.colors.textSecondary }} onClick={() => setShowPass(s => !s)}>{showPass ? <FiEyeOff /> : <FiEye />}</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <SecurityLabel>Confirme a senha:</SecurityLabel>
                <div style={{ position: 'relative' }}>
                  <SecurityInput type={showPass2 ? 'text' : 'password'} value={senha2} onChange={e => setSenha2(e.target.value)} placeholder="Confirme a nova senha" autoComplete="new-password" />
                  <span style={{ position: 'absolute', right: 12, top: 16, cursor: 'pointer', color: theme.colors.textSecondary }} onClick={() => setShowPass2(s => !s)}>{showPass2 ? <FiEyeOff /> : <FiEye />}</span>
                </div>
              </div>
              <SecurityButton type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Nova Senha'}</SecurityButton>
            </SecurityForm>
          </SecurityCard>
        )}
      </Main>
    </PageContainer>
  );
} 