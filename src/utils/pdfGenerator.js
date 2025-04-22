import html2pdf from 'html2pdf.js';

export const generateQuizPDF = async (quiz) => {
	const element = document.createElement('div');
	element.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@700&family=Montserrat:wght@400;500;700&display=swap');
      
      .quiz-page {
        padding: 1rem;
        font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #323232;
      }
      .heading {
        margin-bottom: 4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .heading p {
        color: #787878;
      }
      .heading h1 {
        font-family: 'Montserrat Alternates', , system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-weight: 700;
        color: #323232;
        font-size: 1.5rem;
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
      .question-number {
        font-weight: 700;
        font-size: 1.25rem;
        color: #787878;
      }
      .multiple-choice {
        display: grid;
        gap: 0.5rem;
      }
      .option {
        padding: 1rem 2rem;
        background-color: #F1F1F1;
        border-radius: 4rem;
        width: 100%;
        text-align: left;
        font-weight: 500;
      }
      .true-false {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4rem;
      }
      .true-false-option {
        width: 4rem;
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .open-text {
        padding: 2rem;
        width: 100%;
        height: 12rem;
        border: 0.1rem solid #DEDEDE;
        border-radius: 2rem;
        position: relative;
      }
      .open-text::before {
        content: '';
        position: absolute;
        top: 2rem;
        left: 2rem;
        color: #787878;
      }
        text-align: center;
        line-height: 4.75rem;
        font-weight: 500;
      }
      .open-text {
        padding: 2rem;
        width: 100%;
        height: 12rem;
        border: 0.1rem solid #DEDEDE;
        border-radius: 2rem;
      }
    </style>
    <div class="quiz-page">
      <section class="heading">
          <h1>${quiz.title}</h1>
        ${quiz.description ? `<p>${quiz.description}</p>` : ''}
      </section>
      <div class="questions">
        ${quiz.questionIds
					.map(
						(question, index) => `
          <div class="question">
            <div class="question-text">
              <div class="question-number">${index + 1}</div>
              <p>${question.questionText}</p>
            </div>
            ${
							question.type === 'multipleChoice'
								? `<div class="multiple-choice">
                  ${question.options
										.map(
											(option) => `
                    <div class="option">☐ ${option}</div>
                  `
										)
										.join('')}
                </div>`
								: question.type === 'trueFalse'
								? `<div class="true-false">
                    <div class="true-false-option">
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
                    <div class="true-false-option">
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
                  </div>`
								: `<div class="open-text"></div>`
						}
          </div>
        `
					)
					.join('')}
      </div>
    </div>
  `;

	const opt = {
		margin: [10, 10],
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
