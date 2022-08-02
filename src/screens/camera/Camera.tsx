import { FC } from "react"

import { Box, IconButton } from "@chakra-ui/react"
import styled from "@emotion/styled"
import { CgCloseO } from "react-icons/cg"

import { useCamera } from "../../hooks/useCamera"
import { colourModeRule } from "../../theme/colourMode"
import { Camvas } from "./Camvas"

interface CamProps {
	/**
	 * Close camera feed
	 */
	closeCam?: () => void
}
/**
 * Display camera feed
 */
const Camera: FC<CamProps> = ({ closeCam, ...rest }) => {
	const camera = useCamera()

	if (!camera) {
		return null
	}

	return (
		<CamWrapper className="Camera" {...rest}>
			<Camvas camera={camera} />

			{closeCam && (
				<CloseCam
					aria-label="close"
					icon={<CgCloseO />}
					variant="ghost"
					size="sm"
					onClick={closeCam}
				/>
			)}
		</CamWrapper>
	)
}

const CamWrapper = styled(Box)`
	position: relative;
	width: 100%;
	max-width: min(20rem, 100%);
	max-height: 100%;
	aspect-ratio: 4/3;

	margin: 0 auto;

	background: var(--chakra-colors-button-bg);

	border-radius: var(--chakra-radii-md);

	overflow: auto;
`

const CloseCam = styled(IconButton)`
	position: absolute;
	top: 0;
	right: 0;

	background: none;

	svg {
		${colourModeRule(
			"filter",
			"drop-shadow(1px 1px 3px rgba(255, 255, 255, 0.5))",
			"drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.5))",
		)}
	}
`

export default Camera
