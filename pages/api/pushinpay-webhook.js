import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Exemplo de payload do Pushin Pay (ajuste conforme necessário)
  const {
    transaction_id,
    value,
    payment_method,
    status,
    payment_details,
    customer,
    created_at,
    approved_at,
    user_id // ID do usuário dono da transação (precisa ser enviado pelo Pushin Pay ou mapeado)
  } = req.body;

  let finalUserId = user_id;
  // Se não veio user_id, tenta buscar pelo product_id ou checkout_id
  if (!finalUserId && payment_details?.product_id) {
    const { data: prod } = await supabase.from('products').select('user_id').eq('id', payment_details.product_id).single();
    if (prod && prod.user_id) finalUserId = prod.user_id;
  }
  if (!finalUserId && payment_details?.checkout_id) {
    const { data: checkout } = await supabase.from('checkouts').select('user_id').eq('id', payment_details.checkout_id).single();
    if (checkout && checkout.user_id) finalUserId = checkout.user_id;
  }

  // LOG do payload recebido para debug
  console.log('[PushinPay Webhook] Payload recebido:', JSON.stringify(req.body, null, 2));

  try {
    if (transaction_id) {
      // Atualiza se já existe
      const { error: updateError } = await supabase.from('transactions').update({
        status,
        approved_at
      }).eq('id', transaction_id);
      if (updateError) console.error('[PushinPay Webhook] Erro ao atualizar transação:', updateError);
    } else if (finalUserId) {
      // Se não existe, cria nova transação vinculada ao user_id correto
      const { error: insertError } = await supabase.from('transactions').insert({
        user_id: finalUserId,
        value,
        amount: value,
        payment_method,
        status: 'pendente',
        payment_details,
        customer,
        created_at,
        approved_at
      });
      if (insertError) console.error('[PushinPay Webhook] Erro ao inserir transação:', insertError);
      else console.log('[PushinPay Webhook] Transação inserida com sucesso!');
    } else {
      console.error('[PushinPay Webhook] Não foi possível determinar o user_id para a transação!');
    }
  } catch (e) {
    console.error('[PushinPay Webhook] Erro inesperado:', e);
  }

  // Disparar para webhooks customizados do usuário
  if (finalUserId) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/utmfy-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: finalUserId,
          transaction_id,
          value,
          payment_method,
          status,
          payment_details,
          customer,
          created_at,
          approved_at
        })
      });
    } catch (e) {
      // Apenas loga, não bloqueia o fluxo
      console.error('Erro ao disparar webhook customizado:', e);
    }
  }

  return res.status(200).json({ success: true });
} 