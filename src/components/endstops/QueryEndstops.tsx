import { useEffect, useState } from "react"

import { Badge, Box, Button } from "@chakra-ui/react"
import { css } from "@emotion/react"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import usePrinter from "../../hooks/usePrinter"
import { useEndstops } from "../../hooks/usePrinterStatus"
import type { Endstops } from "../../store/types"

const QueryEndstops = () => {
	const printer = usePrinter()

	const endstops = useEndstops()
	const [queriedEndstops, setQueriedEndstops] = useState<Endstops>({})

	const handleQueriedEndstops = (queriedEndstops: Endstops) => {
		const processed = Object.fromEntries(
			Object.entries(queriedEndstops).map((entry) => {
				const split = entry[0].split(" ")
				if (split[0] === "manual_stepper") {
					entry[0] = split[1]
				}

				return entry
			}),
		)

		setQueriedEndstops(processed)
	}

	useEffect(() => {
		let tim: number

		if (queriedEndstops.x) {
			tim = window.setTimeout(() => setQueriedEndstops({}), 10000)
		}

		return () => clearTimeout(tim)
	}, [queriedEndstops])

	return (
		<>
			<Button
				display="flex"
				size="sm"
				onClick={() =>
					printer.queryEndstops().then(handleQueriedEndstops)
				}
			>
				Query Endstops
			</Button>

			<Box css={gCss}>
				{endstops.map((endstop) => (
					<TransitionGroup key={endstop} className="tGroup">
						<CSSTransition
							key={queriedEndstops[endstop] ? endstop : "unknown"}
							addEndListener={(node, done) =>
								node.addEventListener(
									"transitionend",
									done,
									false,
								)
							}
							classNames="fade"
							css={[
								fCss,
								queriedEndstops[endstop] ? inCss : outCss,
							]}
						>
							<Badge
								fontSize="3xs"
								colorScheme={
									queriedEndstops[endstop] === "TRIGGERED"
										? "orange"
										: queriedEndstops[endstop]
										? "cyan"
										: "gray"
								}
								color={
									queriedEndstops[endstop]
										? undefined
										: "gray"
								}
								noOfLines={1}
								textOverflow="ellipsis"
							>
								{queriedEndstops[endstop] || "unknown"}
							</Badge>
						</CSSTransition>

						{endstop}
					</TransitionGroup>
				))}
			</Box>
		</>
	)
}

const gCss = css`
	.tGroup {
		position: relative;
		text-align: right;

		height: 1.125rem;
		line-height: 1rem;

		font-size: var(--chakra-fontSizes-sm);
	}
`

const fCss = css`
	position: absolute;

	&.fade-enter {
		opacity: 0;
	}
	&.fade-exit {
		opacity: 1;
	}
`

const inCss = css`
	z-index: 10;

	&.fade-enter-active {
		opacity: 1;
		transition: opacity 50ms ease-in;
	}
	&.fade-exit-active {
		opacity: 0;
		transition: opacity 20000ms ease-in;
	}
`

const outCss = css`
	&.fade-enter-active {
		opacity: 1;
		transition: opacity 2000ms ease-in 18000ms;
	}
	&.fade-exit-active {
		opacity: 0;
		transition: opacity 50ms ease-in;
	}
`

export default QueryEndstops
