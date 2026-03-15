export default async function handler(req, res) {
    // Проверяваме дали методът е POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userMessage } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        // Ако съобщението е празно
        if (!userMessage) {
            return res.status(400).json({ text: "Кажи нещо, де!" });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await response.json();

        // Проверка дали Google върна грешка
        if (data.error) {
            return res.status(500).json({ text: "Грешка от Google: " + data.error.message });
        }

        const aiText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ text: aiText });

    } catch (error) {
        console.error("Грешка:", error);
        res.status(500).json({ text: "ГРРААР! Сървърът ми потъна в калта!" });
    }
}

