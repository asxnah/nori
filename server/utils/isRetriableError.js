export function isRetriableError(error) {
	const transientMessages = [
		'ECONNRESET',
		'ETIMEDOUT',
		'MongoNetworkError',
		'failed to connect',
	];

	return transientMessages.some((msg) => error.message.includes(msg));
}
