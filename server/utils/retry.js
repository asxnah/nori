export async function retry(
	fn,
	retries = 3,
	delayMs = 500,
	isRetriable = () => true
) {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			return await fn();
		} catch (err) {
			if (!isRetriable(err) || attempt === retries) {
				throw err;
			}
			console.warn(
				`Попытка #${attempt} не удалась. Повтор через ${delayMs} мс.`
			);
			await new Promise((res) => setTimeout(res, delayMs));
		}
	}
}
