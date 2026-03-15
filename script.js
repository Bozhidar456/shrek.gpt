/**
 * ГЛАВНА ФУНКЦИЯ ЗА ИЗПРАЩАНЕ НА СЪОБЩЕНИЕ
 */
async function sendMessage() {
    const input = document.getElementById('userInput');
    const userMessageText = input.value;
    const chatWindow = document.getElementById('chatWindow');

    // Проверка за празно съобщение
    if (userMessageText.trim() === '') return;

    // 1. Показваме съобщението на потребителя
    appendMessage('user', userMessageText);

    // Изчистваме входа и скролваме надолу
    input.value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // 2. Показваме индикатор, че Шрек "мисли"
    const loadingId = appendLoadingIndicator();

    // 3. Извикваме нашия бекенд сървър (/api/chat)
    const shrekResponseText = await getRealAIResponseFromBackend(userMessageText);

    // 4. Премахваме индикатора за зареждане и показваме истинския отговор
    removeLoadingIndicator(loadingId);
    appendMessage('shrek', shrekResponseText);

    // Последно скролване до долу
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

/**
 * ФУНКЦИЯ ЗА КОМУНИКАЦИЯ С БЕКЕНДА
 */
async function getRealAIResponseFromBackend(userMessage) {
    try {
        // Викаме нашата Serverless функция, която създадохме в api/chat.js
        const response = await fetch('/api/chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userMessage: userMessage })
        });

        if (!response.ok) {
            throw new Error("Проблем с връзката към блатото");
        }

        const data = await response.json();
        return data.text; // Връщаме текста, който идва от AI

    } catch (error) {
        console.error("Грешка:", error);
        return "ГРРААР! Нещо се счупи! Сървърът ми потъна в калта! (Провери дали си пуснал проекта в Vercel)";
    }
}

/**
 * ПОМОЩНИ ФУНКЦИИ ЗА UI (Интерфейса)
 */

// Добавя балонче със съобщение в чата
function appendMessage(sender, text) {
    const chatWindow = document.getElementById('chatWindow');
    const messageDiv = document.createElement('div');
    
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'shrek-message');
    
    const label = sender === 'user' ? 'Човече' : 'Шрек';
    messageDiv.innerHTML = `<p><strong>${label}:</strong> ${text}</p>`;
    
    chatWindow.appendChild(messageDiv);
}

// Показва временно съобщение "Шрек мисли..."
function appendLoadingIndicator() {
    const chatWindow = document.getElementById('chatWindow');
    const loadingDiv = document.createElement('div');
    const uniqueId = 'loading-' + Date.now();
    
    loadingDiv.id = uniqueId;
    loadingDiv.classList.add('message', 'shrek-message');
    loadingDiv.innerHTML = `<p><em>Шрек си чеше главата и мисли...</em></p>`;
    
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    return uniqueId;
}

// Премахва индикатора за зареждане
function removeLoadingIndicator(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

/**
 * СЛУШАТЕЛИ ЗА СЪБИТИЯ
 */

// Позволява изпращане с натискане на Enter
document.getElementById('userInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

