import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { createPixQrCode } from '../../lib/pushinpay';
import styled from 'styled-components';
import { FiUser, FiMail, FiPhone, FiCreditCard, FiClock, FiZap, FiTag, FiCheckCircle } from 'react-icons/fi';
import { useToast } from '../../components/ToastProvider';
import { IoTimeOutline } from 'react-icons/io5';
import { GoClock } from 'react-icons/go';

const TopBar = styled.div`
  width: 100vw;
  max-width: 100vw;
  background: #19191d;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin-bottom: 0;
`;
const TimerBlockCard = styled.div`
  width: 100vw;
  background: #F5143D;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 22px 0 18px 0;
  margin-bottom: 0;
  font-family: 'Inter', Arial, sans-serif;
`;
const TimerBlockIcon = styled.div`
  color: #fff;
  font-size: 2.2rem;
  margin-bottom: 8px;
`;
const TimerBlockTitle = styled.div`
  color: #fff;
  font-size: 1.22rem;
  font-weight: 800;
  font-family: 'Inter', Arial, sans-serif;
  text-align: center;
  margin-bottom: 2px;
  letter-spacing: 1.2px;
`;
const TimerBlockSub = styled.div`
  color: #fff;
  font-size: 1.01rem;
  font-weight: 500;
  margin-bottom: 12px;
  text-align: center;
  font-family: 'Inter', Arial, sans-serif;
`;
const TimerBlocks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-family: 'Inter', Arial, sans-serif;
`;
const TimerBlock = styled.div`
  background: #ff2950;
  border-radius: 10px;
  min-width: 62px;
  min-height: 62px;
  max-width: 62px;
  max-height: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', Arial, sans-serif;
  box-shadow: 0 2px 8px #0001;
`;
const TimerNumber = styled.div`
  font-size: 1.45rem;
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
  letter-spacing: 1px;
  text-align: center;
`;
const TimerLabel = styled.div`
  font-size: 0.89rem;
  font-weight: 700;
  color: #fff;
  opacity: 1;
  margin-top: 2px;
  letter-spacing: 2px;
  text-align: center;
`;
const TimerPhraseBar = styled.div`
  width: 100vw;
  background: #F5143D;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 0 8px 0;
`;
const TimerPhraseText = styled.div`
  color: #fff;
  font-size: 1.18rem;
  font-weight: 800;
  font-family: 'Montserrat', 'Poppins', 'Inter', Arial, sans-serif;
  text-align: center;
`;
const TimerPhraseSub = styled.div`
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 2px;
  text-align: center;
  font-family: 'Montserrat', 'Poppins', 'Inter', Arial, sans-serif;
`;
const Banner = styled.img`
  width: 100vw;
  max-width: 420px;
  height: 120px;
  object-fit: cover;
  border-radius: 0 0 18px 18px;
  margin-bottom: 0;
  background: #23232b;
`;
const Container = styled.div`
  min-height: 100vh;
  background: #131316;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Poppins', 'Inter', Arial, sans-serif;
  padding: 0 0 32px 0;
`;
const ProductName = styled.div`
  position: absolute;
  top: 24px;
  right: 32px;
  color: #b3b3c6;
  font-size: 1.01rem;
  font-weight: 600;
  text-align: right;
  max-width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Card = styled.div`
  background: rgba(24, 24, 31, 0.85);
  border-radius: 26px;
  padding: 44px 28px 36px 28px;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.25), 0 1.5px 8px 0 #0002;
  min-width: 340px;
  max-width: 98vw;
  width: 100%;
  max-width: 420px;
  margin-top: 32px;
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  @media (max-width: 600px) {
    padding: 22px 4vw 18px 4vw;
    min-width: unset;
    margin-top: 18px;
  }
`;
const Stepper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 22px;
  margin: 18px 0 18px 0;
