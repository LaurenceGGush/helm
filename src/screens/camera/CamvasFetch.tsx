import { FC, useMemo, useRef } from "react"

import styled from "@emotion/styled"

import { useCamvasFetch } from "../../hooks/useCamvasFetch"
import type { Camera } from "../../store/types"
import FpsCounter from "./FpsCounter"

const CamvasFetch: FC<{ camera: Camera }> = ({ camera }) => {
	const { streamUrl, adaptiveUrl, fpstarget, flipX, flipY, type } = camera

	const ref = useRef<HTMLCanvasElement>(null)

	const transform = useMemo(() => {
		const transforms: string[] = []

		if (flipX) {
			transforms.push("scaleX(-1)")
		}
		if (flipY) {
			transforms.push("scaleY(-1)")
		}

		if (transforms.length) {
			return transforms.join(" ")
		}

		return ""
	}, [flipX, flipY])

	const baseUrl = useMemo(
		() =>
			type === "mjpgadaptive" && adaptiveUrl ? adaptiveUrl : streamUrl,
		[type, adaptiveUrl, streamUrl],
	)
	const targetFps = useMemo(
		() => (type === "mjpgadaptive" ? fpstarget : undefined),
		[type, fpstarget],
	)

	const fps = useCamvasFetch(ref, baseUrl, targetFps)

	// logger.log("Camera")
	return (
		<>
			<CamImages>
				<Canvas ref={ref} style={{ transform }} />
			</CamImages>

			<FpsCounter fps={fps} />
		</>
	)
}

const CamImages = styled.div`
	position: relative;
	aspect-ratio: 4/3;

	z-index: 0;
`

const Canvas = styled.canvas`
	position: relative;
	aspect-ratio: 4/3;
	width: 100%;
`

export default CamvasFetch
