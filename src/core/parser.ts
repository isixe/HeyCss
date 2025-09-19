/**
 * CSS Object Parser
 * Converts CSS object to CSS string
 * @param {Object} cssObj - CSS object
 * @returns {string} - CSS string
 */
function cssObjectParser(cssObj: Record<string, any>): string {
	console.log(cssObj);
	if (!cssObj || typeof cssObj !== "object") return "";

	const generateProperty = (key: string, value: any) => {
		if (value === null || value === undefined || value === "") return "";
		const cssKey = key
			.replace(/([A-Z])/g, "-$1")
			.toLowerCase()
			.replace(/(webkit)-(.+)/, "-$1-$2");
		return `  ${cssKey}: ${value};\n`;
	};

	const parseObject = (obj: Record<string, any>, selector?: string): string => {
		let css = "";
		for (const [key, value] of Object.entries(obj)) {
			if (key.startsWith("&")) {
				const nestedSelector = `${selector || ""}${key.slice(1)}`;
				let nestedCss = "\n";
				for (const [nestedKey, nestedValue] of Object.entries(value)) {
					nestedCss += generateProperty(nestedKey, nestedValue) + " ";
				}
				nestedCss += "\n";
				css += nestedSelector + nestedCss;
			} else {
				const property = generateProperty(key, value);
				if (property) css += property + " ";
			}
		}
		return css.trim();
	};

	return `{\n   ${parseObject(cssObj)}\n}`;
}

export { cssObjectParser };
