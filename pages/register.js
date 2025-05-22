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
  padding: 8px 0 18px 0;
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
  background: #0b0b0e;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Card = styled.div`
  background: #131316;
  border-radius: 18px;
  border: 1.5px solid #23232b;
  box-shadow: 0 4px 32px 0 #0006;
  padding: 48px 32px 36px 32px;
  max-width: 480px;
  width: 100%;
  color: #ede6fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
  @media (max-width: 600px) {
    padding: 16px 3vw 12px 3vw;
    max-width: 98vw;
  }
  @media (max-width: 480px) {
    padding: 10px 6vw 10px 6vw;
    max-width: 98vw;
  }
`;
const Title = styled.h2`
  font-family: 'Poppins', Arial, sans-serif;
  font-size: 2rem;
  font-weight: 900;
  color: #ede6fa;
  margin-bottom: 6px;
  text-align: center;
  line-height: 1.1;
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;
const Subtitle = styled.div`
  font-family: 'Inter', Arial, sans-serif;
  font-size: 1.05rem;
  color: #b3b3c6;
  margin-bottom: 22px;
  text-align: center;
  font-weight: 500;
  @media (max-width: 480px) {
    font-size: 0.92rem;
    margin-bottom: 10px;
  }
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
  color: #b3b3c6;
  margin-bottom: 4px;
  gap: 5px;
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
  padding: 13px 44px 13px 40px;
  background: #18181f;
  border: 1.5px solid #23232b;
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
    font-size: 0.98rem;
    font-family: 'Inter', Arial, sans-serif;
    font-weight: 400;
    font-style: normal;
  }
  &:focus {
    border: 1.5px solid #ede6fa;
    background: #18181f;
    box-shadow: 0 0 0 1.5px #ede6fa22;
  }
  @media (max-width: 480px) {
    font-size: 0.98rem;
    padding: 11px 38px 11px 36px;
  }
`;
const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #b3b3c6;
  font-size: 1.18rem;
`;
const EyeIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #b3b3c6;
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
  padding: 15px 0;
  background: #23232b;
  color: #ede6fa;
  border: none;
  border-radius: 10px;
  font-size: 1.13rem;
  font-family: 'Poppins', Arial, sans-serif;
  font-weight: 700;
  margin-top: 10px;
  box-shadow: 0 0 12px #0002;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  svg { font-size: 1.18em; }
  &:hover {
    background: #18181f;
    color: #ede6fa;
    box-shadow: 0 2px 16px #23232b;
  }
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 12px 0;
  }
`;
const LoginLink = styled.div`
  margin-top: 18px;
  color: #b3b3c6;
  font-size: 1rem;
  text-align: center;
  font-family: 'Inter', Arial, sans-serif;
  a {
    color: #ede6fa;
    font-family: 'Poppins', Arial, sans-serif;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
    margin-left: 4px;
    transition: color 0.18s;
    text-decoration-color: #ede6fa;
    &:hover {
      color: #fff;
      text-decoration-color: #fff;
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
  const [successMsg, setSuccessMsg] = useState('');
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
      setSuccessMsg(`Parabéns, ${name.split(' ')[0]}! Sua conta foi criada com sucesso. Faça login para continuar.`);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@700;800;900&display=swap" rel="stylesheet" />
        <title>Crie sua Conta | Hypercheckout</title>
      </Head>
      {successMsg && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(20,20,26,0.92)',
          zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, margin: 0
        }}>
          <div style={{
            background: '#18181f',
            borderRadius: 18,
            boxShadow: '0 4px 32px #0008',
            border: '1.5px solid #23232b',
            padding: '36px 24px',
            maxWidth: 340,
            width: '90vw',
            color: '#ede6fa',
            textAlign: 'center',
            fontFamily: 'Poppins, Arial, sans-serif',
            fontWeight: 700,
            fontSize: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 18
          }}>
            <span role="img" aria-label="Sucesso" style={{ fontSize: 38, marginBottom: 10 }}>🎉</span>
            <div style={{ marginBottom: 18 }}>{successMsg}</div>
            <button onClick={() => { setSuccessMsg(''); router.replace('/login'); }} style={{
              background: '#23232b', color: '#ede6fa', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 16, padding: '12px 28px', cursor: 'pointer', marginTop: 8, boxShadow: '0 2px 12px #0003', transition: 'background 0.18s, color 0.18s' }}>OK, fazer login</button>
          </div>
        </div>
      )}
      <Bg>
        <Card>
          <LogoWrapper href="/" aria-label="HyperCheckout Home">
            <img
              src="https://i.imgur.com/1z5yHIU.png"
              alt="Logo HyperCheckout"
              style={{ width: 120, height: 120, marginBottom: 18, marginTop: 6, borderRadius: 24 }}
            />
          </LogoWrapper>
          <Title style={{ fontFamily: 'Inter, Arial, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#fff', marginBottom: 8, letterSpacing: 0 }}>
            Crie sua Conta
          </Title>
          <Subtitle style={{ fontFamily: 'Inter, Arial, sans-serif', fontWeight: 400, color: '#b3b3c6', fontSize: '1.05rem', marginBottom: 24 }}>
            Preencha os campos para se cadastrar.
          </Subtitle>
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
          <LoginLink style={{ color: '#b3b3c6', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 400, marginTop: 18 }}>
            Já tem uma conta? <a href="/login" style={{ color: '#ede6fa', textDecoration: 'underline', fontWeight: 500 }}>Entrar</a>
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