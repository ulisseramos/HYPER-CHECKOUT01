import React from 'react';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';

export default function Configuracoes() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);

  // Aqui você pode adicionar lógica para atualizar dados no Supabase

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, padding: 32, width: '100%' }}>
        <h1>Configurações</h1>
        <form style={{ maxWidth: 400 }}>
          <div style={{ marginBottom: 18 }}>
            <label>Nova senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite a nova senha"
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Novo e-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Digite o novo e-mail"
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Foto de perfil</label>
            <input
              type="file"
              onChange={e => setAvatar(e.target.files[0])}
              style={{ width: '100%', marginTop: 4 }}
            />
          </div>
          <button type="submit" style={{ background: '#2d7cff', color: '#fff', padding: '10px 18px', border: 'none', borderRadius: 4 }}>
            Salvar alterações
          </button>
        </form>
      </main>
    </div>
  );
} 