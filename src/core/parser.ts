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

export { cssObjectParser };
