import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './ToastProvider';
import { useNotification } from './NotificationContext';

function notifyNative(title, body) {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico', // Altere para o ícone do seu projeto se quiser
        tag: 'pix-venda',
      });
    }
  }
}

export default function SupabaseRealtimeListener() {
  const { showToast } = useToast();
  const { addNotification } = useNotification();

  useEffect(() => {
    // Pedir permissão para notificação nativa ao iniciar
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Listener para novos checkouts
    const channelCheckouts = supabase.channel('realtime:checkouts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'checkouts' }, payload => {
        showToast({
          title: 'Novo checkout criado!',
          message: `Um novo checkout foi criado: ${payload.new.checkout_name || 'Sem nome'}`,
        });
        addNotification({
          msg: 'Checkout criado com sucesso.',
          type: 'Checkout',
          date: new Date(),
        });
      })
      .subscribe();

    // Listener para novas transações (PIX/venda)
    const channelTransactions = supabase.channel('realtime:transactions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, payload => {
        console.log('[Realtime] Novo INSERT em transactions:', payload);
        const status = (payload.new.status || '').toLowerCase();
        const valor = payload.new.amount || '';
        if (status === 'aprovado' || status === 'approved' || status === 'paid') {
          showToast({
            title: 'Venda aprovada!',
            message: `Uma nova venda foi aprovada no valor de R$ ${valor}`,
          });
          addNotification({
            msg: 'Pagamento aprovado!',
            type: 'Pagamento',
            date: new Date(),
          });
          notifyNative('Venda Aprovada!', `Sua comissão: R$ ${valor}`);
        } else if (status === 'pendente' || status === 'pending') {
          showToast({
            title: 'Venda pendente',
            message: `Uma nova venda está pendente no valor de R$ ${valor}`,
          });
          addNotification({
            msg: 'Venda pendente!',
            type: 'Pagamento',
            date: new Date(),
          });
          notifyNative('Venda Pendente!', `Valor: R$ ${valor}`);
        } else {
          showToast({
            title: 'Nova transação',
            message: `Status: ${payload.new.status || 'desconhecido'}`,
          });
          addNotification({
            msg: `Nova transação: ${payload.new.status || 'desconhecido'}`,
            type: 'Pagamento',
            date: new Date(),
          });
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'transactions' }, payload => {
        console.log('[Realtime] UPDATE em transactions:', payload);
        const oldStatus = (payload.old.status || '').toLowerCase();
        const newStatus = (payload.new.status || '').toLowerCase();
        const valor = payload.new.amount || '';
        if (oldStatus !== newStatus) {
          if (newStatus === 'aprovado' || newStatus === 'approved' || newStatus === 'paid') {
            showToast({
              title: 'Venda aprovada!',
              message: `Uma venda foi aprovada no valor de R$ ${valor}`,
            });
            addNotification({
              msg: 'Pagamento aprovado!',
              type: 'Pagamento',
              date: new Date(),
            });
            notifyNative('Venda Aprovada!', `Sua comissão: R$ ${valor}`);
          } else if (newStatus === 'pendente' || newStatus === 'pending') {
            showToast({
              title: 'Venda pendente',
              message: `Uma venda ficou pendente no valor de R$ ${valor}`,
            });
            addNotification({
              msg: 'Venda pendente!',
              type: 'Pagamento',
              date: new Date(),
            });
            notifyNative('Venda Pendente!', `Valor: R$ ${valor}`);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channelCheckouts);
      supabase.removeChannel(channelTransactions);
    };
  }, [showToast, addNotification]);

  return null;
} 