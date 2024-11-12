// tabs styles control
let currentUrl = window.location.href;
let tabCreated = document.querySelector(`#tab-created`);
let tabFinished = document.querySelector(`#tab-finished`);

if (currentUrl.includes(`created`)) {
	tabCreated.classList.add(`active`);
	tabFinished.classList.remove(`active`);
} else if (currentUrl.includes(`finished`)) {
	tabFinished.classList.add(`active`);
	tabCreated.classList.remove(`active`);
} else {
	tabCreated.classList.add(`active`);
	tabFinished.classList.remove(`active`);
}

// user account edit
let editBtn = document.querySelector(`#edit`);
let infoNode = document.querySelector(`#heading`);

editBtn.addEventListener(`click`, () => {
	infoNode.innerHTML = `
		<form action="_edit_account.php" method="POST" id="edit_account">
			<div id="form-fields">
				<label for="username" hidden>Логин</label>
				<input type="text" name="username" id="username" placeholder="Логин" />

				<label for="password_old" hidden>Старый пароль</label>
				<input type="password" name="password_old" id="password_old" placeholder="Старый пароль" />

				<label for="password_new" hidden>Новый пароль</label>
				<input type="password" name="password_new" id="password_new" placeholder="Новый пароль" required />

				<label for="name" hidden>Имя</label>
				<input type="text" name="name" id="name" placeholder="Имя" />
			</div>
			<button type="submit" id="edit" aria-label="Закончить редактирование данных аккаунта">
				<img src="./assets/check.png" alt="галочка">
			</button>
		</form>
    `;

	// password validation
	let form = document.querySelector(`form#edit_account`);
	let pwOldInputNode = document.querySelector(`#password_old`);
	let pwNewInputNode = document.querySelector(`#password_new`);

	pwOldInputNode.addEventListener(`input`, () => {
		if (pwOldInputNode.value.length < 1) {
			pwOldInputNode.placeholder = `Введите старый пароль для внесения изменений.`;
		}
	});

	pwNewInputNode.addEventListener(`input`, () => {
		let passwordValue = pwNewInputNode.value;
		let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{4,}$/;

		if (!regex.test(passwordValue)) {
			pwNewInputNode.placeholder = `Пароль должен содержать строчные и прописные латинские буквы, минимум один специальный символ, минимум одну цифру.`;
		}
	});

	form.addEventListener(`submit`, (event) => {
		if (
			pwOldInputNode.value.length < 4 ||
			pwNewInputNode.value.length < 4 ||
			!pwNewInputNode.value.match(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{4,}$/
			)
		) {
			event.preventDefault();
			alert('Убедитесь, что все поля заполнены корректно.');
		}
	});
});