`;
const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ active }) => (active ? '#fff' : '#b3b3c6')};
  font-weight: ${({ active }) => (active ? 800 : 500)};
`;
const StepCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ active }) => (active ? 'linear-gradient(135deg, #ff2950 60%, #ff5e62 100%)' : '#18181f')};
  border: 2.5px solid ${({ active }) => (active ? '#fff' : '#23232b')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.18rem;
  margin-bottom: 4px;
  color: ${({ active }) => (active ? '#fff' : '#b3b3c6')};
  box-shadow: ${({ active }) => (active ? '0 2px 8px #ff295055' : 'none')};
  transition: all 0.2s;
`;
const StepLabel = styled.div`
  font-size: 1.01rem;
  font-weight: 700;
`;
const Logo = styled.img`
  width: 54px;
  height: 54px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 8px;
  background: #18181f;
  box-shadow: 0 2px 12px #0002;
`;
const Title = styled.h1`
  font-size: 1.45rem;
  font-weight: 900;
  margin-bottom: 6px;
  color: #fff;
  text-align: center;
`;
const Info = styled.div`
  font-size: 1.08rem;
  color: #b3b3c6;
  margin-bottom: 6px;
  text-align: center;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 22px;
  width: 100%;
`;
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #18181f;
  border: 1.5px solid #23232b;
  border-radius: 12px;
  padding: 0 14px;
  transition: border 0.2s;
  &:focus-within {
    border: 1.5px solid #ff2950;
    box-shadow: 0 0 0 2px #ff295033;
  }
`;
const Input = styled.input`
  background: transparent;
  border: none;
  color: #fff;
  padding: 15px 0;
  font-size: 1.08rem;
  width: 100%;
  outline: none;
  font-family: 'Inter', Arial, sans-serif;
  &::placeholder {
    color: #b3b3c6;
    opacity: 1;
    font-weight: 500;
  }
`;
const ErrorMsg = styled.div`
  color: #ff4d6d;
  font-weight: 600;
  font-size: 0.98rem;
`;
const Button = styled.button`
  background: #15803d;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 0;
  font-weight: 800;
  font-size: 1.13rem;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px #15803d22;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  &:hover {
    background: #166534;
    box-shadow: 0 4px 16px #15803d33;
  }
`;
const PixBox = styled.div`
  margin-top: 32px;
  text-align: center;
`;
const PixCode = styled.div`
  word-break: break-all;
  background: #23232b;
  color: #ede6fa;
  padding: 10px;
  border-radius: 8px;
  margin: 8px 0;
  font-size: 15px;
`;
const CopyBtn = styled.button`
  background: #23232b;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  font-size: 1rem;
`;

// Adicionar ícone do Pix (SVG inline)
const PixIcon = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="#18181f"/>
    <path d="M20.001 13.333c-1.84 0-3.6.72-4.92 2.04l-2.04 2.04a2.8 2.8 0 000 3.96l2.04 2.04a6.96 6.96 0 009.84 0l2.04-2.04a2.8 2.8 0 000-3.96l-2.04-2.04A6.96 6.96 0 0020 13.333zm0 1.334c1.48 0 2.88.58 3.94 1.64l2.04 2.04c.52.52.52 1.36 0 1.88l-2.04 2.04a5.6 5.6 0 01-7.88 0l-2.04-2.04a1.32 1.32 0 010-1.88l2.04-2.04A5.56 5.56 0 0120 14.667zm0 2.666a2.67 2.67 0 00-1.88.78l-.7.7a.67.67 0 000 .94l.7.7a2.67 2.67 0 003.76 0l.7-.7a.67.67 0 000-.94l-.7-.7A2.67 2.67 0 0020 17.333z" fill="#00B686"/>
  </svg>
);

const PaymentSection = styled.div`
  width: 100%;
  margin-bottom: 18px;
`;
const PaymentTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 10px;
`;
const PaymentCard = styled.div`
  background: #18181f;
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 8px #0002;
  color: #fff;
  font-size: 1.08rem;
  font-weight: 600;
