const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
let cors = require('cors')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.post('/convert', async (req, res) => {
  const { code, language } = req.body;
  try {
    const convertedCode = await convertCode(code, language);
    res.json({ convertedCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Code conversion failed' });
  }
});

app.post('/debug', async (req, res) => {
  const { code } = req.body;
  try {
    const debuggedCode = await debugCode(code);
    res.json({ debuggedCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Code debugging failed' });
  }
});

app.post('/quality', async (req, res) => {
  const { code, parameters } = req.body;
  try {
    const qualityResult = await checkCodeQuality(code, parameters);
    res.json({ qualityResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Code quality check failed' });
  }
});

async function convertCode(code, language) {
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    messages: [
      { role: 'system', content: 'You are a user requesting code conversion.' },
      { role: 'user', content: `Translate the following JavaScript code to ${language}: \n\n${code}` }
    ],
    max_tokens: 150,
    temperature: 0.6,
    model: 'gpt-3.5-turbo'
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });

  return response.data.choices[0].message.content.trim();
}

async function debugCode(code) {
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    messages: [
      { role: 'system', content: 'You are a user requesting code debugging.' },
      { role: 'user', content: `Debug the following JavaScript code: \n\n${code}` }
    ],
    max_tokens: 150,
    temperature: 0.6,
    model: 'gpt-3.5-turbo'
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });

  return response.data.choices[0].message.content.trim();
}

async function checkCodeQuality(code, parameters) {
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    messages: [
      { role: 'system', content: 'You are a user requesting code quality check.' },
      { role: 'user', content: `Evaluate the following JavaScript code: \n\n${code}\n\nBased on the parameters: ${parameters}` }
    ],
    max_tokens: 150,
    temperature: 0.6,
    model: 'gpt-3.5-turbo'
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });

  return response.data.choices[0].message.content.trim();
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
