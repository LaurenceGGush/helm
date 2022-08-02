import { FC } from "react"

import { Spinner as ChakraSpinner, SpinnerProps } from "@chakra-ui/react"
import styled from "@emotion/styled"

import { FadeIn } from "../fade"

/**
 * Fade in spinner
 * delay the appearance of the spinner to stop
 * it flashing on screen before content is loaded
 */
const Spinner: FC<SpinnerProps> = (props) => (
	<FadeInFlex className="Spinner">
		<ChakraSpinner
			thickness="0.125em"
			color="gray.700"
			emptyColor="gray.300"
			speed="2s"
			zIndex={1}
			{...props}
		/>
	</FadeInFlex>
)

const FadeInFlex = styled(FadeIn)`
	display: flex;
	justify-content: center;
`

export default Spinner
