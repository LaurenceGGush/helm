import { FC, ReactNode } from "react"

import { As, Box } from "@chakra-ui/react"
import { css } from "@emotion/react"
import { Transition } from "react-transition-group"
import { TimeoutProps } from "react-transition-group/Transition"

const defaultCss = css`
	transition: opacity var(--duration) ease-in-out var(--delay);
	opacity: 0;
`

const transitionCss = {
	entering: css`
		opacity: 1;
	`,
	entered: css`
		opacity: 1;
	`,
	exiting: css`
		opacity: 0;
	`,
	exited: css`
		opacity: 0;
	`,
	unmounted: "",
}

interface FadeInOutProps extends Omit<TimeoutProps<HTMLElement>, "timeout"> {
	children: ReactNode
	as?: As
	duration?: number
	delay?: number
}

const FadeInOut: FC<FadeInOutProps> = ({
	children,
	className,
	css: fCss,
	as = "span",
	duration = 500,
	delay = 500,
	...rest
}) => {
	const durationCss = css`
		--delay: ${delay}ms;
		--duration: ${duration}ms;
	`

	return (
		<Transition timeout={delay + duration} {...rest}>
			{(state) => (
				<Box
					as={as}
					className={className}
					css={[fCss, defaultCss, durationCss, transitionCss[state]]}
				>
					{children}
				</Box>
			)}
		</Transition>
	)
}

export default FadeInOut
