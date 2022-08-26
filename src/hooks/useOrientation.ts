import { useCallback, useEffect, useState } from "react"

import { landscapeBase } from "../theme/medias"

const matcher = globalThis.matchMedia(landscapeBase)

const useOrientation = () => {
	const [landscape, setLandscape] = useState(matcher.matches)

	const handleChange = useCallback(
		(event: MediaQueryListEvent) => setLandscape(event.matches),
		[],
	)

	useEffect(() => {
		matcher.addEventListener("change", handleChange)

		return () => matcher.removeEventListener("change", handleChange)
	}, [handleChange])

	return landscape ? "landscape" : "portrait"
}

export default useOrientation
