/**
 * CSS Object Parser
 * Converts CSS object to CSS string
 * @param {Object} cssObj - CSS object
 * @returns {string} - CSS string
 */
function cssObjectParser(cssObj: Record<string, any>): string {
	if (!cssObj || typeof cssObj !== "object") return "";

	const generateProperty = (key: string, value: any) => {
		if (value === null || value === undefined || value === "") return "";
		const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
		return `  ${cssKey}: ${value};`;
	};

	const parseObject = (obj: Record<string, any>): string => {
		let css = "";
		for (const [key, value] of Object.entries(obj)) {
			if (key.startsWith("&")) {
				const objKey = Object.keys(value)[0];
				const objValue = value[objKey];
				console.log(objValue);
				let nestedCss = `\n   &${objKey} {\n`;

				const nestedEntries = Object.entries(objValue);
				nestedEntries.forEach(([nestedKey, nestedValue], index) => {
					nestedCss += `    ` + generateProperty(nestedKey, nestedValue);

					if (index < nestedEntries.length - 1) {
						nestedCss += "\n";
					}
				});

				nestedCss += "\n   }";

				css += nestedCss;
			} else {
				const property = generateProperty(key, value) + "\n";
				if (property) css += property + " ";
			}
		}
		return css.trim();
	};

	return `{\n   ${parseObject(cssObj)}\n}`;
}

export { cssObjectParser };
