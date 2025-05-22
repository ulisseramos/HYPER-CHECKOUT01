import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabaseClient';
import styled from 'styled-components';
import Sidebar from '../../../components/Sidebar';

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
  margin-left: 320px;
  padding: 48px 48px 40px 48px;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  z-index: 1;
  @media (max-width: 900px) {
    margin-left: 0;
    padding: 48px 8px 40px 8px;
  }
`;
const Card = styled.div`
  background: #18181f;
  border-radius: 18px;
  box-shadow: 0 2px 8px #0003;
  padding: 32px 32px 18px 32px;
  max-width: 600px;
  margin: 0 auto;
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: #a084ff;
  margin-bottom: 24px;
`;
const Label = styled.label`
  font-weight: 600;
  color: #fff;
  font-size: 1.04rem;
  margin-bottom: 2px;
  margin-top: 10px;
`;
const Input = styled.input`
  width: 100%;
  margin-top: 8px;
  margin-bottom: 18px;
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
const Select = styled.select`
  width: 100%;
  margin-top: 8px;
  margin-bottom: 18px;
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
const Button = styled.button`
  background: #a084ff;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 13px 28px;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 18px;
  transition: background 0.18s;
  &:hover {
    background: #7b61ff;
  }
`;

export default function EditarCheckout() {
  const router = useRouter();
  const { id } = router.query;
  const [produto, setProduto] = useState(null);
  const [checkoutName, setCheckoutName] = useState('');
  const [integration, setIntegration] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchProduto = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error || !data) {
        setError('Produto não encontrado.');
        setLoading(false);
        return;
      }
      setProduto(data);
      setCheckoutName(data.name || '');
      setIntegration(data.integration || '');
      setLoading(false);
    };
    fetchProduto();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const { error } = await supabase.from('products').update({ name: checkoutName, integration }).eq('id', id);
    if (error) {
      setError('Erro ao salvar: ' + error.message);
    } else {
      setSuccess('Checkout atualizado com sucesso!');
    }
  };

  return (
    <Container>
      <Sidebar />
      <Main>
        <Card>
          <Title>Editar Checkout de Pagamento</Title>
          {loading ? (
            <div>Carregando...</div>
          ) : error ? (
            <div style={{ color: '#ff4d6d' }}>{error}</div>
          ) : produto && (
            <form onSubmit={handleSave}>
              <Label>Nome do Produto</Label>
              <Input value={checkoutName} onChange={e => setCheckoutName(e.target.value)} />
              <Label>Integração de Pagamento</Label>
              <Select value={integration} onChange={e => setIntegration(e.target.value)}>
                <option value="pushin_pay">Pushin Pay</option>
                {/* Adicione outras integrações se necessário */}
              </Select>
              <Label>Descrição</Label>
              <Input value={produto.description} disabled />
              <Label>Preço</Label>
              <Input value={produto.price} disabled />
              <Label>Link do Checkout</Label>
              <Input value={produto.generated_link || ''} disabled />
              <Button type="submit">Salvar Alterações</Button>
              {success && <div style={{ color: '#00FFB2', marginTop: 12 }}>{success}</div>}
            </form>
          )}
        </Card>
      </Main>
    </Container>
  );
} 