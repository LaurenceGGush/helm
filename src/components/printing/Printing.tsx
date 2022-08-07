import { FC } from "react"

import {
	Box,
	BoxProps,
	Flex,
	Grid,
	IconButton,
	Tag,
	TagLabel,
	TagLeftIcon,
	Text,
} from "@chakra-ui/react"
import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { CgArrowLongUpL, CgTime } from "react-icons/cg"
import { IoMdReorder } from "react-icons/io"
import { IoPause, IoPlay, IoStop } from "react-icons/io5"

import usePrinter from "../../hooks/usePrinter"
import { usePrintingOrPaused } from "../../hooks/usePrinterStatus"
import usePrintStats from "../../hooks/usePrintStats"
import GcodeImage from "../gcodes/GcodeImage"
import { FilenameProgress } from "../progress"
import Spinner from "../spinner"

const Printing: FC<BoxProps> = (props) => {
	const printer = usePrinter()
	const { paused, printingOrPaused } = usePrintingOrPaused()

	const {
		filename,
		thumb,
		layers,
		layer,
		object_height,
		print_height,
		progress,
		elapsed,
		remaining,
	} = usePrintStats()

	if (!filename || !object_height) {
		return (
			<Spinner
				thickness="0.125em"
				color="gray.700"
				emptyColor="gray.300"
				speed="2.5s"
			/>
		)
	}

	return (
		<Box className="Printing" {...props}>
			{printingOrPaused ? (
				<>
					<Text
						display="inline-block"
						fontSize="3xl"
						lineHeight="1.3"
					>
						{(progress * 100).toFixed(1)}%
					</Text>

					<PlayPause>
						<IconButton
							aria-label="button"
							icon={<IoPlay />}
							onClick={() => printer.resume()}
							disabled={!paused}
						/>
						<IconButton
							aria-label="button"
							icon={<IoPause />}
							onClick={() => printer.pause()}
							disabled={paused}
						/>
						<IconButton
							aria-label="button"
							icon={<IoStop />}
							onClick={() => printer.cancel()}
							disabled={!paused}
						/>
					</PlayPause>
				</>
			) : (
				<Flex justifyContent="space-between">
					<IconButton
						aria-label="button"
						icon={<IoPlay />}
						onClick={() => printer.start(filename)}
						disabled={printingOrPaused}
					/>

					<IconButton
						aria-label="button"
						icon={<IoStop />}
						onClick={printer.unLoadGcode}
						disabled={printingOrPaused}
					/>
				</Flex>
			)}

			<PrintStats mt={1}>
				<FilenameProgress css={filenameCss} />

				<StatTag>
					<StatTagLeftIcon as={IoMdReorder} />
					<TagLabel whiteSpace="normal">{`${layer} / ${layers}`}</TagLabel>
				</StatTag>
				<StatTag>
					<StatTagLeftIcon as={CgArrowLongUpL} />
					<TagLabel whiteSpace="normal">
						{`${print_height.toFixed(2)}`}
						{" / "}
						{`${object_height.toFixed(2)}`}
					</TagLabel>
				</StatTag>

				<TimeTag time={elapsed} />
				<TimeTag time={remaining} />

				<PrintImage path={thumb?.relative_path} />
			</PrintStats>
		</Box>
	)
}

const PlayPause = styled.div`
	float: right;

	button {
		margin-left: var(--chakra-sizes-1);
	}
`

const PrintStats = styled(Grid)`
	grid-gap: var(--chakra-space-1);
	grid-template-columns: minmax(auto, 50%);
`

const filenameCss = css`
	display: inline-block;

	/* span the grid width */
	grid-column: 1/3;
	width: 100%;
	margin-top: var(--chakra-sizes-2);
`

const StatTag = styled(Tag)`
	grid-column: 1;
	padding-right: var(--chakra-sizes-2);
	padding-left: var(--chakra-sizes-2);

	white-space: nowrap;
`
const StatTagLeftIcon = styled(TagLeftIcon)`
	margin-right: var(--chakra-sizes-1);
`

const TimeTag: FC<{ time: Date }> = ({ time, ...rest }) => (
	<StatTag {...rest}>
		<StatTagLeftIcon as={CgTime} />
		<TagLabel>
			{`${time.getUTCHours().toString().padStart(1, "0")}h ${time
				.getUTCMinutes()
				.toString()
				.padStart(1, "0")}m`}
		</TagLabel>
	</StatTag>
)

const PrintImage = styled(GcodeImage)`
	grid-column: 2;
	/* span the grid height under the filename */
	grid-row: 2/6;
	align-self: end;
	width: 100%;
	height: auto;
	margin: 0;
	justify-self: end;
`

export default Printing
