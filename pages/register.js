import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import styled from 'styled-components';
import Head from 'next/head';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LogoWrapper = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  padding: 12px 0 18px 0;
  width: 100%;
`;
const LogoCircle = styled.div`
  background: #18181F;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #a084ffBB;
  box-shadow: 0 2px 16px #a084ff55;
  width: 72px;
  height: 72px;
  margin-bottom: 12px;
  transition: transform 0.18s;
`;
const LogoMain = styled.span`
  font-weight: 800;
  color: #a084ff;
  font-size: 40px;
  letter-spacing: -1px;
`;
const LogoText = styled.span`
  font-weight: 800;
  color: #ede6fa;
  font-size: 32px;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LogoHighlight = styled.span`
  color: #a084ff;
  font-weight: 800;
  font-size: 32px;
  margin: 0 2px;
`;
const LogoSub = styled.span`
  color: #a084ff;
  font-weight: 600;
  font-size: 22px;
  margin-top: 4px;
  letter-spacing: 0.5px;
`;
const Bg = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0012 0%, #0A0A0F 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Card = styled.div`
  background: rgba(24, 24, 31, 0.88);
  border-radius: 22px;
  border: 1.5px solid rgba(90,15,214,0.18);
  box-shadow: 0 8px 40px 0 #5a0fd62a, 0 1.5px 16px #0008 inset;
  backdrop-filter: blur(14px);
  padding: 64px 48px 48px 48px;
  max-width: 520px;
  width: 100%;
  color: #ede6fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
  @media (max-width: 500px) {
    padding: 36px 10px 28px 10px;
  }
`;
const Title = styled.h2`
  font-family: 'Poppins', Arial, sans-serif;
  font-size: 2.2rem;
  font-weight: 900;
  color: #ede6fa;
  margin-bottom: 6px;
  letter-spacing: -2px;
  text-align: center;
  line-height: 1.1;
  span {
    color: #ede6fa;
    background: none;
    -webkit-background-clip: unset;
    -webkit-text-fill-color: unset;
    background-clip: unset;
    text-fill-color: unset;
    filter: none;
  }
`;
const Subtitle = styled.div`
  font-family: 'Inter', Arial, sans-serif;
  font-size: 1.05rem;
  color: #b3b3c6;
  margin-bottom: 26px;
  text-align: center;
  font-weight: 500;
`;
const Form = styled.form`
  width: 100%;
  margin-top: 0;
  display: flex;
  flex-direction: column;
  gap: 26px;
`;
const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.97rem;
  font-family: 'Poppins', Arial, sans-serif;
  font-weight: 700;
  color: #5a0fd6;
  margin-bottom: 4px;
  gap: 5px;
  letter-spacing: -0.5px;
`;
const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 0;
`;
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;
const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 15px 44px 15px 40px;
  background: rgba(20, 20, 26, 0.92);
  border: 1.5px solid #23232B;
  border-radius: 10px;
  color: #ede6fa;
  font-size: 1.07rem;
  outline: none;
  font-family: 'Inter', Arial, sans-serif;
  font-weight: 500;
  transition: border 0.18s, box-shadow 0.18s, background 0.18s;
  &::placeholder {
    color: #b3b3c6;
    opacity: 1;
    font-style: italic;
    font-size: 0.98rem;
    font-family: 'Inter', Arial, sans-serif;
    font-weight: 400;
  }
  &:focus {
    border: 1.5px solid #5a0fd6;
    background: rgba(20, 20, 26, 0.99);
    box-shadow: 0 0 8px #5a0fd6aa;
  }
`;
const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #5a0fd6;
  font-size: 1.18rem;
