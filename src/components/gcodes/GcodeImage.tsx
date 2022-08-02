import { FC } from "react"

import { Icon, Image, ImageProps } from "@chakra-ui/react"
import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { FiBox } from "react-icons/fi"

import { filesUrl } from "../../settings"

interface GcodeImageProps extends ImageProps {
	path?: string
}

const GcodeImage: FC<GcodeImageProps> = ({ path, className }) => {
	const src = path && `${filesUrl}/gcodes/${path}`

	return (
		<StyledImage
			className={`GcodeImage ${className || ""}`}
			src={src}
			fallback={
				<ImageFallback
					className={`GcodeImageFallback ${className || ""}`}
					as={FiBox}
				/>
			}
		/>
	)
}

const baseCss = css`
	background: var(--chakra-colors-tag-bg);

	width: 2.25rem;
	height: 2.25rem;
	padding: var(--chakra-sizes-1);

	border-radius: var(--chakra-sizes-1);
`

const StyledImage = styled(Image)`
	${baseCss}
`

const ImageFallback = styled(Icon)`
	${baseCss}

	padding: var(--chakra-sizes-2);

	animation-name: fadeIn;
	animation-duration: 0.125s;

	animation-delay: 0.25s;
	animation-direction: normal;
	animation-fill-mode: both;

	@keyframes fadeIn {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}
`

export default GcodeImage
