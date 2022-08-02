import { forwardRef, memo, useEffect, useState } from "react"

import { Box, Flex, FlexProps } from "@chakra-ui/react"
import styled from "@emotion/styled"
import sAgo from "s-ago"

import useFileMeta from "../../hooks/useFileMeta"
import { GcodeFile } from "../../hooks/useGcodes"
import GcodeImage from "./GcodeImage"

export interface GcodeProps extends FlexProps {
	gcode: GcodeFile
}
const Gcode = forwardRef<HTMLDivElement, GcodeProps>(
	({ gcode, ...rest }, ref) => {
		const { thumbnails } = useFileMeta(gcode?.path)
		const thumb = thumbnails && thumbnails[0]
		const [when, setWhen] = useState(sAgo(gcode.modified))

		useEffect(() => {
			const interval = setInterval(() => {
				setWhen(sAgo(gcode.modified))
			}, 60000)

			return () => clearInterval(interval)
		}, [when, setWhen, gcode.modified])

		// logger.info({ thumb })

		return (
			<Flex
				className="Gcode"
				ref={ref}
				as="button"
				width="100%"
				mb={1}
				overflow="hidden"
				{...rest}
			>
				<GcodeImage path={thumb?.relative_path} />

				<Box minWidth="0" ml={1} flexGrow={1}>
					<GcodeName>{gcode.name}</GcodeName>

					<GcodeDetails>
						<span>{when}</span>
						<span>{(gcode.size / 1024 / 1024).toFixed(1)}Mb</span>
					</GcodeDetails>
				</Box>
			</Flex>
		)
	},
)
Gcode.displayName = "Gcode"

const GcodeName = styled.p`
	overflow: hidden;

	line-height: 1;
	text-align: left;
	text-overflow: ellipsis;
	white-space: nowrap;
`

const GcodeDetails = styled.p`
	display: flex;
	justify-content: space-between;

	color: var(--chakra-colors-gray-500);
	font-size: var(--chakra-fontSizes-xs);
`

export default memo(Gcode)
