import { FC, useMemo, useRef } from "react"

import styled from "@emotion/styled"

import { useCameraImage } from "../../hooks/useCameraImage"
import type { Camera } from "../../store/types"
import FpsCounter from "./FpsCounter"

const CamImageSwapper: FC<{ camera: Camera }> = ({ camera }) => {
	const { streamUrl, adaptiveUrl, fpstarget, flipX, flipY, type } = camera

	const ref = useRef<HTMLImageElement>(null)

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

	const { fps, one, two } = useCameraImage(ref, baseUrl, targetFps)

	// logger.log("Camera")
	return (
		<>
			<CamImages ref={ref}>
				<CamImage style={{ transform }} alt="" {...one} />
				<CamImage style={{ transform }} alt="" {...two} />
			</CamImages>

			<FpsCounter fps={fps} />
		</>
	)
}

export const CamImages = styled.div`
	position: relative;
	aspect-ratio: 4/3;

	z-index: 0;
`

const CamImage = styled.img`
	width: 100%;
	height: 100%;

	&:nth-of-type(1) {
		position: absolute;
		top: 0;
		height: 100%;
	}

	&.front {
		z-index: 1;
	}

	&.back {
		z-index: 0;
	}
`

export default CamImageSwapper
