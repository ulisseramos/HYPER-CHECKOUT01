# Hypercheckout

Plataforma de gateway de pagamento com integração Pushin Pay, Facebook Pixel, UTMFY e painel individual por usuário.

## Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env.local` com as chaves do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=URL_DO_SEU_SUPABASE
   NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY
   ```
3. Rode o projeto:
   ```bash
   npm run dev
   ```

Acesse em [http://localhost:3000](http://localhost:3000)

---

## Funcionalidades
- Autenticação de usuários
- Painel individual
- Produtos (importação automática da Pushin Pay)
- Criação de checkouts
- Pagamentos e transações
- Clientes
- Integrações (Pushin Pay, Facebook Pixel, UTMFY)
- Configurações de conta

---

Desenvolvido com Next.js e Supabase.

# Dashboard Simulado

Este projeto é um dashboard moderno, inspirado em plataformas de vendas, feito com React, Styled Components e Chart.js.

## Principais Tecnologias
- React
- Styled Components
- Chart.js & react-chartjs-2

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode o projeto:
   ```bash
   npm start
   ```

O dashboard usará dados simulados, igual ao exemplo da imagem. Para conectar com dados reais, personalize os arquivos de dados. 