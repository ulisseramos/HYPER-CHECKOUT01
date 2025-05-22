import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import styled, { keyframes } from 'styled-components';
import { FiDollarSign, FiCheckCircle, FiClock, FiTrendingUp, FiSearch, FiRefreshCw, FiFilter, FiX, FiChevronLeft, FiChevronRight, FiPercent } from 'react-icons/fi';
import { useSidebar } from '../components/SidebarContext';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(90, 15, 214, 0.5); }
  50% { box-shadow: 0 0 20px rgba(90, 15, 214, 0.8); }
  100% { box-shadow: 0 0 5px rgba(90, 15, 214, 0.5); }
`;

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
  margin-left: ${props => props.marginLeft || 320}px;
  padding: 0 48px 40px 48px;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  z-index: 1;
  transition: margin-left 0.35s cubic-bezier(.77,0,.18,1);
  @media (max-width: 900px) {
    margin-left: 0;
    padding: 0 8px 40px 8px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 8px;
  background: none;
  box-shadow: none;
  padding: 0;
  border-radius: 0;
  border: none;
`;

const HeaderIcon = styled.div`
  background: linear-gradient(135deg, #5a0fd6 0%, #7c3aed 100%);
  color: #fff;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  box-shadow: 0 4px 12px rgba(90, 15, 214, 0.3);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  margin: 0;
  background: linear-gradient(90deg, #fff 0%, #b3b3c6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  margin-top: 0;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #101014;
  border-radius: 18px;
  border: none;
  box-shadow: none;
  padding: 28px 36px;
  min-height: 72px;
  gap: 18px;
  margin-bottom: 0;
  transition: box-shadow 0.22s, border 0.18s, transform 0.16s cubic-bezier(0.4,0.2,0.2,1);
  will-change: transform, box-shadow, border;
  position: relative;
  overflow: hidden;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardTitle = styled.div`
  color: #b3b3c6;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CardValue = styled.div`
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(90deg, #fff 0%, #b3b3c6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.7px;
`;

const CardSub = styled.div`
  color: #b3b3c6;
  font-size: 0.92rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CardIcon = styled.div`
  font-size: 1.8rem;
  color: #5a0fd6;
  background: rgba(90, 15, 214, 0.1);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.1);
    background: rgba(90, 15, 214, 0.15);
  }
`;

const FiltersBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #101014;
  border-radius: 14px;
  border: 1px solid #23232b;
  padding: 14px 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  box-shadow: none;
`;

const SearchInput = styled.input`
  background: #18181f;
  border: 1px solid #23232b;
  color: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 1rem;
  outline: none;
  width: 220px;
  transition: border 0.2s;

  &:focus {
    border-color: #fff;
  }

  &::placeholder {
    color: #b3b3c6;
  }
`;

const Select = styled.select`
  background: #18181f;
  border: 1px solid #23232b;
  color: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: border 0.2s;

  &:focus {
    border-color: #fff;
  }

  option {
    background: #18181f;
    color: #fff;
  }
`;

const FilterButton = styled.button`
  background: #23232b;
  color: #fff;
  border: 1px solid #23232b;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s, border 0.2s;
  box-shadow: none;

  &:hover {
    background: #18181f;
    border-color: #fff;
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #101014;
  border-radius: 12px;
  border: 1px solid #23232b;
  padding: 10px 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  box-shadow: none;
`;

const FilterTag = styled.div`
  background: #23232b;
  color: #fff;
  border-radius: 10px;
  padding: 7px 14px;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: none;
`;

const ClearButton = styled.button`
  background: #18181f;
  color: #fff;
  border: 1px solid #23232b;
  border-radius: 10px;
  padding: 7px 14px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: auto;
  transition: background 0.2s, border 0.2s;

  &:hover {
    background: #23232b;
    border-color: #fff;
  }
`;

const TableCard = styled.div`
  background: #101014;
  border-radius: 14px;
  border: 1px solid #23232b;
  box-shadow: none;
  padding: 0;
  margin-top: 0;
  overflow-x: auto;
  transition: border 0.2s;
`;

const TableTitle = styled.div`
  color: #fff;
  font-size: 1.18rem;
  font-weight: 800;
  padding: 20px 20px 0 20px;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #fff;
  font-size: 1rem;
`;

const Th = styled.th`
  background: rgba(24, 24, 31, 0.9);
  color: #b3b3c6;
  font-weight: 700;
  padding: 16px;
  border-bottom: 2px solid rgba(90, 15, 214, 0.3);
  text-align: left;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid rgba(35, 35, 43, 0.5);
  color: #ede6fa;
  transition: all 0.3s ease;
`;

const Tr = styled.tr`
  transition: all 0.3s ease;

  &:hover {
    background: #18181f;
    ${Td} {
      color: #fff;
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #23232b;
  color: #b3b3c6;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 7px;
  padding: 4px 14px;
  box-shadow: none;
  border: none;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 14px 20px;
  color: #b3b3c6;
  font-size: 0.98rem;
  gap: 10px;
`;

const PageButton = styled.button`
  background: ${props => props.active ? '#23232b' : '#18181f'};
  color: #fff;
  border: 1px solid #23232b;
  border-radius: 7px;
  padding: 7px 11px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: none;

  &:hover {
    background: #23232b;
    border-color: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #18181f;
    border-color: #23232b;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  color: #b3b3c6;
  font-size: 1.1rem;
  gap: 16px;
`;

export default function Pagamentos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const { collapsed, setCollapsed } = useSidebar();
  const sidebarWidth = collapsed ? 84 : 320;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleFilter = () => {
    if (statusFilter) {
      setActiveFilters([...activeFilters, statusFilter]);
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setStatusFilter('');
  };

  const removeFilter = (filter) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  return (
    <Container>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Main marginLeft={sidebarWidth}>
        <div style={{ marginTop: 32 }} />
        <Header>
          <HeaderIcon>
            <FiDollarSign />
          </HeaderIcon>
            <Title>Pagamentos</Title>
            <SubTitle>Gerencie e acompanhe todos os pagamentos</SubTitle>
        </Header>

        <CardsGrid>
          <Card>
            <CardInfo>
              <CardTitle><FiDollarSign style={{marginRight: 8}} />Total Recebido</CardTitle>
              <CardValue>R$ 24.500</CardValue>
              <CardSub>
                <FiTrendingUp /> +12% este mês
              </CardSub>
            </CardInfo>
            <CardIcon>
              <FiDollarSign />
            </CardIcon>
          </Card>
          <Card>
            <CardInfo>
              <CardTitle><FiClock style={{marginRight: 8}} />Pagamentos Pendentes</CardTitle>
              <CardValue>R$ 8.200</CardValue>
              <CardSub>
                <FiClock /> 5 pagamentos
              </CardSub>
            </CardInfo>
            <CardIcon>
              <FiClock />
            </CardIcon>
          </Card>
          <Card>
            <CardInfo>
              <CardTitle><FiTrendingUp style={{marginRight: 8}} />Taxa de Conversão</CardTitle>
              <CardValue>3.2%</CardValue>
              <CardSub>
                <FiTrendingUp /> +0.8% este mês
              </CardSub>
            </CardInfo>
            <CardIcon>
              <FiTrendingUp />
            </CardIcon>
          </Card>
          <Card>
            <CardInfo>
              <CardTitle><FiCheckCircle style={{marginRight: 8}} />Pagamentos Realizados</CardTitle>
              <CardValue>156</CardValue>
              <CardSub>
                <FiCheckCircle /> +5% este mês
              </CardSub>
            </CardInfo>
            <CardIcon>
              <FiCheckCircle />
            </CardIcon>
          </Card>
        </CardsGrid>

        <FiltersBar>
          <SearchInput
            type="text"
            placeholder="Buscar pagamentos..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <Select value={statusFilter} onChange={handleStatusChange}>
            <option value="">Status</option>
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
            <option value="Atrasado">Atrasado</option>
          </Select>
          <FilterButton onClick={handleFilter}>
            <FiFilter /> Filtrar
          </FilterButton>
        </FiltersBar>

        {activeFilters.length > 0 && (
          <ActiveFilters>
            {activeFilters.map((filter, index) => (
              <FilterTag key={index}>
                {filter}
                <FiX onClick={() => removeFilter(filter)} style={{ cursor: 'pointer' }} />
              </FilterTag>
            ))}
            <ClearButton onClick={clearFilters}>Limpar Filtros</ClearButton>
          </ActiveFilters>
        )}

        <TableCard>
          <TableTitle>Histórico de Pagamentos</TableTitle>
          <StyledTable>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Cliente</Th>
                <Th>Valor</Th>
                <Th>Data</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              <Tr>
                <Td>#001</Td>
                <Td>João Silva</Td>
                <Td>R$ 1.200,00</Td>
                <Td>15/03/2024</Td>
                <Td>
                  <StatusBadge>Pago</StatusBadge>
                </Td>
              </Tr>
              <Tr>
                <Td>#002</Td>
                <Td>Maria Santos</Td>
                <Td>R$ 850,00</Td>
                <Td>14/03/2024</Td>
                <Td>
                  <StatusBadge>Pendente</StatusBadge>
                </Td>
              </Tr>
              <Tr>
                <Td>#003</Td>
                <Td>Pedro Oliveira</Td>
                <Td>R$ 2.500,00</Td>
                <Td>13/03/2024</Td>
                <Td>
                  <StatusBadge>Atrasado</StatusBadge>
                </Td>
              </Tr>
            </tbody>
          </StyledTable>
          <Pagination>
            <PageButton disabled={currentPage === 1}>
              <FiChevronLeft /> Anterior
            </PageButton>
            <PageButton active>1</PageButton>
            <PageButton>2</PageButton>
            <PageButton>3</PageButton>
            <PageButton>
              Próximo <FiChevronRight />
            </PageButton>
          </Pagination>
        </TableCard>
      </Main>
    </Container>
  );
} 