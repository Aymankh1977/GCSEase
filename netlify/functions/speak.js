// Proxies text to Google Cloud Text-to-Speech and returns MP3 audio.
// Voice: en-GB-Neural2-A — natural British English (Neural2 tier).
// Free tier: 1 million characters per month.
// Docs: https://cloud.google.com/text-to-speech

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'GOOGLE_TTS_API_KEY is not set on the server.' }),
    };
  }

  let text;
  try {
    ({ text } = JSON.parse(event.body || '{}'));
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

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: text.slice(0, 5000) },
        voice: {
          languageCode: 'en-GB',
          name: 'en-GB-Neural2-A',   // warm, natural British female voice
          ssmlGender: 'FEMALE',
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.95,        // slightly slower = more natural pacing
          pitch: 1.0,
          effectsProfileId: ['headphone-class-device'],
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Google TTS error: ${err.slice(0, 300)}` }),
    };
  }

  const { audioContent } = await res.json();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'audio/mpeg' },
    isBase64Encoded: true,
    body: audioContent, // Google already returns base64
  };
};
