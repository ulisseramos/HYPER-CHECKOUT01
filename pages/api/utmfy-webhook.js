import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Dados da transação recebidos no body
  const {
    user_id,
    transaction_id,
    value,
    payment_method,
    status,
    payment_details,
    customer,
    created_at,
    approved_at
  } = req.body;

  // Buscar webhooks cadastrados pelo usuário
  const { data: webhooks, error: whError } = await supabase
    .from('webhooks')
    .select('*')
    .eq('user_id', user_id);

  if (whError) {
    return res.status(500).json({ error: 'Erro ao buscar webhooks.' });
  }

  // Payload padrão
  const payload = {
    id: transaction_id,
    value,
    payment_method,
    status,
    payment_details,
    customer,
    created_at,
    approved_at
  };

  // Enviar evento para UTMFY se o usuário tiver integração configurada
  let utmfyResult = null;
  const { data: utmfyIntegration } = await supabase
    .from('user_integrations')
    .select('api_key')
    .eq('user_id', user_id)
    .eq('integration_name', 'utmfy')
    .single();
  if (utmfyIntegration && utmfyIntegration.api_key) {
    try {
      const utmfyRes = await fetch('https://api.utmfy.com/event', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${utmfyIntegration.api_key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event: 'new_sale',
          data: payload
        })
      });
      utmfyResult = { status: utmfyRes.status };
    } catch (e) {
      utmfyResult = { error: e.message };
    }
  }

  // Se não existe transação, cria uma nova vinculada ao user_id correto
  if (!transaction_id && user_id) {
    await supabase.from('transactions').insert({
      user_id,
      value,
      payment_method,
      status,
      payment_details,
      customer,
      created_at,
      approved_at
    });
  }

  // Disparar para todos os webhooks
  const results = [];
  for (const wh of webhooks) {
    try {
      const response = await fetch(wh.url, {
        method: wh.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(wh.headers ? JSON.parse(wh.headers) : {})
        },
        body: JSON.stringify(payload)
      });
      results.push({ url: wh.url, status: response.status });
    } catch (e) {
      results.push({ url: wh.url, error: e.message });
    }
  }

  return res.status(200).json({ success: true, results, utmfyResult });
} 