function deferred<T = void>() {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	let resolve: (value: T | PromiseLike<T>) => void = () => {}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let reject: any

	const promise = new Promise<T>((res, rej) => {
		resolve = res
		reject = rej
	})

	return { promise, resolve, reject, getState: () => promiseState(promise) }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function promiseState(p: Promise<any>) {
	const t = {}

	return Promise.race([p, t]).then(
		(v) => (v === t ? "pending" : "fulfilled"),
		() => "rejected",
	)
}

export default deferred
