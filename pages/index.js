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

  return <div>Carregando...</div>;
} 