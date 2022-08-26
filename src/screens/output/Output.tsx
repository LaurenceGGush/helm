import {
	Suspense,
	SyntheticEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"

import {
	Box,
	Button,
	ButtonProps,
	CheckboxProps,
	Flex,
	Icon,
	useCheckbox,
} from "@chakra-ui/react"
import styled from "@emotion/styled"
import { TiTick } from "react-icons/ti"

import { useAvailableMacros, useUseableMacros } from "../../hooks/useMacros"
import { useOutput } from "../../hooks/useOutput"
import { useSendGcode } from "../../hooks/useSendGcodes"
import { colourModeRule } from "../../theme/colourMode"
import { logger } from "../../utilities/logger"

/**
 * Klipper gcode output
 */
const Output = ({ isSelected }: { isSelected: boolean }) => {
	const output = useOutput()
	const [scrolled, setScrolled] = useState(false)
	const ignoreNextScroll = useRef(false)
	const ref = useRef<HTMLDivElement>(null)

	const handleScroll = useCallback(() => {
		if (ignoreNextScroll.current) {
			ignoreNextScroll.current = false
			return
		}

		// When user scrolls to bottom unset scrolled
		if (
			ref.current &&
			ref.current?.scrollHeight - ref.current?.scrollTop ===
				ref.current?.clientHeight
		) {
			setScrolled(false)
			return
		}

		if (!scrolled) {
			setScrolled(true)
		}
	}, [scrolled])

	useEffect(() => {
		if (!scrolled) {
			ignoreNextScroll.current = true
			const lastChild = ref.current?.lastElementChild
			lastChild?.scrollIntoView()
		}
		if (!isSelected) {
			setScrolled(false)
		}
	}, [isSelected, scrolled, output])

	useEffect(() => logger.info("Output"))

	return (
		<>
			<Box
				className="Output"
				ref={ref}
				height="100%"
				overflowY="scroll"
				position="relative"
				onScroll={handleScroll}
			>
				{output.map((response, index) => (
					<Response key={index} className={response.type}>
						<ResponseLines>
							{response.message.split("\n").map((line, index) => (
								<ResponseLine key={index}>{line}</ResponseLine>
							))}
						</ResponseLines>
					</Response>
				))}
			</Box>

			<Suspense>
				<Macros />
			</Suspense>
		</>
	)
}

const Response = styled.p`
	position: relative;
	display: flex;

	font-family: "League Mono Condensed", monospace;
	font-size: var(--chakra-fontSizes-3xs);

	&.command::before {
		content: "$";

		width: var(--chakra-space-3);

		${colourModeRule(
			"color",
			"--chakra-colors-gray-700",
			"--chakra-colors-gray-300",
		)}
	}

	&.response {
		${colourModeRule(
			"color",
			"--chakra-colors-gray-500",
			"--chakra-colors-gray-400",
		)}
	}

	&.error {
		color: var(--chakra-colors-red-600);
	}
`

const ResponseLines = styled.span`
	display: block;
`
const ResponseLine = styled.span`
	display: block;
`

const Macros = () => {
	const sendGcode = useSendGcode()
	const availableMacros = useAvailableMacros()
	const [usableMacros, setUsableMacros] = useUseableMacros()

	const macrosRef = useRef(
		Object.fromEntries(
			Object.keys(availableMacros).map((macro) => [
				macro,
				!!usableMacros.includes(macro),
			]),
		),
	)

	const [selectingMacros, setSelectingMacros] = useState(false)

	const handleSelection = () => {
		if (selectingMacros && macrosRef.current) {
			setUsableMacros(
				Object.entries(macrosRef.current)
					.filter(([_, usable]) => usable)
					.map(([macro]) => macro),
			)
		}

		setSelectingMacros(!selectingMacros)
	}

	return (
		<Flex flexWrap="wrap" gap={1} mt={2}>
			{selectingMacros ? (
				<SelectMacros macros={macrosRef.current} />
			) : (
				usableMacros
					.filter((m) => availableMacros[m])
					.map((macro) => (
						<Button
							key={macro}
							size="sm"
							flexGrow={1}
							onClick={() => sendGcode(macro)}
						>
							{macro}
						</Button>
					))
			)}

			<Flex flexGrow={10} justifyContent="right">
				<Button variant="ghost" size="sm" onClick={handleSelection}>
					{selectingMacros ? <Icon as={TiTick} /> : <>&hellip;</>}
				</Button>
			</Flex>
		</Flex>
	)
}

const SelectMacros = ({ macros }: { macros: { [key: string]: boolean } }) => {
	const handleChange = useCallback(
		(macro: string) => (event: SyntheticEvent) => {
			if (event.target instanceof HTMLInputElement) {
				macros[macro] = event.target.checked
			}
		},
		[macros],
	)

	return (
		<>
			{Object.entries(macros).map(([macro, usable]) => (
				<CheckButton
					key={macro}
					macro={macro}
					defaultChecked={usable}
					onChange={handleChange(macro)}
					flexGrow={1}
				/>
			))}
		</>
	)
}

const CheckButton = ({
	macro,
	...rest
}: ButtonProps & CheckboxProps & { macro: string }) => {
	const { state, getInputProps, htmlProps } = useCheckbox(rest)

	return (
		<Button
			as="label"
			size="sm"
			disabled={!state.isChecked}
			cursor="pointer !important"
			{...htmlProps}
			{...rest}
		>
			<input {...getInputProps()} hidden />
			{macro}
		</Button>
	)
}

export default Output
