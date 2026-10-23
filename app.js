
const form = document.getElementById("questionForm");
const input = document.getElementById("question");
const messages = document.getElementById("messages");
const submitButton = document.getElementById("submitButton");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = input.value.trim();

    if (!question) {
        return;
    }

    // 첫 질문부터 안내 문구 제거
    document.getElementById("welcome")?.remove();

    // 새로운 대화 묶음 생성
    const turn = document.createElement("section");
    turn.className = "qa-turn";

    // 사용자 질문 말풍선
    const questionRow = document.createElement("div");
    questionRow.className = "qa-question-row";

    const questionBubble = document.createElement("div");
    questionBubble.className = "qa-question";
    questionBubble.textContent = question;

    questionRow.appendChild(questionBubble);
    turn.appendChild(questionRow);

    // 답변 카드
    const answerCard = document.createElement("div");
    answerCard.className = "qa-answer";

    const answerHeader = document.createElement("div");
    answerHeader.className = "qa-answer-header";

    const botIcon = document.createElement("div");
    botIcon.className = "qa-bot-icon";
    botIcon.textContent = "AI";

    const headerText = document.createElement("span");
    headerText.textContent = "AI 답변";

    answerHeader.append(botIcon, headerText);

    const answerContent = document.createElement("div");
    answerContent.className = "qa-answer-content";
    answerContent.textContent = "답변을 생성하고 있습니다...";

    answerCard.append(answerHeader, answerContent);
    turn.appendChild(answerCard);

    // 기존 대화는 유지하고 새 대화만 추가
    messages.appendChild(turn);
    turn.scrollIntoView({ behavior: "smooth", block: "start" });

    // 연속 제출 방지
    input.value = "";
    submitButton.disabled = true;

    try {
        const response = await fetch(
            "http://192.168.0.2:18000/api/ask",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ question: question })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        const result = await response.json();

        // 현재 질문의 답변만 변경
        answerContent.textContent =
            result.answer ?? "답변이 없습니다.";

        // 참고 문서 추가
        if (Array.isArray(result.sources) &&
            result.sources.length > 0) {

            const sources = document.createElement("div");
            sources.className = "qa-sources";

            const title = document.createElement("h3");
            title.textContent = "참고 문서";
            sources.appendChild(title);

            result.sources.forEach((source) => {
                const item = document.createElement("div");
                item.className = "qa-source-item";

                const fileName = document.createElement("span");
                fileName.textContent =
                    source.file ?? source.filename ?? "문서";

                const page = document.createElement("span");
                page.className = "qa-source-page";

                const pageNumber = source.page ?? source.page_no;
                page.textContent = pageNumber != null
                    ? `${pageNumber}페이지`
                    : "";

                item.append(fileName, page);
                sources.appendChild(item);
            });

            answerCard.appendChild(sources);
        }

    } catch (error) {
        console.error("질문 처리 오류:", error);

        answerContent.textContent =
            "답변을 가져오지 못했습니다. API 서버와 네트워크 연결을 확인해 주세요.";

    } finally {
        submitButton.disabled = false;
        input.focus();
        turn.scrollIntoView({ behavior: "smooth", block: "start" });
    }
});
