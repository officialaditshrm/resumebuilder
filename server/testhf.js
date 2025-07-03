import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const HF_TOKEN = process.env.HUGGINGFACE_API_KEY; // or hardcode it here to test quickly

const apiUrl = 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';

async function testModel() {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: 'Say hello in JSON',
        parameters: { max_new_tokens: 50 },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`❌ ${response.status} ${response.statusText}: ${errText}`);
    }

    const json = await response.json();
    console.log('✅ Response:', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('🔥 Error:', err.message);
  }
}

testModel();
