const axios = require('axios');
const crypto = require('crypto');

module.exports = async (req, res) => {
  const partnerId = 'f1ecf553a71b3d2d7f6db5a84cb8d9f2';
  const secretKey = '4zo5HjVFAB';

  const payload = {
    path: 'product/list_product',
    data: {
      category: 50 // ✅ Change if needed
    }
  };

  const payloadStr = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(payloadStr + timestamp + payload.path)
    .digest('base64');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${partnerId}:${secretKey}`).toString('base64')}`,
    auth: signature,
    timestamp: timestamp
  };

  try {
    const response = await axios.post(
      'https://moogold.com/wp-json/v1/api/product/list_product',
      payloadStr,
      { headers }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('MooGold Proxy Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to contact MooGold.' });
  }
};
