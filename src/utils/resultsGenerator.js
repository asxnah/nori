import html2pdf from 'html2pdf.js';

export const generateResultsPDF = async (
	test,
	userAnswers,
	earnedPoints,
	totalPoints
) => {
	const element = document.createElement('div');

	const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@700&family=Montserrat:wght@400;500;700&display=swap');

    * {
      font-family: 'Montserrat Alternates', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    .quiz-page {
      padding: 1rem;
      font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #323232;
    }
    .heading {
      margin-bottom: 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .heading h1 {
      font-size: 1.15rem;
    }
    .heading p {
      width: fit-content;
      padding-bottom: 0.25rem;
      border-bottom: 0.1rem solid #323232;
    }
    .questions {
      display: grid;
      gap: 2rem;
    }
    .question {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .question-text {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .question-text span {
      font-style: italic;
      color: #787878;
    }
    .question-number {
      font-weight: 700;
      font-size: 1.25rem;
      color: #787878;
    }
    .answers {
      display: grid;
      gap: 0.5rem;
    }
    .answer {
      padding: 1rem 2rem;
      background-color: #F1F1F1;
      border-radius: 4rem;
      width: 100%;
      text-align: left;
    }
    .user-selected {
      border: 0.1rem solid #323232;
    }
    .true-false-container {
      display: flex;
      justify-content: center;
      gap: 4rem;
      margin-top: 1rem;
    }
    .true-false-option {
      padding: 0.5rem;
      border-radius: 50%;
    }
    .answer-textarea {
      width: 100%;
      margin-left: 2rem;
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
          <div class="answer ${
						selectedAnswers.has(i) ? 'user-selected' : ''
					}">${option}</div>
        `
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
          <div class="true-false-container">
            <div class="true-false-option ${
							userBool === true ? 'user-selected' : ''
						}">
              <svg width="60" height="60" viewBox="0 0 52 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_310_29)">
                  <rect x="41.6785" width="12" height="62" rx="6" transform="rotate(26.5973 41.6785 0)" fill="#323232"></rect>
                  <rect x="0.697632" y="28.9199" width="12" height="37.2388" rx="6" transform="rotate(-29.5603 0.697632 28.9199)" fill="#323232"></rect>
                </g>
                <defs>
                  <clipPath id="clip0_310_29">
                    <rect width="60" height="60" fill="transparent" transform="translate(0.697632)"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div class="true-false-option ${
							userBool === false ? 'user-selected' : ''
						}">
              <svg width="60" height="60" viewBox="0 0 61 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_310_33)">
                  <rect x="0.302307" y="8.48535" width="12" height="75.5977" rx="6" transform="rotate(-45 0.302307 8.48535)" fill="#323232"></rect>
                  <rect x="53.7579" width="12" height="75.5977" rx="6" transform="rotate(45 53.7579 0)" fill="#323232"></rect>
                </g>
                <defs>
                  <clipPath id="clip0_310_33">
                    <rect width="60" height="60" fill="transparent" transform="translate(0.302307)"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        `;
					break;
				}
			}

			return `
      <div class="question">
        <div class="question-text">
          <div class="question-number">${index + 1}</div>
          <p><span>${question.points} б</span> | ${question.questionText}</p>
        </div>
        <div class="answers">
          ${answerHtml}
        </div>
      </div>
    `;
		})
		.join('');

	element.innerHTML = `
    <style>${styles}</style>
    <div class="quiz-page">
      <div class="heading">
        <h1>${test.title} — ${userAnswers.userId.name} (@${userAnswers.userId.username})</h1>
        <p>Набрано баллов: ${earnedPoints} из ${totalPoints}</p>
      </div>
      <div class="questions">
        ${questionsHtml}
      </div>
    </div>
  `;

	const opt = {
		margin: [10, 10],
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
