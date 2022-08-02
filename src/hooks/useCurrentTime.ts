import { useEffect, useState } from "react"

const shortTimeFormat = new Intl.DateTimeFormat("en", {
	hour: "2-digit",
	minute: "2-digit",
})

const useCurrentTime = () => {
	const [time, setTime] = useState(new Date())

	useEffect(() => {
		let timeInterval: NodeJS.Timeout

		const timeOut = setTimeout(() => {
			timeInterval = setInterval(() => setTime(new Date()), 60000)
		}, (61 - new Date().getSeconds()) * 1000)

		return () => {
			clearTimeout(timeOut)
			clearInterval(timeInterval)
		}
	}, [setTime])

	return shortTimeFormat.format(time)
}

export default useCurrentTime
