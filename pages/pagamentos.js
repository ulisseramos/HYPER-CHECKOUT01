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
  background: linear-gradient(135deg, #0a0012 0%, #0A0A0F 100%);
  color: #fff;
  font-family: 'Poppins', 'Inter', Arial, sans-serif;
  padding: 32px 0 0 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(90, 15, 214, 0.1) 0%, transparent 70%);
    animation: rotate 30s linear infinite;
    z-index: 0;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Main = styled.main`
  margin-left: ${props => props.marginLeft}px;
  padding: 40px 48px 40px 48px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 8px;
  background: rgba(24, 24, 31, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(90, 15, 214, 0.3);
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
  gap: 24px;
  margin-bottom: 24px;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(24, 24, 31, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(90, 15, 214, 0.3);
  box-shadow: 0 4px 12px rgba(90, 15, 214, 0.1);
  padding: 24px;
  min-height: 120px;
  gap: 18px;
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
    background: linear-gradient(90deg, #5a0fd6, #7c3aed);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(90, 15, 214, 0.2);
    border-color: rgba(90, 15, 214, 0.5);

    &::before {
      opacity: 1;
    }
  }
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
  background: rgba(24, 24, 31, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(90, 15, 214, 0.3);
  padding: 16px 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  background: rgba(20, 20, 26, 0.8);
  border: 1px solid rgba(90, 15, 214, 0.3);
  color: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  outline: none;
  width: 240px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #5a0fd6;
    box-shadow: 0 0 0 2px rgba(90, 15, 214, 0.2);
  }

  &::placeholder {
    color: #b3b3c6;
  }
`;

const Select = styled.select`
  background: rgba(20, 20, 26, 0.8);
  border: 1px solid rgba(90, 15, 214, 0.3);
  color: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    border-color: #5a0fd6;
    box-shadow: 0 0 0 2px rgba(90, 15, 214, 0.2);
  }

  option {
    background: #18181F;
    color: #fff;
  }
`;

const FilterButton = styled.button`
  background: linear-gradient(135deg, #5a0fd6 0%, #7c3aed 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(90, 15, 214, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(90, 15, 214, 0.3);
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(24, 24, 31, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(90, 15, 214, 0.3);
  padding: 12px 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const FilterTag = styled.div`
  background: linear-gradient(135deg, #5a0fd6 0%, #7c3aed 100%);
  color: #fff;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(90, 15, 214, 0.2);
`;

const ClearButton = styled.button`
  background: rgba(35, 35, 43, 0.8);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: auto;
  transition: all 0.3s ease;

  &:hover {
    background: #5a0fd6;
    transform: translateY(-2px);
  }
`;

const TableCard = styled.div`
  background: rgba(24, 24, 31, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(90, 15, 214, 0.3);
  box-shadow: 0 4px 12px rgba(90, 15, 214, 0.1);
  padding: 0;
  margin-top: 0;
  overflow-x: auto;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(90, 15, 214, 0.15);
  }
`;

const TableTitle = styled.div`
  color: #ede6fa;
  font-size: 1.25rem;
  font-weight: 900;
  padding: 24px 24px 0 24px;
  background: linear-gradient(90deg, #fff 0%, #b3b3c6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
    background: rgba(90, 15, 214, 0.05);
    ${Td} {
      color: #fff;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${props => {
    switch (props.status) {
      case 'Pago':
        return 'rgba(0, 255, 178, 0.1)';
      case 'Pendente':
        return 'rgba(255, 184, 0, 0.1)';
      case 'Atrasado':
        return 'rgba(255, 95, 95, 0.1)';
      default:
        return 'rgba(90, 15, 214, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Pago':
        return '#00FFB2';
      case 'Pendente':
        return '#FFB800';
      case 'Atrasado':
        return '#FF5F5F';
      default:
        return '#5a0fd6';
    }
  }};
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px;
  color: #b3b3c6;
  font-size: 0.98rem;
  gap: 12px;
`;

const PageButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #5a0fd6 0%, #7c3aed 100%)' : 'rgba(24, 24, 31, 0.8)'};
  color: #fff;
  border: 1px solid ${props => props.active ? 'transparent' : 'rgba(90, 15, 214, 0.3)'};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(90, 15, 214, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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
              <CardTitle>Total Recebido</CardTitle>
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
              <CardTitle>Pagamentos Pendentes</CardTitle>
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
              <CardTitle>Taxa de Conversão</CardTitle>
              <CardValue>3.2%</CardValue>
              <CardSub>
                <FiTrendingUp /> +0.8% este mês
              </CardSub>
            </CardInfo>
            <CardIcon>
              <FiPercent />
            </CardIcon>
          </Card>

          <Card>
            <CardInfo>
              <CardTitle>Pagamentos Realizados</CardTitle>
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
                  <StatusBadge status="Pago">
                    <FiCheckCircle /> Pago
                  </StatusBadge>
                </Td>
              </Tr>
              <Tr>
                <Td>#002</Td>
                <Td>Maria Santos</Td>
                <Td>R$ 850,00</Td>
                <Td>14/03/2024</Td>
                <Td>
                  <StatusBadge status="Pendente">
                    <FiClock /> Pendente
                  </StatusBadge>
                </Td>
              </Tr>
              <Tr>
                <Td>#003</Td>
                <Td>Pedro Oliveira</Td>
                <Td>R$ 2.500,00</Td>
                <Td>13/03/2024</Td>
                <Td>
                  <StatusBadge status="Atrasado">
                    <FiClock /> Atrasado
                  </StatusBadge>
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