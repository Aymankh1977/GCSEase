// Proxies text to OpenAI TTS and returns MP3 audio.
// Keeps the API key server-side; the browser never sees it.
// Voice: "nova" — warm, natural, sounds close to ChatGPT voice.

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'OPENAI_API_KEY is not set on the server.' }),
    };
  }

  let text, voice;
  try {
    ({ text, voice = 'nova' } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: 'Bad JSON' };
  }

  if (!text || typeof text !== 'string') {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'text is required' }),
    };
  }

  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      voice,
      input: text.slice(0, 4096),
      response_format: 'mp3',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `OpenAI TTS error: ${err.slice(0, 200)}` }),
    };
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'audio/mpeg' },
    isBase64Encoded: true,
    body: buffer.toString('base64'),
  };
};
