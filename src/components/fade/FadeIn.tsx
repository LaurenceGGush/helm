import { Box } from "@chakra-ui/react"
import { keyframes } from "@chakra-ui/system"
import styled from "@emotion/styled"

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const FadeIn = styled(Box)`
	animation: ${fadeIn} backwards 0.5s 0.5s;
`

export default FadeIn
