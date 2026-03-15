export default async function handler(req, res) {
    // Взимаме съобщението от фронтенда
    const { userMessage } = req.body;
    
    // ВНИМАНИЕ: Тук не пишем ключа директно! 
    // Ще го вземем от системните настройки (Environment Variables)
    const API_KEY = process.env.GEMINI_API_KEY;

    const shrekPersona = "Ти си Шрек. Говори грубо, но забавно. Използвай 'блато', 'магаре' и мрази хората.";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const payload = {
        system_instruction: { parts: { text: shrekPersona } },
        contents: [{ parts: [{ text: userMessage }] }]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;

        // Връщаме отговора обратно към твоя сайт
        res.status(200).json({ text: aiText });
    } catch (error) {
        res.status(500).json({ error: "Грешка в блатото!" });
    }
}

