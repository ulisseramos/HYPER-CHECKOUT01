import React from 'react';
import Sidebar from '../components/Sidebar';
import styled from 'styled-components';
import { FiDollarSign, FiCheckCircle, FiClock, FiTrendingUp, FiSearch, FiRefreshCw, FiChevronDown, FiFilter } from 'react-icons/fi';

const Container = styled.div`
  min-height: 100vh;
  background: #0b0b0e;
  color: #fff;
  font-family: 'Poppins', 'Inter', Arial, sans-serif;
  padding: 32px 0 0 0;
`;

const Main = styled.main`
  margin-left: 320px;
  padding: 40px 40px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 8px;
`;
const HeaderIcon = styled.div`
  background: #5a0fd6;
  color: #fff;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
`;
const TitleBlock = styled.div``;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  margin: 0;
`;
const SubTitle = styled.div`
  color: #b3b3c6;
  font-size: 1.08rem;
  font-weight: 400;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 18px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;
const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #101014;
  border-radius: 16px;
  border: 1.2px solid #5a0fd6;
  box-shadow: 0 2px 8px #5a0fd62a;
  padding: 18px 22px;
  min-height: 56px;
  gap: 18px;
  margin-bottom: 0;
  transition: box-shadow 0.18s, border 0.18s, transform 0.14s cubic-bezier(0.4,0.2,0.2,1);
  will-change: transform, box-shadow, border;
  &:hover {
    box-shadow: 0 6px 24px #5a0fd6aa, 0 1px 8px #0008;
    border: 1.5px solid #5a0fd6;
    transform: scale(1.01) translateY(-2px);
  }
`;
const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
const CardTitle = styled.div`
  color: #b3b3c6;
  font-size: 0.98rem;
  font-weight: 600;
  margin-bottom: 2px;
`;
const CardValue = styled.div`
  font-size: 1.45rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.7px;
`;
const CardSub = styled.div`
  color: #b3b3c6;
  font-size: 0.92rem;
  font-weight: 500;
`;
const CardIcon = styled.div`
  font-size: 1.7rem;
  color: #5a0fd6;
  background: rgba(90,15,214,0.08);
  border-radius: 8px;
  padding: 8px;
  margin-left: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FiltersBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #101014;
  border-radius: 16px;
  border: 1.2px solid #5a0fd6;
  padding: 14px 18px;
  margin-bottom: 8px;
`;
const SearchInput = styled.input`
  background: #14141A;
  border: none;
  color: #fff;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 1rem;
  outline: none;
  width: 180px;
`;
const Select = styled.select`
  background: #14141A;
  border: 1.2px solid #5a0fd6;
  color: #fff;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 1rem;
  outline: none;
