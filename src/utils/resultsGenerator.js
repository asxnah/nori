import html2pdf from 'html2pdf.js';

export const generateResultsPDF = async (
	test,
	userAnswers,
	earnedPoints,
	totalPoints
) => {
	const element = document.createElement('div');

	const styles = `
    @import url('https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap');
    .quiz-page * {
      font-family: "PT Serif", system-ui, -apple-system, BlinkMacSystemFont, serif;
      color: #323232;
    }
    .heading {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .heading h1 {
      font-size: 1.05rem;
    }
    .heading p {
      width: fit-content;
      padding-bottom: 0.15rem;
      border-bottom: 0.1rem solid #323232;
    }
    .questions {
      display: grid;
      gap: 1rem;
    }
    .question {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 0.5rem;
    }
    .question-text span {
      color: #787878;
    }
    .answers {
      display: grid;
      gap: 0.25rem;
    }
    .answers:has(.boolean) {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }
    .answer {
      margin-left: 1rem;
      width: fit-content;
      text-align: left;
    }
    .answer.boolean {
      font-size: 2rem;
    }
    .answer.user-selected {
      padding: 0 1rem 0.25rem 1rem;
      border: 0.1rem solid #323232;
      border-radius: 1rem;
    }
    .answer-textarea {
      width: 100%;
      margin-left: 1rem;
    }
  `;

	const questionsHtml = test.questionIds
		.map((question, index) => {
			const userAnswer = userAnswers.answers[index];
			let answerHtml = '';

			switch (question.type) {
				case 'multipleChoice': {
					const selectedAnswers = new Set(
						(Array.isArray(userAnswer.selected)
							? userAnswer.selected
							: [userAnswer.selected]
						).map((item) => (item === null ? null : Number(item)))
					);

					answerHtml = question.options
						.map(
							(option, i) => `
          <p class="answer ${
						selectedAnswers.has(i) ? 'user-selected' : ''
					}">• ${option}</p>`
						)
						.join('');
					break;
				}

				case 'openText': {
					const textAnswer = userAnswer.selected[0];
					answerHtml = `
          <div class="answer-textarea">${
						textAnswer === null ? '-' : textAnswer
					}</div>
        `;
					break;
				}

				case 'trueFalse': {
					const selectedValue = Array.isArray(userAnswer.selected)
						? userAnswer.selected[0]
						: userAnswer.selected;
					const userBool =
						selectedValue === null || selectedValue === undefined
							? null
							: selectedValue === true || selectedValue === 'true';

					answerHtml = `
            <p class="answer boolean ${
							userBool === true ? 'user-selected' : ''
						}">✔</p>
            <p class="answer boolean ${
							userBool === false ? 'user-selected' : ''
						}">✖</p>
        `;
					break;
				}
			}

			return `
      <div class="question">
          <p class="question-text">${index + 1}) (<span>${
				question.points
			} б</span>) ${question.questionText}</p>
        <div class="answers">
          ${answerHtml}
        </div>
      </div>
    `;
		})
		.join('');

	const pointsHTML =
		totalPoints > 0
			? `<p>Набрано баллов: ${earnedPoints} из ${totalPoints}</p>`
			: ``;

	element.innerHTML = `
    <style>${styles}</style>
    <div class="quiz-page">
      <div class="heading">
        <h1>${test.title} — ${userAnswers.userId.name} (@${userAnswers.userId.username})</h1>
        ${pointsHTML}
      </div>
      <div class="questions">
        ${questionsHtml}
      </div>
    </div>
  `;

	const opt = {
		margin: [6, 6],
		filename: `${test.title} - Результаты.pdf`,
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: {
			scale: 2,
			useCORS: true,
			letterRendering: true,
		},
		jsPDF: {
			unit: 'mm',
			format: 'a4',
			orientation: 'portrait',
		},
	};

	return html2pdf().set(opt).from(element).save();
};
