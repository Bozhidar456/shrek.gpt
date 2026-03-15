export default async function handler(req, res) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const { userMessage } = req.body;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ text: "Грешка в отговора на Шрек" });
    }
  } catch (error) {
    res.status(500).json({ text: "Сървърът заседна!" });
  }
}


