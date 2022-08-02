import { memo, useRef } from "react"

import {
	List,
	ListItem,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
} from "@chakra-ui/react"
import styled from "@emotion/styled"
import equal from "fast-deep-equal"

import useGcodes, { GcodeFile } from "../../hooks/useGcodes"
import Spinner from "../spinner"
import Gcode from "./Gcode"
import GcodePop from "./GcodePop"

/**
 * Gcodes list
 *
 * Allows selecting a gcode file to print
 */
const Gcodes = () => {
	const gcodes = useGcodes()

	if (!gcodes) {
		return <Spinner />
	}

	if (gcodes?.length) {
		return (
			<GcodeList className="GcodeList">
				{gcodes.map((gcode) => (
					<GcodeItem key={gcode.path + gcode.size} gcode={gcode} />
				))}
			</GcodeList>
		)
	}

	return <NoGcodes>No files found</NoGcodes>
}

/**
 * Gcode item
 *
 * Shows gcode popup when clicked
 */
const GcodeItem = memo(({ gcode }: { gcode: GcodeFile }) => {
	const ref = useRef<HTMLLIElement>(null)
	const popRef = useRef<HTMLDivElement>(null)
	const focusRef = useRef<HTMLButtonElement>(null)

	// Scroll list to hopefully fit popup in view
	const handleOpen = () => {
		ref.current?.scrollIntoView({
			block: "nearest",
			behavior: "smooth",
		})

		// delay scrolling until popover loaded
		setTimeout(
			() =>
				popRef.current?.scrollIntoView({
					block: "nearest",
					behavior: "smooth",
				}),

			100,
		)
	}

	return (
		<GcodeListItem className="GcodeItem" ref={ref}>
			<Popover
				arrowSize={20}
				initialFocusRef={focusRef}
				placement="bottom"
				isLazy
				onOpen={handleOpen}
			>
				<PopoverTrigger>
					<Gcode gcode={gcode} />
				</PopoverTrigger>

				<PopoverContent ref={popRef} width="100%">
					<PopoverArrow />

					<PopoverBody padding={2}>
						<GcodePop gcode={gcode} ref={focusRef} />
					</PopoverBody>
				</PopoverContent>
			</Popover>
		</GcodeListItem>
	)
}, equal)
GcodeItem.displayName = "GcodeItem"

const GcodeListItem = styled(ListItem)`
	position: relative;

	/* eeuugh */
	.chakra-popover__popper {
		min-width: 100% !important;
	}
`

const GcodeList = styled(List)`
	height: 100%;

	border-radius: var(--chakra-sizes-1);
`

const NoGcodes = styled.p`
	text-align: center;
	margin-top: var(--chakra-space-1);
`

export default Gcodes
