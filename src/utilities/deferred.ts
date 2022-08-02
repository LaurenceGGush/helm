/* eslint-disable @typescript-eslint/no-explicit-any */
function deferred() {
	let resolve: any
	let reject: any

	const promise = new Promise((res, rej) => {
		resolve = res
		reject = rej
	})

	return { promise, resolve, reject }
}

export default deferred
