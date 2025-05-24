import html2pdf from 'html2pdf.js';

export const generateQuizPDF = async (quiz) => {
	const element = document.createElement('div');
	const styles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap');
    * {
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
      font-family: "PT Serif", system-ui, -apple-system, BlinkMacSystemFont, serif;
      font-size: 1.05rem;
    }
    .heading p {
      width: fit-content;
    }
    .question {
      display: grid;
      gap: 0.5rem;
    }
    .multiple-choice {
      margin-bottom: 1rem;
      display: grid;
      gap: 0.25rem;
    }
    .multiple-choice span {
      font-size: 1.5rem;
    }
    .option {
      margin-left: 1rem;
      width: fit-content;
      text-align: left;
    }
    .booleans {
      margin-bottom: 1rem;
      margin-left: 1rem;
      display: flex;
      gap: 2rem;
    }
    .booleans .option {
      font-size: 1.75rem;
    }
    .open-text {
      margin-bottom: 1rem;
      width: 100%;
      height: 16rem;
      border: 0.1rem solid #323232;
      border-radius: 0.1rem;
    }
  </style>
  `;
	element.innerHTML = `
    ${styles}
    <div class="quiz-page">
      <section class="heading">
          <h1>${quiz.title}</h1>
        ${quiz.description ? `<p>${quiz.description}</p>` : ''}
      </section>
      <div class="questions">
        <div class="question">
        ${quiz.questionIds
					.map(
						(question, index) => `
              <p class="question-text">${index + 1}) ${
							question.questionText
						}</p>
            ${
							question.type === 'multipleChoice'
								? `<div class="multiple-choice">
                  ${question.options
										.map(
											(option) => `
                    <p class="option"><span>☐</span> ${option}</p>
                  `
										)
										.join('')}
                </div>`
								: question.type === 'trueFalse'
								? `<div class="booleans">
                    <p class="option boolean">✔</p>
                    <p class="option boolean">✖</p>
                  </div>`
								: `<div class="open-text">${''}</div>`
						}
          `
					)
					.join('')}
        </div>
      </div>
    </div>
  `;

	const opt = {
		margin: [6, 6],
		filename: `${quiz.title}.pdf`,
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