`;

export default function CheckoutPage() {
  const router = useRouter();
  const { id } = router.query;
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkout, setCheckout] = useState(null);
  const [product, setProduct] = useState(null);
  const [pixData, setPixData] = useState(null);
  const [generatingPix, setGeneratingPix] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [emailError, setEmailError] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos em segundos
  const [cupom, setCupom] = useState('');
  const [showCupom, setShowCupom] = useState(false);
  const [fetchTries, setFetchTries] = useState(0);
  const maxFetchTries = 3;

  // Cores customizáveis (futuro: vir do banco)
  const primaryColor = checkout?.primary_color || '#23232b';
  // Logo/banner customizável (futuro: vir do banco)
  const logoUrl = checkout?.logo_url || product?.logo_url || null;
  const bannerUrl = product?.banner_url || null;
  const cupomAtivo = checkout?.cupom || '05OFF';
  const cupomMsg = checkout?.cupom_msg || 'Adicione o cupom 05OFF para mais 5% de desconto.';

  // Frase customizável acima do timer
  const timerPhrase = 'OFERTA POR TEMPO LIMITADO!';

  const fetchData = useCallback(async () => {
    if (!id) return;
      setLoading(true);
      setError('');
      // Buscar checkout
      const { data: checkoutData, error: errCheckout } = await supabase
        .from('checkouts')
        .select('*')
        .eq('id', id)
        .single();
      if (errCheckout || !checkoutData) {
      setError('Erro ao buscar checkout: ' + (errCheckout?.message || 'Não encontrado'));
        setLoading(false);
        return;
      }
      setCheckout(checkoutData);
      // Buscar produto
      const { data: productData, error: errProduct } = await supabase
        .from('products')
        .select('*')
        .eq('id', checkoutData.product_id)
        .single();
      if (errProduct || !productData) {
      setError('Erro ao buscar produto: ' + (errProduct?.message || 'Não encontrado'));
        setLoading(false);
        return;
      }
      setProduct(productData);
      setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!product) return;
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [product, timeLeft]);

  function formatTime(secs) {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return { h, m, s };
  }

  function notifyPix(valor) {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('HYPER CHECKOUT', {
          body: `Pix gerado\nVocê recebeu: R$ ${valor}`,
          icon: 'https://i.imgur.com/1z5yHIU.png'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('HYPER CHECKOUT', {
              body: `Pix gerado\nVocê recebeu: R$ ${valor}`,
              icon: 'https://i.imgur.com/1z5yHIU.png'
            });
          }
        });
      }
    }
  }

  // Gerar PIX via Pushin Pay
  const handleGeneratePix = async () => {
    setEmailError('');
    // Validação simples de e-mail
    if (!email || !/^[^@\s]+@gmail\.com$/.test(email)) {
      setEmailError('Informe um e-mail gmail válido para gerar o pagamento.');
      return;
    }
    // Verificação de checkout carregado
    if (!checkout || !checkout.user_id) {
      setError('Erro: informações do checkout não carregadas. Tente recarregar a página.');
      return;
    }
    setGeneratingPix(true);
    setError('');
    setPixData(null);
    // Buscar token Pushin Pay do dono do checkout
    const { data: integration } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', checkout.user_id)
      .eq('integration_name', 'pushin_pay')
      .single();
    const token = integration?.api_key;
    if (!token) {
      setError('O dono deste checkout não configurou a integração com a Pushin Pay.');
      setGeneratingPix(false);
      return;
    }
    try {
      // Valor em centavos
      const valueCents = Math.round(Number(product.price) * 100);
      const pix = await createPixQrCode(token, { value: valueCents });
      setPixData(pix);
      showToast({
        title: 'Pix gerado!',
        message: 'O Pix foi gerado com sucesso. Confira o QR Code ou código para pagamento.',
      });
      notifyPix((Number(product.price)).toFixed(2));
    } catch (e) {
      setError('Erro ao gerar PIX: ' + (e.message || e));
    }
    setGeneratingPix(false);
  };

  const { h, m, s } = formatTime(timeLeft);

  // Stepper (apenas visual, etapa 1)
  const step = 1;

  return (
    <>
      <TopBar>
        <TimerBlockCard>
          <TimerBlockTitle>Oferta por Tempo Limitado</TimerBlockTitle>
          <TimerBlockSub>Não perca essa oportunidade!</TimerBlockSub>
          <TimerBlocks>
            <TimerBlockIcon style={{marginBottom:0, marginRight:10}}>
              <GoClock color="#fff" size={32} />
            </TimerBlockIcon>
            <TimerBlock>
              <TimerNumber>{h}</TimerNumber>
              <TimerLabel>HORAS</TimerLabel>
            </TimerBlock>
            <TimerBlock>
              <TimerNumber>{m}</TimerNumber>
              <TimerLabel>MIN</TimerLabel>
            </TimerBlock>
            <TimerBlock>
              <TimerNumber>{s}</TimerNumber>
              <TimerLabel>SEG</TimerLabel>
            </TimerBlock>
          </TimerBlocks>
        </TimerBlockCard>
      </TopBar>
      {bannerUrl && <Banner src={bannerUrl} alt="Banner do produto" style={{margin: '18px auto 0 auto', display: 'block'}} />}
    <Container>
      <Card>
          {product && <ProductName>{product.name}</ProductName>}
          {logoUrl && <Logo src={logoUrl} alt="Logo do checkout" />}
          <Title>{checkout?.checkout_name || 'Checkout'}</Title>
          {loading && (
            <div style={{ color: '#b3b3c6', fontWeight: 700, margin: '18px 0', textAlign: 'center' }}>
              Carregando checkout...
            </div>
          )}
          {error && !loading && (
            <div style={{ color: '#ff4d6d', fontWeight: 700, margin: '18px 0', textAlign: 'center' }}>
              {error}
              </div>
          )}
          {!pixData && (
            <form onSubmit={e => { e.preventDefault(); handleGeneratePix(); }} style={{ width: '100%' }}>
              <FormGroup>
                <InputWrapper>
                  <FiMail style={{ color: '#b3b3c6', marginRight: 8 }} />
                  <Input required placeholder="E-mail (gmail)" value={email} onChange={e => setEmail(e.target.value)} />
                </InputWrapper>
                <InputWrapper>
                  <FiPhone style={{ color: '#b3b3c6', marginRight: 8 }} />
                  <Input required placeholder="Telefone" value={phone} onChange={e => setPhone(e.target.value)} />
                </InputWrapper>
                <InputWrapper>
                  <FiUser style={{ color: '#b3b3c6', marginRight: 8 }} />
                  <Input required placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} />
                </InputWrapper>
                <InputWrapper>
                  <FiCreditCard style={{ color: '#b3b3c6', marginRight: 8 }} />
                  <Input required placeholder="CPF/CNPJ" value={cpf} onChange={e => setCpf(e.target.value)} />
                </InputWrapper>
                {emailError && <ErrorMsg>{emailError}</ErrorMsg>}
                {error && <ErrorMsg>{error}</ErrorMsg>}
                <PaymentSection>
                  <PaymentTitle>
                    <FiCreditCard size={20} style={{marginBottom: -2}} /> Pagamento
                  </PaymentTitle>
                  <PaymentCard>
                    <input type="radio" checked readOnly style={{accentColor: '#00B686', marginRight: 8}} />
                    <PixIcon /> Pix
                  </PaymentCard>
                </PaymentSection>
                <Button type="submit" disabled={generatingPix}>
                  {generatingPix ? 'Processando...' : 'Finalizar compra'}
                </Button>
              </FormGroup>
            </form>
          )}
            {pixData && (
            <PixBox>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>QR Code PIX</div>
              <img src={pixData.qr_code_base64} alt="QR Code PIX" style={{ width: 220, height: 220, borderRadius: 12, boxShadow: '0 2px 12px #0003', marginBottom: 12 }} />
                <div style={{ marginTop: 12, fontSize: 13 }}>
                  <b style={{ color: '#b3b3c6' }}>Código PIX (copie e cole no app do seu banco):</b>
                <PixCode>{pixData.qr_code}</PixCode>
                <CopyBtn onClick={() => navigator.clipboard.writeText(pixData.qr_code)}>Copiar código</CopyBtn>
              </div>
            </PixBox>
        )}
      </Card>
    </Container>
    </>
  );
} 