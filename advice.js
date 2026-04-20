export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { district, crop, farmerType, soilType, farmSize, question, weather } = req.body || {};

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY in Vercel environment variables' });
  }

  const prompt = `You are an expert Ugandan agronomist helping ${farmerType || 'a farmer'}.
District: ${district}
Crop: ${crop}
Soil type: ${soilType}
Farm size: ${farmSize} acres
Farmer question: ${question || 'Give planting and management advice.'}
Weather JSON: ${JSON.stringify(weather || {})}

Write a practical answer with these headings:
1. Planting timing
2. Crop management
3. Weather risks
4. Pest and disease watch
5. Immediate next steps

Keep it clear, grounded, and specific to the district and crop. Do not mention that you are an AI.`;

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: prompt,
      }),
    });

    const data = await response.json();
    const advice = data.output_text || 'No advice returned.';
    return res.status(200).json({ advice });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'OpenAI request failed' });
  }
}