`;
const FilterButton = styled.button`
  background: #5a0fd6;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.18s;
  &:hover {
    background: #7c3aed;
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #101014;
  border-radius: 16px;
  border: 1.2px solid #5a0fd6;
  padding: 10px 18px;
  margin-bottom: 8px;
`;
const FilterTag = styled.div`
  background: #5a0fd6;
  color: #fff;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;
const ClearButton = styled.button`
  background: #23232B;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: 12px;
  &:hover {
    background: #5a0fd6;
  }
`;

const TableCard = styled.div`
  background: #101014;
  border-radius: 16px;
  border: 1.2px solid #5a0fd6;
  box-shadow: 0 2px 8px #5a0fd62a;
  padding: 0;
  margin-top: 0;
  overflow-x: auto;
`;
const TableTitle = styled.div`
  color: #ede6fa;
  font-size: 1.25rem;
  font-weight: 900;
  padding: 24px 24px 0 24px;
`;
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #fff;
  font-size: 1rem;
`;
const Th = styled.th`
  background: #18181F;
  color: #b3b3c6;
  font-weight: 700;
  padding: 12px 8px;
  border-bottom: 2px solid #5a0fd6;
`;
const Td = styled.td`
  padding: 10px 8px;
  border-bottom: 1px solid #23232B;
  color: #ede6fa;
`;
const Tr = styled.tr``;
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  color: #b3b3c6;
  font-size: 1.1rem;
`;
const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 24px;
  color: #b3b3c6;
  font-size: 0.98rem;
`;

const cards = [
  {
    title: 'Vendas aprovadas',
    value: '0',
    sub: 'Total de vendas aprovadas',
    icon: <FiCheckCircle size={22} />, // Roxo
    color: '#5a0fd6',
  },
  {
    title: 'Vendas pendentes',
    value: '5',
    sub: 'Aguardando confirmação',
    icon: <FiClock size={22} />, // Amarelo
    color: '#fbbf24',
  },
  {
    title: 'Taxa de conversão',
    value: '0.00%',
    sub: 'Aprovadas ÷ Total',
    icon: <FiTrendingUp size={22} />, // Azul
    color: '#38bdf8',
  },
  {
    title: 'Valor total',
    value: 'R$ 0,00',
    sub: 'Receita bruta',
    icon: <FiDollarSign size={22} />, // Verde
    color: '#22c55e',
  },
];

export default function Vendas() {
  return (
    <>
      <Sidebar />
      <Container>
        <Main>
          <Header>
            <HeaderIcon><FiDollarSign /></HeaderIcon>
            <TitleBlock>
              <Title>Vendas</Title>
              <SubTitle>Gerencie suas transações</SubTitle>
            </TitleBlock>
            <div style={{ flex: 1 }} />
            <FilterButton style={{ marginLeft: 'auto', fontWeight: 600, fontSize: 15 }}>
              <FiRefreshCw style={{ fontSize: 18 }} /> Atualizar dados
            </FilterButton>
          </Header>
          <CardsGrid>
            {cards.map((card, i) => (
              <Card key={i}>
                <CardInfo>
                  <CardTitle>{card.title}</CardTitle>
                  <CardValue>{card.value}</CardValue>
                  <CardSub>{card.sub}</CardSub>
                </CardInfo>
                <CardIcon style={{ color: card.color, background: card.color + '22' }}>{card.icon}</CardIcon>
              </Card>
            ))}
          </CardsGrid>
          <FiltersBar>
            <FiSearch style={{ color: '#b3b3c6', fontSize: 20, marginRight: 4 }} />
            <SearchInput placeholder="Pesquisar por..." />
            <Select><option>Status</option></Select>
            <Select><option>Data</option></Select>
            <Select><option>Método de Pagamento</option></Select>
            <Select><option>Produto</option></Select>
            <Select><option>UTM</option></Select>
          </FiltersBar>
          <ActiveFilters>
            <FiFilter style={{ color: '#5a0fd6', fontSize: 18, marginRight: 4 }} />
            <span style={{ fontWeight: 700 }}>Filtros ativos</span>
            <FilterTag>Status: Paga</FilterTag>
            <ClearButton>Limpar todos</ClearButton>
          </ActiveFilters>
          <TableCard>
            <TableTitle>Transações</TableTitle>
            <StyledTable>
              <thead>
                <Tr>
                  <Th>Data</Th>
                  <Th>ID</Th>
                  <Th>💲 Líquido</Th>
                  <Th>Produto</Th>
                  <Th>Cliente</Th>
                  <Th>Pagamento</Th>
                  <Th>Status</Th>
                </Tr>
              </thead>
              <tbody>
                <Tr>
                  <Td colSpan={7}>
                    <EmptyState>
                      <FiSearch style={{ fontSize: 38, marginBottom: 12, color: '#5a0fd6' }} />
                      Nenhuma transação encontrada.
                    </EmptyState>
                  </Td>
                </Tr>
              </tbody>
            </StyledTable>
            <Pagination>Exibindo 0-0 de 0</Pagination>
          </TableCard>
        </Main>
      </Container>
    </>
  );
} 