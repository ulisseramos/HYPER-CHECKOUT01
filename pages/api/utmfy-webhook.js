export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const {
    user_id,
    product_id,
    checkout_id,
    status,
    amount,
    customer_email,
    created_at,
    utmfy_token
  } = req.body;

  if (!utmfy_token) {
    return res.status(400).json({ error: 'UTMFY token is required' });
  }

  try {
    const response = await fetch('https://api.utmfy.com/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${utmfy_token}`
      },
      body: JSON.stringify({
        user_id,
        product_id,
        checkout_id,
        status,
        amount,
        customer_email,
        created_at
      })
    });
    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
} 