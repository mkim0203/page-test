const API_BASE = "http://127.0.0.1:18000";

async function askQuestion(question) {
    const response = await fetch(`${API_BASE}/api/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
    });

    if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
    }

    return await response.json();
}
