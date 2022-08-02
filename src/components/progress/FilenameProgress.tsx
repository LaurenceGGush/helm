import { FC } from "react"

import { Tag, TagProps } from "@chakra-ui/react"
import styled from "@emotion/styled"

import usePrintStats from "../../hooks/usePrintStats"
import { colourModeRule } from "../../theme/colourMode"
import SimpleProgress from "./SimpleProgress"

/**
 * Display file name and progress of current print
 */
const FilenameProgress: FC<TagProps> = (props) => {
	const { filename, freindlyname } = usePrintStats()

	if (!filename) {
		return null
	}

	return (
		<FileName className="FilenameProgress" as="div" {...props}>
			{freindlyname}

			<Progress />
		</FileName>
	)
}

const Progress = styled(SimpleProgress)`
	position: absolute;

	height: var(--chakra-sizes-1);
	width: 100%;
	bottom: 0;
	left: 0;

	${colourModeRule(
		"background",
		"--chakra-colors-gray-200",
		"--chakra-colors-lightAlpha-300",
	)}
`

export default FilenameProgress

const FileName = styled(Tag)`
	position: relative;
	display: inline-block;
	min-width: 100%;

	overflow: hidden;
	line-height: 1.6;
	text-overflow: ellipsis;
	white-space: nowrap;
`
