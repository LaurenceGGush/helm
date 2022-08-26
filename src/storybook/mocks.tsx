/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, useEffect, useState } from "react"

import { useAtom, useAtomValue } from "jotai"
import { RESET } from "jotai/utils"
import { useUpdateAtom } from "jotai/utils"

import Mockraker from "../__mocks__/mockraker"
import { MoonrakerResponses } from "../moonraker/methods"
import { idAtom, infoAtom, initialiseStatusAtom, Store } from "../store"
import { PrinterInfo, PrinterStatus } from "../store/types"
import { logger } from "../utilities/logger"

const mockrakers: Record<string, ReturnType<typeof Mockraker>> = {}

interface MockStoreProps {
	id: string
	responses: MoonrakerResponses
	children?: ReactNode
}
export const MockStore: FC<MockStoreProps> = ({ children, responses, id }) => {
	const [mocked, setMocked] = useState(false)

	useEffect(() => {
		if (mocked) {
			return
		}

		if (!mockrakers[id]) {
			mockrakers[id] = Mockraker(responses, id)
		}

		setMocked(true)
	}, [id, mocked, responses])

	if (!mocked) {
		logger.info("Mocking...")
		return <></>
	}

	logger.info("MockStore", id)

	return (
		<InitialiseStatus>
			<Store />
			{children}
		</InitialiseStatus>
	)
}

const InitialiseStatus = ({ children }: { children: ReactNode }) => {
	const [initialised, initialiseStatus] = useAtom(initialiseStatusAtom)

	useEffect(() => {
		if (!initialised) {
			initialiseStatus()
		}
	}, [initialiseStatus, initialised])

	if (!initialised) {
		return <></>
	}

	return <>{children}</>
}

interface UpdateStoreProps {
	info?: PrinterInfo
	status?: PrinterStatus | typeof RESET
	fluidd?: any
	objectList?: (keyof PrinterStatus)[]
	gcodeList?: any
	children?: ReactNode
}
export const UpdateStore: FC<UpdateStoreProps> = ({
	info,
	status,
	fluidd,
	objectList,
	gcodeList,
	children,
}) => {
	const storyId = useAtomValue(idAtom)
	const setInfo = useUpdateAtom(infoAtom)
	const responses = combineResponses(status, fluidd, objectList, gcodeList)

	const [updated, setUpdated] = useState(false)

	useEffect(() => {
		mockrakers[storyId].updateResponses(responses)

		info && setInfo(info)

		setUpdated(true)
	}, [info, setInfo, storyId, responses])

	if (!updated) {
		return <></>
	}

	logger.info("Updated", storyId)

	return <>{children}</>
}

function combineResponses(
	status: PrinterStatus | typeof RESET | undefined,
	fluidd: any | undefined,
	objectList: (keyof PrinterStatus)[] | undefined,
	gcodeList: any | undefined,
): MoonrakerResponses {
	const responses = {
		object_status: typeof status === "object" ? { status } : undefined,
		db_item_get: fluidd ? { fluidd: { value: fluidd } } : undefined,
		object_list: objectList ? { objects: objectList } : undefined,
		file_list: gcodeList,
	}

	return Object.fromEntries(
		Object.entries(responses).filter(([_, v]) => v !== undefined),
	)
}
