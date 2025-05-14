import React from 'react';
import Sidebar from '../components/Sidebar';

export default function Clientes() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, padding: 32, width: '100%' }}>
        <h1>Clientes</h1>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7f9fc' }}>
              <th style={{ padding: 8, border: '1px solid #eee' }}>E-mail</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>Produto</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>Status</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>Valor</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>Data</th>
            </tr>
          </thead>
          <tbody>
            {/* Aqui você pode popular com os clientes do usuário */}
            <tr>
              <td style={{ padding: 8, border: '1px solid #eee' }}>cliente@email.com</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>Produto Exemplo</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>Aprovado</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>R$ 100,00</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>2024-04-27</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
} 