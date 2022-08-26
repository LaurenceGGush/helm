import { Suspense, useCallback, useEffect, useState } from "react"

import { Box, BoxProps, Flex } from "@chakra-ui/react"
import { css } from "@emotion/react"
import styled from "@emotion/styled"

import Spinner from "./components/spinner"
import { useHostname } from "./hooks/usePrinterInfo"
import usePrinterStatus from "./hooks/usePrinterStatus"
import Header from "./sections/header"
import Status from "./sections/status"
import Tabs from "./sections/tabs"
import { Store } from "./store"
import { landscape } from "./theme/medias"
import { logger } from "./utilities/logger"

const Printer = () => {
	const [showDebug, setShowDebug] = useState(false)
	const toggleDebug = useCallback(() => setShowDebug((sd) => !sd), [])

	const [showCam, setShowCam] = useState(false)
	const closeCam = useCallback(() => setShowCam(false), [])
	const toggleCam = useCallback(() => setShowCam((showCam) => !showCam), [])

	useEffect(() => {
		if (document.location.pathname.slice(1, 4) === "cam") {
			setShowCam(true)
		}
	}, [setShowCam])

	logger.info("Printer")

	return (
		<>
			<Header
				css={headerCss}
				toggleDebug={toggleDebug}
				toggleCam={toggleCam}
			/>

			{showDebug ? (
				<DebugInfo />
			) : (
				<>
					<Suspense
						fallback={
							<Flex
								className="Main Fallback"
								justifyContent="center"
								alignItems="center"
								marginTop="30vh"
							>
								<Spinner />
							</Flex>
						}
					>
						<Store />

						<Main className="Main">
							<Tabs
								css={tabsCss}
								showCam={showCam}
								closeCam={closeCam}
							/>

							<Status css={statusCss} />
						</Main>
					</Suspense>
				</>
			)}
		</>
	)
}

const Main = (props: BoxProps) => {
	const hostname = useHostname()

	if (hostname) {
		return <Box as="main" css={mainCss} {...props} />
	}

	return (
		<Flex justifyContent="center" alignItems="center" marginTop="30vh">
			<Spinner />
		</Flex>
	)
}

const headerCss = css`
	background: var(--chakra-colors-contrast-bg);
	border-bottom: 1px solid var(--chakra-colors-contrast-b);
`

const tabsCss = css`
	flex-grow: 1;
	height: 50%;
	width: 100%;
	padding: var(--chakra-space-1) var(--chakra-space-1) 0;

	${landscape} {
		padding: var(--chakra-space-1) 0 var(--chakra-space-1)
			var(--chakra-space-1);
	}
`

const statusCss = css`
	width: 100%;
	padding: var(--chakra-space-1-5) var(--chakra-space-1) var(--chakra-space-1);

	background: var(--chakra-colors-contrast-bg);
	border-top: 1px solid var(--chakra-colors-contrast-b);

	${landscape} {
		background: none;
		border-style: none;

		width: 35%;
		padding: var(--chakra-space-2-5) var(--chakra-space-1)
			var(--chakra-space-1) var(--chakra-space-2);
	}
`

const DebugInfo = () => {
	const status = usePrinterStatus()

	const htmlStyle = window.getComputedStyle(
		document.querySelector("html") as HTMLElement,
	)

	const sizes = {
		appHeight: document.getElementById("root")?.offsetHeight,
		appWidth: document.getElementById("root")?.offsetWidth,
		bodyHeight: document.getElementsByTagName("body")[0].offsetHeight,
		bodyWidth: document.getElementsByTagName("body")[0].offsetWidth,
		windowHeight: window.outerHeight,
		windowWidth: window.outerWidth,
		dpr: window.devicePixelRatio,
		fontSize: htmlStyle.getPropertyValue("font-size"),
	}

	logger.log("Debug", sizes, status)

	return (
		<Pre>
			{JSON.stringify(sizes, null, 2)}
			{JSON.stringify(status, null, 2)}
		</Pre>
	)
}

const mainCss = css`
	position: relative;

	display: flex;
	flex-direction: column;
	flex-grow: 1;
	align-content: space-between;
	gap: var(--chakra-sizes-1);

	width: 100%;

	overflow: hidden;

	${landscape} {
		flex-direction: row;
	}
`

const Pre = styled.pre`
	overflow-y: auto;

	font-size: 0.5rem;
`

export default Printer
