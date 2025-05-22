import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/painel');
      } else {
        router.replace('/login');
      }
    });
  }, [router]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <img src="https://i.imgur.com/1z5yHIU.png" alt="Logo" style={{ width: 120, marginBottom: 24 }} />
      <div>Carregando...</div>
    </div>
  );
} 