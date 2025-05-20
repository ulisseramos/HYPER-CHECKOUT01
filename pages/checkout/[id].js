import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { createPixQrCode } from '../../lib/pushinpay';
import styled from 'styled-components';
import { FiZap, FiShoppingCart, FiChevronDown, FiTag } from 'react-icons/fi';
import { useToast } from '../../components/ToastProvider';

const Bg = styled.div`
  min-height: 100vh;
  background: #0b0b0e;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 32px 0;
  @media (max-width: 600px) {
    padding: 0;
    align-items: stretch;
  }
`;
const Funnel = styled.div`
  width: 100%;
  max-width: 430px;
  background: #101014;
  border-radius: 22px;
  box-shadow: 0 4px 32px #0004, 0 1px 4px #0002;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 32px 0;
  border: 1.5px solid #18181f;
  @media (max-width: 600px) {
    max-width: 100vw;
    min-height: 100vh;
    border-radius: 0;
    margin: 0;
    box-shadow: none;
  }
  @media (min-width: 900px) {
    max-width: 100vw;
    min-height: 100vh;
    border-radius: 0;
    margin: 0;
    box-shadow: none;
  }
`;
const Banner = styled.div`
  background:rgb(0, 0, 0);
  color: #fff;
  font-weight: 800;
  font-size: 1.18rem;
  padding: 22px 0 12px 0;
  text-align: center;
  position: relative;
  letter-spacing: 0.5px;
  @media (max-width: 600px) {
    font-size: 1.05rem;
    padding: 16px 0 8px 0;
  }
`;
const Timer = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  font-size: 1.6rem;
  font-weight: 900;
  margin-top: 2px;
  letter-spacing: 2px;
  span { font-size: 0.8rem; font-weight: 500; display: block; }
  @media (max-width: 600px) {
    font-size: 1.1rem;
    gap: 10px;
  }
`;
const CouponBar = styled.div`
  background: #232b3b;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
  padding: 12px 0;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 0.98rem;
    padding: 8px 0;
  }
`;
const ProductBanner = styled.div`
  width: 100%;
  height: 140px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  @media (max-width: 600px) {
    height: 90px;
  }
`;
const ProductImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const ProductHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 22px 0 22px;
  @media (max-width: 600px) {
    padding: 14px 12px 0 12px;
  }
`;
const ProductName = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.18rem;
  font-weight: 800;
  color: #232b3b;
  @media (max-width: 600px) {
    font-size: 1.02rem;
    gap: 6px;
  }