`;
const EyeIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #5a0fd6;
  font-size: 1.18rem;
  cursor: pointer;
`;
const ErrorMsg = styled.div`
  color: #ff4d6d;
  background: #2a0a1a;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1rem;
  margin-bottom: 2px;
  text-align: center;
`;
const Button = styled.button`
  width: 100%;
  padding: 17px 0;
  background: linear-gradient(180deg, #5a0fd6 0%, #6d28d9 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.18rem;
  font-family: 'Poppins', Arial, sans-serif;
  font-weight: 800;
  letter-spacing: 0.2px;
  margin-top: 10px;
  box-shadow: 0 0 18px #5a0fd62a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
  svg { font-size: 1.18em; }
  &:hover {
    background: linear-gradient(180deg, #6d28d9 0%, #5a0fd6 100%);
    box-shadow: 0 0 28px #5a0fd655;
    transform: translateY(-2px) scale(1.03);
  }
`;
const LoginLink = styled.div`
  margin-top: 22px;
  color: #b3b3c6;
  font-size: 1rem;
  text-align: center;
  font-family: 'Inter', Arial, sans-serif;
  a {
    color: #5a0fd6;
    font-family: 'Poppins', Arial, sans-serif;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
    margin-left: 4px;
    transition: color 0.18s, text-decoration-color 0.18s;
    text-decoration-color: #5a0fd6;
    &:hover {
      color: #00e6ff;
      text-decoration-color: #00e6ff;
    }
  }
`;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Digite seu nome completo.');
      return;
    }
    if (!email.trim()) {
      setError('Digite um e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      toast.success('Cadastro realizado com sucesso! Faça login para continuar.', {
        position: 'top-right',
        autoClose: 3200,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        style: { fontWeight: 700, fontSize: 17, borderRadius: 12, background: '#18181F', color: '#a084ff', boxShadow: '0 2px 16px #5a0fd633' },
      });
      setTimeout(() => {
        setLoading(false);
        router.replace('/login');
      }, 3500);
    }
  };

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@700;800;900&display=swap" rel="stylesheet" />
        <title>Crie sua Conta | Hypercheckout</title>
      </Head>
      <Bg>
        <Card>
          <LogoWrapper href="/" aria-label="HyperCheckout Home">
            <LogoCircle>
              <LogoMain>H</LogoMain>
            </LogoCircle>
            <LogoText>
              HYP<LogoHighlight>Ξ</LogoHighlight>R
            </LogoText>
            <LogoSub>CHECKOUT</LogoSub>
          </LogoWrapper>
          <Title>
            Crie sua <span>Conta</span>
          </Title>
          <Subtitle>Preencha os campos para se cadastrar.</Subtitle>
          <Form onSubmit={handleRegister} autoComplete="off">
            <InputGroup>
              <Label htmlFor="name"><FiUser /> Nome completo</Label>
              <InputWrapper>
                <InputIcon><FiUser /></InputIcon>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoFocus
                />
              </InputWrapper>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="email"><FiMail /> E-mail</Label>
              <InputWrapper>
                <InputIcon><FiMail /></InputIcon>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="password"><FiLock /> Senha</Label>
              <InputWrapper>
                <InputIcon><FiLock /></InputIcon>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Crie uma senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <EyeIcon onClick={() => setShowPassword(s => !s)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </EyeIcon>
              </InputWrapper>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="confirmPassword"><FiLock /> Confirmar Senha</Label>
              <InputWrapper>
                <InputIcon><FiLock /></InputIcon>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <EyeIcon onClick={() => setShowConfirmPassword(s => !s)}>
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </EyeIcon>
              </InputWrapper>
            </InputGroup>
            {error && <ErrorMsg>{error}</ErrorMsg>}
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="22" height="22" viewBox="0 0 50 50" style={{ marginRight: 8, animation: 'spin 1s linear infinite' }}>
                    <circle cx="25" cy="25" r="20" fill="none" stroke="#a084ff" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                  Cadastrando...
                </span>
              ) : (<><FiLogIn /> Cadastrar</>)}
            </Button>
          </Form>
          <LoginLink>
            Já tem uma conta?
            <a href="/login">Entrar</a>
          </LoginLink>
        </Card>
      </Bg>
      <ToastContainer />
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
} 