// Helper para buscar produtos reais da Pushin Pay
export async function listPushinPayProducts(apiToken) {
  if (!apiToken) throw new Error('API token é obrigatório para listar produtos.');
  const API_BASE_URL = 'https://api.pushinpay.com.br/api';
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  if (response.status === 401 || response.status === 403) {
    throw new Error('Token Pushin Pay inválido ou sem permissão.');
  }
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro ao buscar produtos: ${errorBody}`);
  }
  const responseData = await response.json();
  let productsArray = [];
  if (Array.isArray(responseData)) {
    productsArray = responseData;
  } else if (responseData && Array.isArray(responseData.data)) {
    productsArray = responseData.data;
  } else if (responseData && Array.isArray(responseData.products)) {
    productsArray = responseData.products;
  } else {
    return [];
  }
  return productsArray.map((product) => {
    const priceInCents = parseInt(String(product.price), 10);
    const priceInReais = !isNaN(priceInCents) ? priceInCents / 100 : 0;
    return {
      external_product_id: String(product.id),
      name: product.name,
      price: priceInReais,
      imageUrl: product.image_url || product.image || product.thumbnail_url || `https://picsum.photos/seed/${product.id}/400/300`,
      description: product.description || '',
    };
  });
}

// Função para criar QR Code PIX via Pushin Pay
export async function createPixQrCode(apiToken, pixInput) {
  if (!apiToken) throw new Error('API token é obrigatório para criar QR Code PIX.');
  const API_BASE_URL = 'https://api.pushinpay.com.br/api';
  const payload = {
    value: pixInput.value, // em centavos
    webhook_url: pixInput.webhook_url || undefined,
    split_rules: pixInput.split_rules || undefined,
  };
  const response = await fetch(`${API_BASE_URL}/pix/cashIn`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (response.status === 401 || response.status === 403) {
    const errorBody = await response.text();
    throw new Error('Falha na autenticação ao criar QR Code PIX: ' + errorBody);
  }
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error('Erro ao criar QR Code PIX: ' + errorBody);
  }
  const data = await response.json();
  if (data && data.id && data.qr_code && data.status && typeof data.value !== 'undefined' && data.qr_code_base64) {
    return {
      id: data.id,
      qr_code: data.qr_code,
      status: data.status,
      value: Number(data.value),
      webhook_url: data.webhook_url || null,
      qr_code_base64: data.qr_code_base64,
    };
  } else {
    throw new Error('Formato de dados do QR Code PIX inesperado da API.');
  }
} 