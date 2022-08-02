import { useCallback } from "react"

import { useAtom } from "jotai"

import { adjusterAtom } from "../store"

const useAdjustMachine = () => {
	const [adjuster, updateAdjuster] = useAtom(adjusterAtom)

	const closeAdjuster = useCallback(
		() => updateAdjuster("close"),
		[updateAdjuster],
	)

	return {
		adjuster,
		updateAdjuster,
		closeAdjuster,
	}
}

export default useAdjustMachine
