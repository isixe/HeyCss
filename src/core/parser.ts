/**
 * CSS Object Parser
 * Converts CSS object to CSS string
 * @param {Object} cssObj - CSS object
 * @returns {string} - CSS string
 */
function cssObjectParser(cssObj: { [s: string]: unknown } | ArrayLike<unknown>): string {
	if (!cssObj || typeof cssObj !== "object") {
		return "";
	}

	let cssString = "";

	for (const [key, value] of Object.entries(cssObj)) {
		if (value === null || value === undefined || value === "") {
			continue;
		}

		const cssProperty = key.replace(/([A-Z])/g, "-$1").toLowerCase();

		cssString += `${cssProperty}: ${value}; `;
	}

	return cssString.trim();
}

/**
 * CSS String to Object (converts CSS string back to CSS object using regex for splitting)
 * @param {string} cssString - CSS string
 * @returns {Object} - CSS object
 */
function cssStringToObject(cssString: string): object {
	if (typeof cssString !== "string" || cssString.trim() === "") {
		return {};
	}

	const propertyPairs = cssString.split(/\s*;\s*/);
	const cssObject: Record<string, any> = {};

	for (const pair of propertyPairs) {
		if (pair.trim() === "") continue;

		const [property, value] = pair.split(/\s*:\s*/);
		if (!property || !value) continue;

		let camelCaseKey = property.replace(/-([a-zA-Z0-9])/g, (_, char) => char.toUpperCase()).trim();
		const trimmedValue = value.trim();

		cssObject[camelCaseKey] = trimmedValue;
	}

	if (cssObject["border"] && typeof cssObject["border"] === "object") {
		const borderObj = cssObject["border"] as Record<string, string>;
		for (const dir of ["top", "right", "bottom", "left"]) {
			if (borderObj[dir]) {
				cssObject["border" + dir.charAt(0).toUpperCase() + dir.slice(1)] = borderObj[dir];
			}
		}
		delete cssObject["border"];
	}

	return cssObject;
}

export { cssObjectParser, cssStringToObject };
