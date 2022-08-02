const getPageOffsets = (element: HTMLElement | null) => {
	let top = 0
	let left = 0

	while (element) {
		top += element.offsetTop - element.scrollTop
		left += element.offsetLeft - element.scrollLeft

		element = element.offsetParent as HTMLElement | null
	}

	return { top, left }
}

export default getPageOffsets
