/* eslint-disable @typescript-eslint/no-explicit-any */
export class RequestError extends Error {
	data: any
	constructor(message: string, data: any) {
		super(message)

		this.name = "RequestError"
		this.data = data
	}
}
