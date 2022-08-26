import { FC, useEffect, useState } from "react"

import {
	BoxProps,
	Icon,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs as ChakraTabs,
} from "@chakra-ui/react"
import styled from "@emotion/styled"
import { FaExclamation, FaInfo, FaListUl } from "react-icons/fa"

import Adjust from "../../components/adjust"
import useAdjustMachine from "../../hooks/useAdjustMachine"
import { useMultiExtruder } from "../../hooks/useHeaters"
import { usePrinterReady } from "../../hooks/usePrinterInfo"
import { usePrintingOrPaused } from "../../hooks/usePrinterStatus"
import Cam from "../../screens/camera"
import Klippy from "../../screens/klippy"
import Move from "../../screens/move"
import Output from "../../screens/output"
import Print from "../../screens/print"
import Tools from "../../screens/tools"
import { landscape, portrait } from "../../theme/medias"
import { logger } from "../../utilities/logger"

const TABS = {
	PRINT: 0,
	MOVE: 1,
	TOOLS: 2,
	LOG: 3,
	KLIPPY: 4,
	ADJUST: 5,
	CAM: 6,
}

export interface TabsProps extends BoxProps {
	/**
	 * Should show camera feed
	 */
	showCam: boolean
	/**
	 * Close camera feed
	 */
	closeCam: () => void
}
/**
 * Main section of the app
 *
 * Displays "print", "move", "tools/extruder", "output" and "klippy/status" tabs
 * Displayed tab is taken over by adjuster and camera feed when they are active
 */
const Tabs: FC<TabsProps> = ({ showCam, closeCam, ...rest }) => {
	const { printerReady } = usePrinterReady()
	const { printingOrPaused } = usePrintingOrPaused()
	const multiExtruder = useMultiExtruder()

	// Initial tab index based on printer status
	const [tabIndex, setTabIndex] = useState(
		printerReady
			? printingOrPaused
				? TABS.PRINT
				: TABS.MOVE
			: TABS.KLIPPY,
	)

	const { adjuster, closeAdjuster: closeAdjust } = useAdjustMachine()

	// Select the appropriate tab when printer status changes
	useEffect(() => {
		if (!printerReady) {
			setTabIndex(TABS.KLIPPY)
			closeAdjust()
			closeCam()
			return
		}

		if (printingOrPaused) {
			setTabIndex(TABS.PRINT)
		}
	}, [closeAdjust, closeCam, printerReady, printingOrPaused])

	// Close adjust and camera feed when selecting a tab
	const handleTabChange = (index: number) => {
		setTabIndex(index)
		closeCam()
		closeAdjust()
	}

	// "Tab" to display, prioritise Adjuster over Camera over "Tabs"
	const prioritisedTabIndex = adjuster
		? TABS.ADJUST
		: showCam
		? TABS.CAM
		: tabIndex

	useEffect(() => logger.info("tabs"))

	return (
		<StyledTabs
			className="Tabs"
			size="sm"
			{...rest}
			index={prioritisedTabIndex}
			onChange={handleTabChange}
		>
			<StyledTabList>
				<StyledTab isDisabled={!printerReady}>
					<TabText>Print</TabText>
				</StyledTab>
				<StyledTab isDisabled={!printerReady}>
					<TabText>Move</TabText>
				</StyledTab>
				<StyledTab isDisabled={!printerReady}>
					<TabText>Tool{multiExtruder && "s"}</TabText>
				</StyledTab>

				<IconTab aria-label="Output">
					<Icon as={FaListUl} />
				</IconTab>

				<IconTab aria-label="Klippy">
					<Icon
						className="Info"
						as={printerReady ? FaInfo : FaExclamation}
					/>
				</IconTab>
			</StyledTabList>

			<StyledTabPanels>
				<StyledTabPanel>
					<Print />
				</StyledTabPanel>

				<StyledTabPanel>
					<Move />
				</StyledTabPanel>

				<StyledTabPanel>
					<Tools />
				</StyledTabPanel>

				<StyledTabPanel>
					<Output isSelected={prioritisedTabIndex === TABS.LOG} />
				</StyledTabPanel>

				<StyledTabPanel>
					<Klippy />
				</StyledTabPanel>

				<StyledTabPanel>
					{adjuster && (
						<Adjust {...adjuster.props} onClose={closeAdjust} />
					)}
				</StyledTabPanel>

				<StyledTabPanel>
					{showCam && <Cam closeCam={closeCam} />}
				</StyledTabPanel>
			</StyledTabPanels>
		</StyledTabs>
	)
}

const StyledTabs = styled(ChakraTabs)`
	display: flex;
	flex-direction: column;

	min-width: 0;

	${landscape} {
		flex-direction: row;
		height: 100%;
		max-height: 100%;
	}
`

const StyledTabList = styled(TabList)`
	display: flex;
	justify-content: space-around;

	font-family: var(--chakra-fonts-heading);

	${landscape} {
		flex-direction: column;

		overflow-y: clip;

		width: 2rem;
		height: 100%;

		border-style: none;
		border-right: 2px solid;
		border-color: inherit;
	}
`

const StyledTabPanels = styled(TabPanels)`
	height: 100%;
	width: 100%;
	min-height: 0;
	margin-top: var(--chakra-space-2);

	${landscape} {
		width: calc(100% - 2rem);
		height: calc(100% + var(--chakra-space-1));
		padding: var(--chakra-space-1) var(--chakra-space-2);
		margin-top: 0;

		overflow: auto;
	}
`

const StyledTab = styled(Tab)`
	min-width: 25%;

	padding-left: var(--chakra-space-2);
	padding-right: var(--chakra-space-2);

	${landscape} {
		height: 2rem;
		min-width: 20vh;

		padding-left: var(--chakra-space-1);
		padding-right: var(--chakra-space-1);

		margin-bottom: 5vh;

		transform-origin: 0 0;
		transform: rotate(-90deg) translateX(-100%);
	}
`

const IconTab = styled(StyledTab)`
	min-width: 15%;

	${landscape} {
		min-width: 15vh;
		margin: 0;

		.chakra-icon {
			transform: rotate(90deg);
		}
	}
`

const TabText = styled.span`
	display: inline-block;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`

const StyledTabPanel = styled(TabPanel)`
	display: flex;
	flex-direction: column;

	height: 100%;
	padding: 0;

	${portrait} {
		&::before,
		&::after {
			content: "";
			height: 4vh;
			flex-shrink: 10000;
		}
		&::after {
			height: 12vh;
		}
	}
`

export default Tabs
