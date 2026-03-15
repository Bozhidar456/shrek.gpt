export default async function handler(req, res) {
  // 1. Проверка за метод
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Само POST заявки са позволени!" });
  }

  try {
    const { userMessage } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // 2. Проверка дали има съобщение и ключ
    if (!userMessage) return res.status(400).json({ text: "Прати съобщение, магаре!" });
    if (!API_KEY) return res.status(500).json({ text: "Липсва API ключ в Vercel!" });

    // 3. Заявка към Google
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();

    // 4. Проверка на отговора
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    } else {
      console.error("Google Error:", data);
      return res.status(500).json({ text: "Шрек се замисли твърде много (Грешка в данните)." });
    }

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ text: "ГРРРААР! Сървърът потъна в калта!" });
  }
}