`;
const Cart = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #232b3b;
  font-weight: 700;
  font-size: 1.13rem;
  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;
const Steps = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 22px 0 22px;
  gap: 12px;
  @media (max-width: 600px) {
    padding: 12px 8px 0 8px;
    gap: 6px;
  }
`;
const Step = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const StepCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.active ? 'linear-gradient(90deg, #e53935 60%, #ff7043 100%)' : '#eee'};
  color: ${props => props.active ? '#fff' : '#b3b3c6'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.18rem;
  margin-bottom: 4px;
  box-shadow: ${props => props.active ? '0 2px 8px #e539352a' : 'none'};
  transition: background 0.18s, color 0.18s;
`;
const StepLabel = styled.div`
  font-size: 1.01rem;
  color: #232b3b;
  font-weight: 700;
  @media (max-width: 600px) {
    font-size: 0.93rem;
  }
`;
const Section = styled.div`
  padding: 22px 22px 0 22px;
  @media (max-width: 600px) {
    padding: 14px 8px 0 8px;
  }
`;
const CouponToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #232b3b;
  font-weight: 700;
  font-size: 1.01rem;
  cursor: pointer;
  margin-bottom: 10px;
  @media (max-width: 600px) {
    font-size: 0.97rem;
  }
`;
const CouponInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #23232b;
  border-radius: 8px;
  font-size: 1rem;
  margin-top: 8px;
  margin-bottom: 8px;
  background: #18181f;
  color: #ede6fa;
`;
const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  background: #18181f;
  border: 1.5px solid #23232b;
  border-radius: 10px;
  color: #ede6fa;
  font-size: 1.08rem;
  outline: none;
  margin-bottom: 14px;
  transition: border 0.18s;
  &::placeholder {
    color: #b3b3c6;
    opacity: 1;
  }
  &:focus {
    border: 1.5px solid #a084ff;
  }
`;
const ErrorMsg = styled.div`
  color: #e53935;
  background: #23232b;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1rem;
  margin-bottom: 2px;
  text-align: center;
`;
const Button = styled.button`
  width: 100%;
  padding: 15px 0;
  background: linear-gradient(90deg,rgb(0, 0, 0) 0%, #ff7043 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.18rem;
  font-weight: 900;
  margin-top: 10px;
  box-shadow: 0 2px 12px #e539352a;
  cursor: pointer;
  transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
  &:hover {
    background: linear-gradient(90deg, #ff7043 0%,rgb(0, 0, 0) 100%);
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 4px 18px #e5393533;
  }
  @media (max-width: 600px) {
    font-size: 1.05rem;
    padding: 13px 0;
  }
`;
const QrSection = styled.div`
  margin-top: 36px;
  text-align: center;
`;
const QrImg = styled.img`
  width: 220px;
  height: 220px;
  margin: 16px auto;
  display: block;
  border-radius: 12px;
  box-shadow: 0 2px 12px #e539352a;
  @media (max-width: 600px) {
    width: 160px;
    height: 160px;
  }
`;
const PixCode = styled.div`
  word-break: break-all;
  background: #23232b;
  color: #ede6fa;
  padding: 10px;
  border-radius: 8px;
  margin: 8px 0;
  font-size: 1rem;
`;
const CopyButton = styled.button`
  background: #e53935;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 1rem;
  font-weight: 700;
  margin-top: 8px;
  cursor: pointer;
  transition: background 0.18s, transform 0.12s;
  &:hover {
    background: #ff7043;
    transform: scale(1.03);
  }
  @media (max-width: 600px) {
    font-size: 0.97rem;
    padding: 8px 10px;
  }
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
  const [showCoupon, setShowCoupon] = useState(false);
  const [coupon, setCoupon] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      setError('');
      // Buscar checkout
      const { data: checkoutData, error: errCheckout } = await supabase
        .from('checkouts')
        .select('*')
        .eq('id', id)
        .single();
      if (errCheckout || !checkoutData) {
        setError('Checkout não encontrado.');
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
        setError('Produto não encontrado.');
        setLoading(false);
        return;
      }
      setProduct(productData);
      setLoading(false);
    };
    fetchData();
  }, [id]);

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
          icon: 'https://sdmntprwestus2.oaiusercontent.com/files/00000000-22e4-61f8-a326-e49826263e11/raw?se=2025-05-20T04%3A53%3A51Z&sp=r&sv=2024-08-04&sr=b&scid=29dc9d40-f906-5287-9712-cca798b335b1&skoid=30ec2761-8f41-44db-b282-7a0f8809659b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-20T00%3A31%3A31Z&ske=2025-05-21T00%3A31%3A31Z&sks=b&skv=2024-08-04&sig=zy3JmTeBfXKsZPSczur3wKfoMPgex2EtEj1p%2BAcZdUU%3D'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('HYPER CHECKOUT', {
              body: `Pix gerado\nVocê recebeu: R$ ${valor}`,
              icon: 'https://sdmntprwestus2.oaiusercontent.com/files/00000000-22e4-61f8-a326-e49826263e11/raw?se=2025-05-20T04%3A53%3A51Z&sp=r&sv=2024-08-04&sr=b&scid=29dc9d40-f906-5287-9712-cca798b335b1&skoid=30ec2761-8f41-44db-b282-7a0f8809659b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-20T00%3A31%3A31Z&ske=2025-05-21T00%3A31%3A31Z&sks=b&skv=2024-08-04&sig=zy3JmTeBfXKsZPSczur3wKfoMPgex2EtEj1p%2BAcZdUU%3D'
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

  return (
    <Bg>
      <Funnel>
        <Banner>
          Sua oferta termina em:
          <Timer>
            <div>{h}<span>HORAS</span></div> :
            <div>{m}<span>MIN</span></div> :
            <div>{s}<span>SEG</span></div>
          </Timer>
        </Banner>
        <CouponBar>
          Adicione o cupom <b>O5OFF</b> para mais <b>5% de desconto</b>.
        </CouponBar>
        <ProductBanner>
          {product?.imageUrl && <ProductImg src={product.imageUrl} alt={product?.name} />}
        </ProductBanner>
        <ProductHeader>
          <ProductName><FiZap color="#e53935" /> {product?.name || 'Produto'}</ProductName>
          <Cart><FiShoppingCart /> 1</Cart>
        </ProductHeader>
        <Steps>
          <Step><StepCircle active>1</StepCircle><StepLabel>Identificação</StepLabel></Step>
          <Step><StepCircle>2</StepCircle><StepLabel>Pagamento</StepLabel></Step>
          <Step><StepCircle>3</StepCircle><StepLabel>Confirmação</StepLabel></Step>
        </Steps>
        <Section>
          <CouponToggle onClick={() => setShowCoupon(v => !v)}>
            <FiTag /> Tem um cupom de desconto? <FiChevronDown style={{ transform: showCoupon ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </CouponToggle>
          {showCoupon && <CouponInput placeholder="Digite seu cupom" value={coupon} onChange={e => setCoupon(e.target.value)} />}
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={timeLeft === 0}
            style={{ marginBottom: 4 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <input type="checkbox" id="noemail" style={{ accentColor: '#e53935' }} disabled />
            <label htmlFor="noemail" style={{ color: '#b3b3c6', fontSize: '0.98rem' }}>Não tenho e-mail</label>
          </div>
          <Input
            type="tel"
            placeholder="Telefone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            disabled={timeLeft === 0}
          />
          <Input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={timeLeft === 0}
          />
          <Input
            type="text"
            placeholder="CPF/CNPJ"
            value={cpf}
            onChange={e => setCpf(e.target.value)}
            disabled={timeLeft === 0}
          />
          {emailError && <ErrorMsg>{emailError}</ErrorMsg>}
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Button onClick={handleGeneratePix} disabled={generatingPix || timeLeft === 0}>
            {timeLeft === 0 ? 'Tempo expirado' : (generatingPix ? 'Gerando PIX...' : 'Gerar PIX para pagamento')}
          </Button>
          {pixData && (
            <QrSection>
              <h3 style={{ color: '#232b3b', fontWeight: 800, fontSize: '1.1rem', marginBottom: 8 }}>Escaneie o QR Code PIX ou copie o código</h3>
              <QrImg src={`data:image/png;base64,${pixData.qr_code_base64}`} alt="QR Code PIX" />
              <div style={{ marginTop: 12, fontSize: 13 }}>
                <b style={{ color: '#232b3b' }}>Código PIX (copie e cole no app do seu banco):</b>
                <PixCode>{pixData.qr_code}</PixCode>
                <CopyButton onClick={() => navigator.clipboard.writeText(pixData.qr_code)}>Copiar código</CopyButton>
              </div>
            </QrSection>
          )}
        </Section>
      </Funnel>
    </Bg>
  );
} 