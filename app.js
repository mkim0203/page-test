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

document.querySelector("#questionForm").addEventListener("click", async () => {
    const question = document.querySelector("#question").value.trim();
    const answerBox = document.querySelector("#answer");

    if (!question) return;

    answerBox.textContent = "자료를 찾는 중...";

    try {
        const result = await askQuestion(question);
        answerBox.textContent = result.answer;
    } catch (error) {
        answerBox.textContent =
            "API 연결에 실패했습니다. 로컬 서버와 브라우저 권한을 확인하세요.";
        console.error(error);
    }
});
