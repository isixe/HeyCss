/**
 * Generate bilingual metadata (name / tags / description) for all CSS presets.
 *
 * Usage: node scripts/generate-metadata.mjs
 *
 * Strategy:
 *  - boxShadow.json  : rule-based, parses the box-shadow value
 *  - border.json     : rule-based + hand-mapped special cases
 *  - text.json       : hand-mapped (12 items)
 *  - shape.json      : hand-mapped by id (134 items)
 *
 * Output format: { id, name: {en, zh}, tags: {en: [...], zh: [...]}, description: {en, zh}, ...css }
 * Output keeps the original file indentation (shape = 4 spaces, others = tabs).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "public", "data");

const readJson = (file) =>
	JSON.parse(readFileSync(join(dataDir, file), "utf8"));

const writeJson = (file, data, indent) =>
	writeFileSync(join(dataDir, file), JSON.stringify(data, null, indent) + "\n", "utf8");

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const isCJK = (s) => /[\u4e00-\u9fff]/.test(s);

// Split a mixed (en+zh) tag array into { en, zh }
function splitTags(tags) {
	const en = [];
	const zh = [];
	for (const t of tags) {
		if (isCJK(t)) zh.push(t);
		else en.push(t);
	}
	return { en, zh };
}

// Direction words shared by name/description translation
const DIR_ZH = {
	"Top-Left": "左上",
	"Top-Right": "右上",
	"Bottom-Left": "左下",
	"Bottom-Right": "右下",
	"Top & Bottom": "上下",
	"Top & Left": "上左",
	"Bottom": "底部",
	"Top": "顶部",
	"Left": "左侧",
	"Right": "右侧",
	"Up": "向上",
	"Down": "向下",
	"All": "四角",
	"Both": "双向",
	"Double": "双向",
	"Small": "小",
	"Reverse": "反向",
	"Left Half": "左半",
	"All Sides": "四周",
};

// name-level translation rules: [regex, zh template, capture index for dir]
const NAME_RULES = [
	[/^Bubble Arrow \((.+)\)$/, "气泡箭头（$1）", 1],
	[/^Check Badge \((.+)\)$/, "对勾徽章（$1）", 1],
	[/^Corner Badge \((.+)\)$/, "三角角标（$1）", 1],
	[/^HOT Ribbon Badge$/, "HOT 丝带徽章"],
	[/^Status Dot Badge$/, "状态圆点徽章"],
	[/^Count Badge 99$/, "数字徽章 99"],
	[/^Waiting Label Badge$/, "等待标签徽章"],
	[/^NEW Badge$/, "NEW 徽章"],
	[/^Diamond Cut Shape$/, "菱形切角形状"],
	[/^Slanted Trapezoid \((.+)\)$/, "斜边梯形（$1）", 1],
	[/^Slanted Trapezoid Variant (\d+)$/, "斜边梯形变体 $1"],
	[/^Diagonal Cut Shape (\d+)$/, "对角切角形状 $1"],
	[/^Clover Leaf$/, "三叶草"],
	[/^Four-Leaf Clover$/, "四叶草"],
	[/^Five-Petal Flower$/, "五瓣花"],
	[/^Star Flower Ring$/, "星花圆环"],
	[/^Squircle$/, "圆角方形"],
	[/^Rounded Square$/, "圆角方形"],
	[/^Notched Rectangle \((.+)\)$/, "缺角矩形（$1）", 1],
	[/^Notched Rectangle Variant (\d+)$/, "缺角矩形变体 $1"],
	[/^Semicircle \((.+)\)$/, "半圆（$1）", 1],
	[/^Semicircle Variant (\d+)$/, "半圆变体 $1"],
	[/^Half Ellipse \((.+)\)$/, "半椭圆（$1）", 1],
	[/^Flat Ellipse$/, "扁平椭圆"],
	[/^Narrow Ellipse$/, "细长椭圆"],
	[/^Rounded Ticket$/, "圆角票据"],
	[/^Rounded Ticket Variant (\d+)$/, "圆角票据变体 $1"],
	[/^Arrow Pill \((.+)\)$/, "箭头胶囊（$1）", 1],
	[/^Arrow Pill Variant (\d+)$/, "箭头胶囊变体 $1"],
	[/^Ring \(Donut\)$/, "圆环（甜甜圈）"],
	[/^Square Ring$/, "方形圆环"],
	[/^Arrow Button \((.+)\)$/, "箭头按钮（$1）", 1],
	[/^Arrow Button Double$/, "双向箭头按钮"],
	[/^Arch \((.+)\)$/, "拱形（$1）", 1],
	[/^Dotted Border Square$/, "点状边框方块"],
	[/^Dotted Border Square Variant$/, "点状边框方块变体"],
	[/^Gear Shape \((.+)\)$/, "齿轮形状（$1）", 1],
	[/^Rounded Rect Notch \((.+)\)$/, "圆角缺口矩形（$1）", 1],
	[/^Dotted Border Rounded Square$/, "点状圆角方块"],
	[/^Octagon$/, "八角形"],
	[/^Octagon \(Small\)$/, "八角形（小）"],
	[/^Chamfered Rectangle \((.+)\)$/, "切角矩形（$1）", 1],
	[/^Chamfered Rectangle \((.+)\) 2$/, "切角矩形（$1）2", 1],
	[/^Triangle \((.+)\)$/, "三角形（$1）", 1],
	[/^Rounded Triangle \((.+)\)$/, "圆角三角形（$1）", 1],
	[/^Right Triangle \((.+)\)$/, "直角三角形（$1）", 1],
	[/^Rounded Right Triangle \((.+)\)$/, "圆角直角三角形（$1）", 1],
	[/^Rounded Corner Triangle \((.+)\)$/, "圆角直角三角（$1）", 1],
	[/^Narrow Triangle \((.+)\)$/, "细长三角（$1）", 1],
	[/^Rounded Narrow Triangle \((.+)\)$/, "圆角细长三角（$1）", 1],
	[/^Rounded Narrow Triangle Beige \((.+)\)$/, "圆角细长三角米色（$1）", 1],
	[/^Zigzag Edge Rectangle \((.+)\)$/, "锯齿边矩形（$1）", 1],
	[/^Notch Cut Rectangle \((.+)\)$/, "缺口矩形（$1）", 1],
	// border
	[/^Solid Gray Border$/, "灰色实线边框"],
	[/^Dashed Indigo Border$/, "靛蓝虚线边框"],
	[/^Dotted Amber Border$/, "琥珀点线边框"],
	[/^Double Violet Border$/, "紫罗兰双线边框"],
	[/^Ridge Emerald Border$/, "翡翠绿脊状边框"],
	[/^Multi-Color Sides Border$/, "多彩四边边框"],
	[/^Gradient Border Image$/, "渐变边框图像"],
	[/^Rose-Blue Gradient Border$/, "红蓝渐变边框"],
	[/^Emerald-Amber Gradient Border$/, "翠绿琥珀渐变边框"],
	[/^Four-Color Gradient Border$/, "四色渐变边框"],
	[/^Blue-Amber Vertical Gradient Border$/, "蓝黄垂直渐变边框"],
	[/^Peach Fade Gradient Border$/, "桃色渐隐边框"],
	[/^Mint Green Gradient Border$/, "薄荷绿渐变边框"],
	[/^Amber Center Glow Border$/, "琥珀中心发光边框"],
	[/^Green Diagonal Glow Border$/, "绿色对角发光边框"],
	[/^Rose Diagonal Glow Border$/, "玫红对角发光边框"],
	[/^Rose Vertical Glow Border$/, "玫红垂直发光边框"],
	[/^Green Corner Accents \(TL-BR\)$/, "绿色角标（左上-右下）"],
	[/^Green Corner Accents \(TR-BL\)$/, "绿色角标（右上-左下）"],
	[/^Green Corner Accents \(All\)$/, "绿色角标（四角）"],
	[/^Green Corner Accents Inset \(TL-BR\)$/, "内嵌绿色角标（左上-右下）"],
	[/^Green Corner Accents Inset \(TR-BL\)$/, "内嵌绿色角标（右上-左下）"],
	[/^Green Corner Accents Inset \(All\)$/, "内嵌绿色角标（四角）"],
	[/^Red-Orange Gradient Ring$/, "红橙渐变圆环"],
	// text
	[/^Peach-Pink Gradient Text$/, "桃粉渐变文字"],
	[/^Cyan-Magenta Gradient Text$/, "青品红渐变文字"],
	[/^Sunset Red Gradient Text$/, "落日红渐变文字"],
	[/^Purple-Orange Gradient Text$/, "紫橙渐变文字"],
	[/^Mint-Cyan Gradient Text$/, "薄荷青渐变文字"],
	[/^Lavender-Pink Gradient Text$/, "薰衣草粉渐变文字"],
	[/^Peach-Gold Gradient Text$/, "桃金渐变文字"],
	[/^Sky Blue-Indigo Gradient Text$/, "天蓝靛渐变文字"],
	[/^Blue-Purple Gradient Text$/, "蓝紫渐变文字"],
	[/^Neon Outline Text \(Blue\)$/, "霓虹描边文字（蓝）"],
	[/^Neon Outline Text$/, "霓虹描边文字"],
	[/^Golden Text with Red Glow$/, "金色文字红色光晕"],
];

function translateDir(dir) {
	if (!dir) return "";
	return (DIR_ZH[dir] || dir).replace(/[-&]/g, " ");
}

function zhName(enName) {
	for (const [re, tpl, dirIdx] of NAME_RULES) {
		const m = enName.match(re);
		if (m) {
			if (dirIdx !== undefined) {
				return tpl.replace("$1", translateDir(m[dirIdx]));
			}
			return tpl;
		}
	}
	// fallback: keep English
	return enName;
}

// generic zh description template based on zh name + technical keywords
function zhDescription(enName, zh, enDesc) {
	const tech = enDesc.includes("via mask")
		? "使用 mask 遮罩实现"
		: enDesc.includes("clip-path")
			? "使用 clip-path 裁剪实现"
			: enDesc.includes("border-image")
				? "通过 border-image 实现"
				: "通过 CSS 实现";
	return `${zh}，${tech}。`;
}

/* ------------------------------------------------------------------ */
/* boxShadow: rule-based                                               */
/* ------------------------------------------------------------------ */

const GRAY_RGB = new Set([
	"17, 17, 26", "50, 50, 93", "100, 100, 111", "149, 157, 165",
	"14, 63, 126", "42, 51, 70", "42, 51, 69", "9, 30, 66", "6, 24, 44",
	"38, 57, 77", "99, 99, 99", "60, 64, 67", "67, 71, 85", "90, 125, 188",
	"209, 213, 219", "204, 219, 232", "0, 0, 0", "0", "0, 0",
]);

const COLOR_NAME_ZH = {
	blue: "蓝色",
	green: "绿色",
	red: "红色",
	colored: "彩色",
};

function parseShadowLayers(v) {
	// split on commas that are OUTSIDE parentheses (rgba(...) contains commas)
	const layers = [];
	let depth = 0;
	let cur = "";
	for (const ch of v) {
		if (ch === "(") depth++;
		if (ch === ")") depth--;
		if (ch === "," && depth === 0) {
			layers.push(cur);
			cur = "";
		} else {
			cur += ch;
		}
	}
	layers.push(cur);
	return layers.map((s) => s.trim()).filter(Boolean);
}

// blur radius = the 3rd numeric token (offsetX offsetY blur [spread])
function layerBlur(l) {
	const tokens = l.split(/\s+/).filter((t) => t !== "inset" && !/^rgba?\(/.test(t));
	return tokens[2] !== undefined ? parseFloat(tokens[2]) : 0;
}

function boxShadowMeta(item) {
	const v = item["box-shadow"] || "";
	const layers = parseShadowLayers(v);
	const isInset = layers.some((l) => /^inset/.test(l));
	const isMulti = layers.length > 1;

	let maxBlur = 0;
	for (const l of layers) {
		const blur = layerBlur(l);
		if (blur > maxBlur) maxBlur = blur;
	}

	const hasRing = layers.some((l) => /0 0 0 [1-9]/.test(l));

	// detect a non-gray color
	let colorName = "";
	const rgbMatches = v.match(/rgba?\(([^)]+)\)/g) || [];
	for (const m of rgbMatches) {
		const inner = m.replace(/^rgba?\(|\)$/g, "");
		const parts = inner.split(",").map((p) => p.trim());
		const [r, g, b] = parts.map((p) => parseFloat(p));
		if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) continue;
		if (r === g && g === b) continue;
		const key = parts.slice(0, 3).join(", ");
		if (GRAY_RGB.has(key)) continue;
		if (b > r + 40 && b > g + 40) colorName = "blue";
		else if (g > r + 30 && g > b + 30) colorName = "green";
		else if (r > g + 30 && r > b + 30) colorName = "red";
		else colorName = "colored";
		break;
	}

	const soft = maxBlur >= 16;
	const crisp = maxBlur <= 2;
	const glow = maxBlur >= 24 && colorName;

	// --- EN name ---
	const parts = [];
	if (isInset) parts.push("Inset");
	if (hasRing) parts.push("Ring");
	if (glow) parts.push(`${colorName.charAt(0).toUpperCase() + colorName.slice(1)} Glow`);
	else if (soft) parts.push("Soft");
	else if (crisp) parts.push("Crisp");
	if (isMulti) parts.push("Layered");
	parts.push("Shadow");
	const nameEn = parts.join(" ");

	// --- ZH name ---
	const zParts = [];
	if (isInset) zParts.push("内嵌");
	if (hasRing) zParts.push("圆环");
	if (glow) zParts.push(`${COLOR_NAME_ZH[colorName]}光晕`);
	else if (soft) zParts.push("柔和");
	else if (crisp) zParts.push("清晰");
	if (isMulti) zParts.push("多层");
	zParts.push("阴影");
	const nameZh = zParts.join("");

	// --- tags ---
	const tagsEn = ["box-shadow", "shadow"];
	const tagsZh = ["阴影", "阴影效果"];
	if (isInset) { tagsEn.push("inset", "inner"); tagsZh.push("内阴影"); }
	else { tagsEn.push("outer"); tagsZh.push("外阴影"); }
	if (soft) { tagsEn.push("soft", "blurred", "blur"); tagsZh.push("柔和"); }
	if (crisp) { tagsEn.push("crisp", "sharp"); tagsZh.push("锐利"); }
	if (hasRing) { tagsEn.push("ring", "outline", "border-shadow"); tagsZh.push("描边", "圆环"); }
	if (isMulti) { tagsEn.push("layered", "multi-layer", "stacked"); tagsZh.push("多层"); }
	if (colorName) { tagsEn.push("colored", colorName); tagsZh.push("彩色", COLOR_NAME_ZH[colorName]); }

	// --- description ---
	const depth = isInset ? "inner depth" : "outer depth";
	const ringTxt = hasRing ? " with a ring outline" : "";
	const softTxt = glow ? ` with a ${colorName} glow` : soft ? " with a soft, diffuse blur" : crisp ? " with a crisp, tight blur" : "";
	const layerTxt = isMulti ? ` across ${layers.length} layers` : "";
	const descEn = `A ${isInset ? "inset" : "drop"} box shadow${ringTxt}${softTxt} for ${depth}${layerTxt}.`;

	const depthZh = isInset ? "内嵌" : "外投影";
	const ringZh = hasRing ? "，带圆环描边" : "";
	const softZh = glow
		? `，带${COLOR_NAME_ZH[colorName]}光晕`
		: soft
			? "，柔和扩散模糊"
			: crisp
				? "，清晰锐利模糊"
				: "";
	const layerZh = isMulti ? `，共 ${layers.length} 层` : "";
	const descZh = `一个${isInset ? "内嵌" : "外投影"}盒阴影${ringZh}${softZh}，用于${depthZh}效果${layerZh}。`;

	return {
		name: { en: nameEn, zh: nameZh },
		tags: { en: tagsEn, zh: tagsZh },
		description: { en: descEn, zh: descZh },
	};
}

/* ------------------------------------------------------------------ */
/* border / text / shape: hand-mapped (EN only, ZH auto-generated)     */
/* ------------------------------------------------------------------ */

const BORDER_META = [
	{ name: "Solid Gray Border", tags: ["border", "solid", "实线", "灰色边框", "gray", "basic"], d: "A simple 2px solid light-gray border with 10px rounded corners." },
	{ name: "Dashed Indigo Border", tags: ["border", "dashed", "虚线", "indigo", "靛蓝"], d: "A 2px dashed indigo border with 10px rounded corners." },
	{ name: "Dotted Amber Border", tags: ["border", "dotted", "点线", "amber", "琥珀"], d: "A 3px dotted amber border with 10px rounded corners." },
	{ name: "Double Violet Border", tags: ["border", "double", "双线", "violet", "紫罗兰"], d: "A 4px double violet border with 10px rounded corners." },
	{ name: "Ridge Emerald Border", tags: ["border", "ridge", "脊状", "emerald", "翡翠绿"], d: "A 3px ridge emerald border with 10px rounded corners." },
	{ name: "Multi-Color Sides Border", tags: ["border", "multi-color", "多彩", "rainbow", "彩虹边框"], d: "Each side has its own color: red top, amber right, emerald bottom, blue left." },
	{ name: "Gradient Border Image", tags: ["border", "gradient", "渐变", "border-image"], d: "A 2px gradient border (rose to blue) via border-image." },
	{ name: "Rose-Blue Gradient Border", tags: ["border", "gradient", "渐变描边", "rose", "blue", "红蓝"], d: "A 2px rose-to-blue gradient border built with a masked pseudo-element." },
	{ name: "Emerald-Amber Gradient Border", tags: ["border", "gradient", "渐变描边", "emerald", "amber", "绿黄"], d: "A 2px emerald-to-amber gradient border built with a masked pseudo-element." },
	{ name: "Four-Color Gradient Border", tags: ["border", "gradient", "渐变描边", "rainbow", "多彩"], d: "A 2px rose-blue-emerald-amber gradient border built with a masked pseudo-element." },
	{ name: "Blue-Amber Vertical Gradient Border", tags: ["border", "gradient", "渐变描边", "blue", "amber", "蓝黄"], d: "A vertical blue-to-amber gradient border built with a masked pseudo-element." },
	{ name: "Peach Fade Gradient Border", tags: ["border", "gradient", "渐变描边", "peach", "桃色"], d: "A soft peach gradient border that fades to transparent." },
	{ name: "Mint Green Gradient Border", tags: ["border", "gradient", "渐变描边", "mint", "薄荷"], d: "A mint-to-lime gradient border built with a masked pseudo-element." },
	{ name: "Amber Center Glow Border", tags: ["border", "gradient", "渐变描边", "amber", "琥珀", "glow"], d: "An amber glow border that fades out on both sides." },
	{ name: "Green Diagonal Glow Border", tags: ["border", "gradient", "渐变描边", "green", "绿色", "glow"], d: "A green diagonal glow border that fades to transparent." },
	{ name: "Rose Diagonal Glow Border", tags: ["border", "gradient", "渐变描边", "rose", "红色", "glow"], d: "A rose diagonal glow border that fades to transparent." },
	{ name: "Rose Vertical Glow Border", tags: ["border", "gradient", "渐变描边", "rose", "红色", "glow"], d: "A rose vertical glow border that fades to transparent." },
	{ name: "Green Corner Accents (TL-BR)", tags: ["border", "corner", "角标", "green", "绿色", "accent"], d: "Green corner accents on the top-left and bottom-right corners." },
	{ name: "Green Corner Accents (TR-BL)", tags: ["border", "corner", "角标", "green", "绿色", "accent"], d: "Green corner accents on the top-right and bottom-left corners." },
	{ name: "Green Corner Accents (All)", tags: ["border", "corner", "角标", "green", "绿色", "accent"], d: "Green corner accents on all four corners." },
	{ name: "Green Corner Accents Inset (TL-BR)", tags: ["border", "corner", "角标", "green", "绿色", "inset", "accent"], d: "Inset green corner accents on the top-left and bottom-right corners." },
	{ name: "Green Corner Accents Inset (TR-BL)", tags: ["border", "corner", "角标", "green", "绿色", "inset", "accent"], d: "Inset green corner accents on the top-right and bottom-left corners." },
	{ name: "Green Corner Accents Inset (All)", tags: ["border", "corner", "角标", "green", "绿色", "inset", "accent"], d: "Inset green corner accents on all four corners." },
	{ name: "Red-Orange Gradient Ring", tags: ["border", "ring", "圆环", "gradient", "渐变", "red", "红色", "orange"], d: "A red-to-orange gradient ring shape drawn with a masked pseudo-element." },
];

const TEXT_META = [
	{ name: "Peach-Pink Gradient Text", tags: ["text", "gradient", "渐变文字", "peach", "pink", "桃粉"], d: "Gradient text from peach to pink to orange (45deg)." },
	{ name: "Cyan-Magenta Gradient Text", tags: ["text", "gradient", "渐变文字", "cyan", "magenta", "青紫"], d: "Gradient text from cyan to magenta (120deg)." },
	{ name: "Sunset Red Gradient Text", tags: ["text", "gradient", "渐变文字", "yellow", "red", "黄红"], d: "Gradient text from golden yellow to red (210deg)." },
	{ name: "Purple-Orange Gradient Text", tags: ["text", "gradient", "渐变文字", "purple", "orange", "紫橙"], d: "Gradient text from purple through red to orange (315deg)." },
	{ name: "Mint-Cyan Gradient Text", tags: ["text", "gradient", "渐变文字", "mint", "cyan", "青绿"], d: "Gradient text from mint green to cyan (75deg)." },
	{ name: "Lavender-Pink Gradient Text", tags: ["text", "gradient", "渐变文字", "lavender", "pink", "薰衣草粉"], d: "Gradient text from lavender to pink (160deg)." },
	{ name: "Peach-Gold Gradient Text", tags: ["text", "gradient", "渐变文字", "peach", "gold", "桃金"], d: "Gradient text from peach to gold (280deg)." },
	{ name: "Sky Blue-Indigo Gradient Text", tags: ["text", "gradient", "渐变文字", "blue", "indigo", "蓝靛"], d: "Gradient text from sky blue to indigo (20deg)." },
	{ name: "Blue-Purple Gradient Text", tags: ["text", "gradient", "渐变文字", "blue", "purple", "蓝紫"], d: "Gradient text from cyan blue to deep purple (190deg)." },
	{ name: "Neon Outline Text", tags: ["text", "text-shadow", "文字阴影", "neon", "霓虹", "outline", "white"], d: "White text with a layered neon pink/orange outline and soft glow." },
	{ name: "Neon Outline Text (Blue)", tags: ["text", "text-shadow", "文字阴影", "neon", "霓虹", "outline", "blue"], d: "Light-blue text with a layered neon pink/orange outline and soft glow." },
	{ name: "Golden Text with Red Glow", tags: ["text", "gradient", "渐变文字", "gold", "金色", "glow", "drop-shadow"], d: "Golden gradient text with a red drop-shadow glow." },
];

const SHAPE_META = [
	// 0-7 bubble arrows
	{ name: "Bubble Arrow (Bottom)", tags: ["shape", "bubble", "气泡", "tooltip", "提示框", "speech", "arrow", "箭头", "white", "bottom"], d: "White rounded bubble with a centered arrow pointing down." },
	{ name: "Bubble Arrow (Top)", tags: ["shape", "bubble", "气泡", "tooltip", "提示框", "speech", "arrow", "箭头", "white", "top"], d: "White rounded bubble with a centered arrow pointing up." },
	{ name: "Bubble Arrow (Left)", tags: ["shape", "bubble", "气泡", "tooltip", "提示框", "speech", "arrow", "箭头", "white", "left"], d: "White rounded bubble with a centered arrow pointing left." },
	{ name: "Bubble Arrow (Right)", tags: ["shape", "bubble", "气泡", "tooltip", "提示框", "speech", "arrow", "箭头", "white", "right"], d: "White rounded bubble with a centered arrow pointing right." },
	{ name: "Bubble Arrow (Top-Left)", tags: ["shape", "bubble", "气泡", "tooltip", "提示框", "speech", "arrow", "箭头", "white", "top", "left"], d: "White rounded bubble with an arrow at the top-left." },
	{ name: "Bubble Arrow (Top-Right)", tags: ["shape", "bubble", "气泡", "tooltip", "提示框", "speech", "arrow", "箭头", "white", "top", "right"], d: "White rounded bubble with an arrow at the top-right." },
	{ name: "Bubble Arrow (Bottom-Left)", tags: ["shape", "bubble", "气泡", "tooltip", "提示框", "speech", "arrow", "箭头", "white", "bottom", "left"], d: "White rounded bubble with an arrow at the bottom-left." },
	{ name: "Bubble Arrow (Bottom-Right)", tags: ["shape", "bubble", "气泡", "tooltip", "提示框", "speech", "arrow", "箭头", "white", "bottom", "right"], d: "White rounded bubble with an arrow at the bottom-right." },
	// 8-16 badges
	{ name: "Check Badge (Top-Right)", tags: ["shape", "badge", "徽章", "角标", "check", "对勾", "orange", "橙色"], d: "Orange corner badge with a white check mark at the top-right." },
	{ name: "Check Badge (Bottom-Right)", tags: ["shape", "badge", "徽章", "角标", "check", "对勾", "orange", "橙色"], d: "Orange corner badge with a white check mark at the bottom-right." },
	{ name: "Corner Badge (Top-Left)", tags: ["shape", "badge", "徽章", "角标", "orange", "橙色", "triangle"], d: "Plain orange triangle badge at the top-left corner." },
	{ name: "Corner Badge (Bottom-Left)", tags: ["shape", "badge", "徽章", "角标", "orange", "橙色", "triangle"], d: "Plain orange triangle badge at the bottom-left corner." },
	{ name: "HOT Ribbon Badge", tags: ["shape", "badge", "徽章", "ribbon", "丝带", "hot", "red", "红色"], d: "Red ribbon badge labeled HOT rotated at the corner." },
	{ name: "Status Dot Badge", tags: ["shape", "badge", "徽章", "status", "状态", "dot", "圆点", "green", "绿色"], d: "Small green status dot at the top-right corner." },
	{ name: "Count Badge 99", tags: ["shape", "badge", "徽章", "count", "数字", "99", "blue", "蓝色"], d: "Round blue badge labeled 99 for notification counts." },
	{ name: "Waiting Label Badge", tags: ["shape", "badge", "徽章", "label", "标签", "waiting", "gray", "灰色"], d: "Gray label badge labeled waiting at the top-right corner." },
	{ name: "NEW Badge", tags: ["shape", "badge", "徽章", "label", "标签", "new", "green", "绿色"], d: "Green rounded badge labeled NEW." },
	// 17-25 slanted clips
	{ name: "Diamond Cut Shape", tags: ["shape", "clip-path", "diamond", "菱形", "斜切", "blue", "浅蓝"], d: "Square with diamond-cut corners via clip-path." },
	{ name: "Slanted Trapezoid (Left)", tags: ["shape", "clip-path", "slanted", "斜切", "trapezoid", "梯形", "pink", "粉红"], d: "Trapezoid with a slanted edge on the left via clip-path." },
	{ name: "Slanted Trapezoid Variant 2", tags: ["shape", "clip-path", "slanted", "斜切", "trapezoid", "梯形", "pink", "粉红"], d: "Trapezoid variant with a slanted edge via clip-path." },
	{ name: "Slanted Trapezoid Variant 3", tags: ["shape", "clip-path", "slanted", "斜切", "trapezoid", "梯形", "pink", "粉红"], d: "Trapezoid variant with a slanted edge via clip-path." },
	{ name: "Slanted Trapezoid Variant 4", tags: ["shape", "clip-path", "slanted", "斜切", "trapezoid", "梯形", "pink", "粉红"], d: "Trapezoid variant with a slanted edge via clip-path." },
	{ name: "Diagonal Cut Shape 5", tags: ["shape", "clip-path", "diagonal", "斜切", "pink", "粉红"], d: "Shape with a large diagonal cut via clip-path." },
	{ name: "Diagonal Cut Shape 6", tags: ["shape", "clip-path", "diagonal", "斜切", "pink", "粉红"], d: "Shape with a large diagonal cut via clip-path." },
	{ name: "Diagonal Cut Shape 7", tags: ["shape", "clip-path", "diagonal", "斜切", "pink", "粉红"], d: "Shape with a large diagonal cut via clip-path." },
	{ name: "Diagonal Cut Shape 8", tags: ["shape", "clip-path", "diagonal", "斜切", "pink", "粉红"], d: "Shape with a large diagonal cut via clip-path." },
	// 26-31 mask organic
	{ name: "Clover Leaf", tags: ["shape", "mask", "clover", "四叶草", "leaf", "叶子", "beige", "米色"], d: "Four-lobed clover leaf created with radial-gradient masks." },
	{ name: "Four-Leaf Clover", tags: ["shape", "mask", "clover", "四叶草", "leaf", "叶子", "pink", "粉红"], d: "Four-leaf clover created with radial-gradient masks." },
	{ name: "Five-Petal Flower", tags: ["shape", "mask", "flower", "花朵", "花瓣", "orange", "橙红"], d: "Five-petal flower created with radial-gradient masks." },
	{ name: "Star Flower Ring", tags: ["shape", "mask", "flower", "花朵", "star", "星形", "red", "红色"], d: "Five-point star flower created with radial-gradient masks." },
	{ name: "Squircle", tags: ["shape", "squircle", "圆角方", "superellipse", "purple", "紫色"], d: "Squircle shape using corner-shape: squircle with a 50% border-radius." },
	{ name: "Rounded Square", tags: ["shape", "mask", "rounded", "圆角", "square", "方形", "cyan", "青蓝"], d: "Rounded square created with a conic-gradient mask." },
	// 32-39 notched rectangles
	{ name: "Notched Rectangle (Top-Left)", tags: ["shape", "clip-path", "notched", "切角", "rectangle", "矩形", "blue", "浅蓝"], d: "Rectangle with a notched top-left corner via clip-path." },
	{ name: "Notched Rectangle (Top-Right)", tags: ["shape", "clip-path", "notched", "切角", "rectangle", "矩形", "blue", "浅蓝"], d: "Rectangle with a notched top-right corner via clip-path." },
	{ name: "Notched Rectangle (Bottom-Left)", tags: ["shape", "clip-path", "notched", "切角", "rectangle", "矩形", "blue", "浅蓝"], d: "Rectangle with a notched bottom-left corner via clip-path." },
	{ name: "Notched Rectangle (Bottom-Right)", tags: ["shape", "clip-path", "notched", "切角", "rectangle", "矩形", "blue", "浅蓝"], d: "Rectangle with a notched bottom-right corner via clip-path." },
	{ name: "Notched Rectangle (Top & Bottom)", tags: ["shape", "clip-path", "notched", "切角", "rectangle", "矩形", "blue", "浅蓝"], d: "Rectangle with notched top and bottom corners via clip-path." },
	{ name: "Notched Rectangle Variant 6", tags: ["shape", "clip-path", "notched", "切角", "rectangle", "矩形", "blue", "浅蓝"], d: "Rectangle with multiple notched corners via clip-path." },
	{ name: "Notched Rectangle Variant 7", tags: ["shape", "clip-path", "notched", "切角", "rectangle", "矩形", "blue", "浅蓝"], d: "Rectangle with multiple notched corners via clip-path." },
	{ name: "Notched Rectangle Variant 8", tags: ["shape", "clip-path", "notched", "切角", "rectangle", "矩形", "blue", "浅蓝"], d: "Rectangle with multiple notched corners via clip-path." },
	// 40-45 semicircles
	{ name: "Semicircle (Bottom Arc)", tags: ["shape", "mask", "semicircle", "半圆", "half-circle", "orange", "橙色"], d: "Semicircle with the arc at the bottom, created with a radial-gradient mask." },
	{ name: "Semicircle (Right Arc)", tags: ["shape", "mask", "semicircle", "半圆", "half-circle", "orange", "橙色"], d: "Semicircle with the arc at the right, created with a radial-gradient mask." },
	{ name: "Semicircle Variant 3", tags: ["shape", "mask", "semicircle", "半圆", "half-circle", "orange", "橙色"], d: "Semicircle variant created with a radial-gradient mask." },
	{ name: "Semicircle (Top Arc)", tags: ["shape", "mask", "semicircle", "半圆", "half-circle", "orange", "橙色"], d: "Semicircle with the arc at the top, created with a radial-gradient mask." },
	{ name: "Semicircle (Left Arc)", tags: ["shape", "mask", "semicircle", "半圆", "half-circle", "orange", "橙色"], d: "Semicircle with the arc at the left, created with a radial-gradient mask." },
	{ name: "Semicircle Variant 6", tags: ["shape", "mask", "semicircle", "半圆", "half-circle", "orange", "橙色"], d: "Semicircle variant created with a radial-gradient mask." },
	// 46-51 ellipses
	{ name: "Half Ellipse (Top)", tags: ["shape", "clip-path", "ellipse", "椭圆", "half", "半", "pink", "粉色"], d: "Half ellipse cut via clip-path, arc at the top." },
	{ name: "Half Ellipse (Right)", tags: ["shape", "clip-path", "ellipse", "椭圆", "half", "半", "pink", "粉色"], d: "Half ellipse cut via clip-path, arc at the right." },
	{ name: "Flat Ellipse", tags: ["shape", "clip-path", "ellipse", "椭圆", "pill", "pink", "粉色"], d: "Wide flat ellipse cut via clip-path." },
	{ name: "Half Ellipse (Bottom)", tags: ["shape", "clip-path", "ellipse", "椭圆", "half", "半", "pink", "粉色"], d: "Half ellipse cut via clip-path, arc at the bottom." },
	{ name: "Half Ellipse (Left)", tags: ["shape", "clip-path", "ellipse", "椭圆", "half", "半", "pink", "粉色"], d: "Half ellipse cut via clip-path, arc at the left." },
	{ name: "Narrow Ellipse", tags: ["shape", "clip-path", "ellipse", "椭圆", "narrow", "细", "pink", "粉色"], d: "Narrow tall ellipse cut via clip-path." },
	// 52-55 tickets
	{ name: "Rounded Ticket", tags: ["shape", "mask", "ticket", "票据", "信封", "coupon", "优惠券", "cyan", "青色"], d: "Rounded ticket/coupon shape with corner notches via mask." },
	{ name: "Rounded Ticket Variant 2", tags: ["shape", "mask", "ticket", "票据", "信封", "coupon", "优惠券", "cyan", "青色"], d: "Rounded ticket/coupon variant with corner notches via mask." },
	{ name: "Rounded Ticket Variant 3", tags: ["shape", "mask", "ticket", "票据", "信封", "coupon", "优惠券", "cyan", "青色"], d: "Rounded ticket/coupon variant with corner notches via mask." },
	{ name: "Rounded Ticket Variant 4", tags: ["shape", "mask", "ticket", "票据", "信封", "coupon", "优惠券", "cyan", "青色"], d: "Rounded ticket/coupon variant with corner notches via mask." },
	// 56-59 pill capsules
	{ name: "Arrow Pill (Right)", tags: ["shape", "mask", "pill", "胶囊", "capsule", "arrow", "箭头", "red", "红色"], d: "Pill/capsule shape with an arrow cut on the right via mask." },
	{ name: "Arrow Pill (Left)", tags: ["shape", "mask", "pill", "胶囊", "capsule", "arrow", "箭头", "red", "红色"], d: "Pill/capsule shape with an arrow cut on the left via mask." },
	{ name: "Arrow Pill Variant 3", tags: ["shape", "mask", "pill", "胶囊", "capsule", "arrow", "箭头", "red", "红色"], d: "Pill/capsule variant with an arrow cut via mask." },
	{ name: "Arrow Pill Variant 4", tags: ["shape", "mask", "pill", "胶囊", "capsule", "arrow", "箭头", "red", "红色"], d: "Pill/capsule variant with an arrow cut via mask." },
	// 60-61 rings
	{ name: "Ring (Donut)", tags: ["shape", "mask", "ring", "圆环", "donut", "甜甜圈", "yellow", "黄色"], d: "Circular ring/donut shape via a radial-gradient mask." },
	{ name: "Square Ring", tags: ["shape", "mask", "ring", "圆环", "square", "方形", "beige", "米色"], d: "Square ring outline via a conic-gradient content-box mask." },
	// 62-65 arrow buttons
	{ name: "Arrow Button (Right)", tags: ["shape", "clip-path", "arrow", "箭头", "button", "按钮", "next", "blue", "蓝色"], d: "Button-shaped arrow pointing right via clip-path." },
	{ name: "Arrow Button (Both)", tags: ["shape", "clip-path", "arrow", "箭头", "button", "按钮", "blue", "蓝色"], d: "Button-shaped double arrow (both sides) via clip-path." },
	{ name: "Arrow Button (Left)", tags: ["shape", "clip-path", "arrow", "箭头", "button", "按钮", "back", "blue", "蓝色"], d: "Button-shaped arrow pointing left via clip-path." },
	{ name: "Arrow Button Double", tags: ["shape", "clip-path", "arrow", "箭头", "button", "按钮", "blue", "蓝色"], d: "Button-shaped double arrow via clip-path." },
	// 66-69 arches
	{ name: "Arch (Top)", tags: ["shape", "mask", "arch", "拱形", "semicircle", "半圆", "pink", "粉色"], d: "Arch shape with a curved top via mask and clip-path." },
	{ name: "Arch (Bottom)", tags: ["shape", "mask", "arch", "拱形", "semicircle", "半圆", "pink", "粉色"], d: "Arch shape with a curved bottom via mask and clip-path." },
	{ name: "Arch (Left)", tags: ["shape", "mask", "arch", "拱形", "semicircle", "半圆", "pink", "粉色"], d: "Arch shape with a curved left side via mask and clip-path." },
	{ name: "Arch (Right)", tags: ["shape", "mask", "arch", "拱形", "semicircle", "半圆", "pink", "粉色"], d: "Arch shape with a curved right side via mask and clip-path." },
	// 70-71 dotted borders
	{ name: "Dotted Border Square", tags: ["shape", "mask", "dotted", "点状", "border", "边框", "teal", "青绿"], d: "Square with a dotted border pattern via mask." },
	{ name: "Dotted Border Square Variant", tags: ["shape", "mask", "dotted", "点状", "border", "边框", "teal", "青绿"], d: "Square with a dotted border variant via mask." },
	// 72-78 gears
	{ name: "Gear Shape (Right)", tags: ["shape", "clip-path", "gear", "齿轮", "cog", "锯齿", "orange", "橙色"], d: "Gear/cog shape with teeth on the right via clip-path." },
	{ name: "Gear Shape (Left Half)", tags: ["shape", "clip-path", "gear", "齿轮", "cog", "锯齿", "orange", "橙色"], d: "Half gear/cog shape with teeth on the left via clip-path." },
	{ name: "Gear Shape (Bottom)", tags: ["shape", "clip-path", "gear", "齿轮", "cog", "锯齿", "orange", "橙色"], d: "Gear/cog shape with teeth on the bottom via clip-path." },
	{ name: "Gear Shape (All Sides)", tags: ["shape", "clip-path", "gear", "齿轮", "cog", "锯齿", "orange", "橙色"], d: "Gear/cog shape with teeth on all sides via clip-path." },
	{ name: "Gear Shape (Top & Bottom)", tags: ["shape", "clip-path", "gear", "齿轮", "cog", "锯齿", "orange", "橙色"], d: "Gear/cog shape with teeth on top and bottom via clip-path." },
	{ name: "Gear Shape (Left)", tags: ["shape", "clip-path", "gear", "齿轮", "cog", "锯齿", "orange", "橙色"], d: "Gear/cog shape with teeth on the left via clip-path." },
	{ name: "Gear Shape (Top)", tags: ["shape", "clip-path", "gear", "齿轮", "cog", "锯齿", "orange", "橙色"], d: "Gear/cog shape with teeth on the top via clip-path." },
	// 79-86 rounded rects with notches
	{ name: "Rounded Rect Notch (Top)", tags: ["shape", "mask", "rounded", "圆角", "rectangle", "矩形", "notch", "缺口", "orange", "橙色"], d: "Rounded rectangle with a semicircular notch at the top via mask." },
	{ name: "Rounded Rect Notch (Top-Left)", tags: ["shape", "mask", "rounded", "圆角", "rectangle", "矩形", "notch", "缺口", "orange", "橙色"], d: "Rounded rectangle with a notch at the top-left via mask." },
	{ name: "Rounded Rect Notch (Left)", tags: ["shape", "mask", "rounded", "圆角", "rectangle", "矩形", "notch", "缺口", "orange", "橙色"], d: "Rounded rectangle with a semicircular notch at the left via mask." },
	{ name: "Rounded Rect Notch (Top & Left)", tags: ["shape", "mask", "rounded", "圆角", "rectangle", "矩形", "notch", "缺口", "orange", "橙色"], d: "Rounded rectangle with notches at the top and left via mask." },
	{ name: "Rounded Rect Notch (Top-Left Corner)", tags: ["shape", "mask", "rounded", "圆角", "rectangle", "矩形", "notch", "缺口", "orange", "橙色"], d: "Rounded rectangle with a corner notch at the top-left via mask." },
	{ name: "Rounded Rect Notch (Bottom)", tags: ["shape", "mask", "rounded", "圆角", "rectangle", "矩形", "notch", "缺口", "orange", "橙色"], d: "Rounded rectangle with a semicircular notch at the bottom via mask." },
	{ name: "Rounded Rect Notch (Right)", tags: ["shape", "mask", "rounded", "圆角", "rectangle", "矩形", "notch", "缺口", "orange", "橙色"], d: "Rounded rectangle with a semicircular notch at the right via mask." },
	{ name: "Dotted Border Rounded Square", tags: ["shape", "mask", "dotted", "点状", "border", "边框", "rounded", "圆角", "brown", "棕色"], d: "Rounded square with a dotted border pattern via mask." },
	// 87 octagon
	{ name: "Octagon", tags: ["shape", "clip-path", "octagon", "八角形", "polygon", "green", "浅绿"], d: "Octagon shape with cut corners via clip-path." },
	// 88-91 chamfered
	{ name: "Chamfered Rectangle (Bottom-Left)", tags: ["shape", "clip-path", "chamfered", "切角", "rectangle", "矩形", "green", "浅绿"], d: "Rectangle with a 45-degree chamfered bottom-left corner via clip-path." },
	{ name: "Chamfered Rectangle (Top-Right)", tags: ["shape", "clip-path", "chamfered", "切角", "rectangle", "矩形", "green", "浅绿"], d: "Rectangle with a 45-degree chamfered top-right corner via clip-path." },
	{ name: "Chamfered Rectangle (Bottom-Right)", tags: ["shape", "clip-path", "chamfered", "切角", "rectangle", "矩形", "green", "浅绿"], d: "Rectangle with a 45-degree chamfered bottom-right corner via clip-path." },
	{ name: "Chamfered Rectangle (Top-Right) 2", tags: ["shape", "clip-path", "chamfered", "切角", "rectangle", "矩形", "green", "浅绿"], d: "Rectangle with a 45-degree chamfered top-right corner via clip-path." },
	// 92-95 triangles
	{ name: "Triangle (Up)", tags: ["shape", "clip-path", "triangle", "三角形", "arrow", "箭头", "orange", "橙色"], d: "Classic upward-pointing triangle via clip-path." },
	{ name: "Triangle (Down)", tags: ["shape", "clip-path", "triangle", "三角形", "arrow", "箭头", "orange", "橙色"], d: "Classic downward-pointing triangle via clip-path." },
	{ name: "Triangle (Left)", tags: ["shape", "clip-path", "triangle", "三角形", "arrow", "箭头", "orange", "橙色"], d: "Classic left-pointing triangle via clip-path." },
	{ name: "Triangle (Right)", tags: ["shape", "clip-path", "triangle", "三角形", "arrow", "箭头", "orange", "橙色"], d: "Classic right-pointing triangle via clip-path." },
	// 96-99 rounded triangles
	{ name: "Rounded Triangle (Up)", tags: ["shape", "mask", "triangle", "三角形", "rounded", "圆角", "peach", "浅橙"], d: "Rounded upward triangle via mask and clip-path." },
	{ name: "Rounded Triangle (Down)", tags: ["shape", "mask", "triangle", "三角形", "rounded", "圆角", "peach", "浅橙"], d: "Rounded downward triangle via mask and clip-path." },
	{ name: "Rounded Triangle (Left)", tags: ["shape", "mask", "triangle", "三角形", "rounded", "圆角", "peach", "浅橙"], d: "Rounded left triangle via mask and clip-path." },
	{ name: "Rounded Triangle (Right)", tags: ["shape", "mask", "triangle", "三角形", "rounded", "圆角", "peach", "浅橙"], d: "Rounded right triangle via mask and clip-path." },
	// 100-103 right triangles
	{ name: "Right Triangle (Bottom-Left)", tags: ["shape", "clip-path", "triangle", "三角形", "corner", "直角", "purple", "紫色"], d: "Right triangle in the bottom-left corner via clip-path." },
	{ name: "Right Triangle (Bottom-Right)", tags: ["shape", "clip-path", "triangle", "三角形", "corner", "直角", "purple", "紫色"], d: "Right triangle in the bottom-right corner via clip-path." },
	{ name: "Right Triangle (Top-Right)", tags: ["shape", "clip-path", "triangle", "三角形", "corner", "直角", "purple", "紫色"], d: "Right triangle in the top-right corner via clip-path." },
	{ name: "Right Triangle (Top-Left)", tags: ["shape", "clip-path", "triangle", "三角形", "corner", "直角", "purple", "紫色"], d: "Right triangle in the top-left corner via clip-path." },
	// 104-107 rounded right triangles (gradient)
	{ name: "Rounded Right Triangle (Bottom-Left)", tags: ["shape", "mask", "triangle", "三角形", "rounded", "圆角", "gradient", "渐变", "orange", "橙红"], d: "Rounded right triangle (bottom-left) with an orange-red gradient." },
	{ name: "Rounded Right Triangle (Bottom-Right)", tags: ["shape", "mask", "triangle", "三角形", "rounded", "圆角", "gradient", "渐变", "orange", "橙红"], d: "Rounded right triangle (bottom-right) with an orange-red gradient." },
	{ name: "Rounded Right Triangle (Top-Right)", tags: ["shape", "mask", "triangle", "三角形", "rounded", "圆角", "gradient", "渐变", "orange", "橙红"], d: "Rounded right triangle (top-right) with an orange-red gradient." },
	{ name: "Rounded Right Triangle (Top-Left)", tags: ["shape", "mask", "triangle", "三角形", "rounded", "圆角", "gradient", "渐变", "orange", "橙红"], d: "Rounded right triangle (top-left) with an orange-red gradient." },
	// 108-111 rounded right triangles
	{ name: "Rounded Corner Triangle (Bottom-Left)", tags: ["shape", "triangle", "三角形", "rounded", "圆角", "corner", "直角", "orange", "橙色"], d: "Right triangle with rounded edges in the bottom-left corner." },
	{ name: "Rounded Corner Triangle (Bottom-Right)", tags: ["shape", "triangle", "三角形", "rounded", "圆角", "corner", "直角", "orange", "橙色"], d: "Right triangle with rounded edges in the bottom-right corner." },
	{ name: "Rounded Corner Triangle (Top-Right)", tags: ["shape", "triangle", "三角形", "rounded", "圆角", "corner", "直角", "orange", "橙色"], d: "Right triangle with rounded edges in the top-right corner." },
	{ name: "Rounded Corner Triangle (Top-Left)", tags: ["shape", "triangle", "三角形", "rounded", "圆角", "corner", "直角", "orange", "橙色"], d: "Right triangle with rounded edges in the top-left corner." },
	// 112-115 narrow triangles
	{ name: "Narrow Triangle (Up)", tags: ["shape", "clip-path", "triangle", "三角形", "narrow", "细长", "arrow", "箭头", "orange", "橙色"], d: "Narrow, elongated upward triangle via clip-path." },
	{ name: "Narrow Triangle (Down)", tags: ["shape", "clip-path", "triangle", "三角形", "narrow", "细长", "arrow", "箭头", "orange", "橙色"], d: "Narrow, elongated downward triangle via clip-path." },
	{ name: "Narrow Triangle (Left)", tags: ["shape", "clip-path", "triangle", "三角形", "narrow", "细长", "arrow", "箭头", "orange", "橙色"], d: "Narrow, elongated left triangle via clip-path." },
	{ name: "Narrow Triangle (Right)", tags: ["shape", "clip-path", "triangle", "三角形", "narrow", "细长", "arrow", "箭头", "orange", "橙色"], d: "Narrow, elongated right triangle via clip-path." },
	// 116-119 rounded narrow triangles (gradient)
	{ name: "Rounded Narrow Triangle (Up)", tags: ["shape", "mask", "triangle", "三角形", "narrow", "细长", "rounded", "圆角", "gradient", "渐变"], d: "Rounded narrow upward triangle with an orange-red gradient." },
	{ name: "Rounded Narrow Triangle (Down)", tags: ["shape", "mask", "triangle", "三角形", "narrow", "细长", "rounded", "圆角", "gradient", "渐变"], d: "Rounded narrow downward triangle with an orange-red gradient." },
	{ name: "Rounded Narrow Triangle (Left)", tags: ["shape", "mask", "triangle", "三角形", "narrow", "细长", "rounded", "圆角", "gradient", "渐变"], d: "Rounded narrow left triangle with an orange-red gradient." },
	{ name: "Rounded Narrow Triangle (Right)", tags: ["shape", "mask", "triangle", "三角形", "narrow", "细长", "rounded", "圆角", "gradient", "渐变"], d: "Rounded narrow right triangle with an orange-red gradient." },
	// 120-123 rounded narrow triangles (beige)
	{ name: "Rounded Narrow Triangle Beige (Up)", tags: ["shape", "mask", "triangle", "三角形", "narrow", "细长", "rounded", "圆角", "beige", "米色"], d: "Rounded narrow upward triangle in beige via mask." },
	{ name: "Rounded Narrow Triangle Beige (Down)", tags: ["shape", "mask", "triangle", "三角形", "narrow", "细长", "rounded", "圆角", "beige", "米色"], d: "Rounded narrow downward triangle in beige via mask." },
	{ name: "Rounded Narrow Triangle Beige (Left)", tags: ["shape", "mask", "triangle", "三角形", "narrow", "细长", "rounded", "圆角", "beige", "米色"], d: "Rounded narrow left triangle in beige via mask." },
	{ name: "Rounded Narrow Triangle Beige (Right)", tags: ["shape", "mask", "triangle", "三角形", "narrow", "细长", "rounded", "圆角", "beige", "米色"], d: "Rounded narrow right triangle in beige via mask." },
	// 124 octagon (duplicate style)
	{ name: "Octagon (Small)", tags: ["shape", "clip-path", "octagon", "八角形", "polygon", "green", "浅绿"], d: "Small octagon shape with cut corners via clip-path." },
	// 125-129 zigzag edges
	{ name: "Zigzag Edge Rectangle (Top & Bottom)", tags: ["shape", "clip-path", "zigzag", "锯齿", "serrated", "rectangle", "矩形", "green", "浅绿"], d: "Rectangle with zigzag serrated edges on top and bottom via clip-path." },
	{ name: "Zigzag Edge Rectangle (Bottom)", tags: ["shape", "clip-path", "zigzag", "锯齿", "serrated", "rectangle", "矩形", "green", "浅绿"], d: "Rectangle with a zigzag serrated bottom edge via clip-path." },
	{ name: "Zigzag Edge Rectangle (Right)", tags: ["shape", "clip-path", "zigzag", "锯齿", "serrated", "rectangle", "矩形", "green", "浅绿"], d: "Rectangle with a zigzag serrated right edge via clip-path." },
	{ name: "Zigzag Edge Rectangle (Bottom Narrow)", tags: ["shape", "clip-path", "zigzag", "锯齿", "serrated", "rectangle", "矩形", "green", "浅绿"], d: "Rectangle with a narrow zigzag serrated bottom edge via clip-path." },
	{ name: "Zigzag Edge Rectangle (Left)", tags: ["shape", "clip-path", "zigzag", "锯齿", "serrated", "rectangle", "矩形", "green", "浅绿"], d: "Rectangle with a zigzag serrated left edge via clip-path." },
	// 130-133 notch arrows
	{ name: "Notch Cut Rectangle (Top)", tags: ["shape", "clip-path", "notch", "缺口", "arrow", "箭头", "rectangle", "矩形", "green", "浅绿"], d: "Rectangle with an arrow-like notch cut in the top edge via clip-path." },
	{ name: "Notch Cut Rectangle (Top Reverse)", tags: ["shape", "clip-path", "notch", "缺口", "arrow", "箭头", "rectangle", "矩形", "green", "浅绿"], d: "Rectangle with a reversed arrow-like notch in the top edge via clip-path." },
	{ name: "Notch Cut Rectangle (Bottom)", tags: ["shape", "clip-path", "notch", "缺口", "arrow", "箭头", "rectangle", "矩形", "green", "浅绿"], d: "Rectangle with an arrow-like notch cut in the bottom edge via clip-path." },
	{ name: "Notch Cut Rectangle (Bottom Reverse)", tags: ["shape", "clip-path", "notch", "缺口", "arrow", "箭头", "rectangle", "矩形", "green", "浅绿"], d: "Rectangle with a reversed arrow-like notch in the bottom edge via clip-path." },
];

/* ------------------------------------------------------------------ */
/* main                                                                */
/* ------------------------------------------------------------------ */

function toBilingual(meta) {
	const zh = zhName(meta.name);
	return {
		name: { en: meta.name, zh },
		tags: splitTags(meta.tags),
		description: { en: meta.d, zh: zhDescription(meta.name, zh, meta.d) },
	};
}

// boxShadow
{
	const data = readJson("boxShadow.json");
	const out = data.map((item) => {
		const meta = boxShadowMeta(item);
		const { name, tags, description, ...rest } = item;
		return { id: item.id, name: meta.name, tags: meta.tags, description: meta.description, ...rest };
	});
	writeJson("boxShadow.json", out, "\t");
	console.log(`boxShadow.json: ${out.length} items (rule-based)`);
}

// border
{
	const data = readJson("border.json");
	const out = data.map((item) => {
		const meta = toBilingual(BORDER_META[item.id]);
		if (!meta) throw new Error(`Missing border meta for id ${item.id}`);
		const { name, tags, description, ...rest } = item;
		return { id: item.id, name: meta.name, tags: meta.tags, description: meta.description, ...rest };
	});
	writeJson("border.json", out, "\t");
	console.log(`border.json: ${out.length} items (hand-mapped)`);
}

// text
{
	const data = readJson("text.json");
	const out = data.map((item) => {
		const meta = toBilingual(TEXT_META[item.id]);
		if (!meta) throw new Error(`Missing text meta for id ${item.id}`);
		const { name, tags, description, ...rest } = item;
		return { id: item.id, name: meta.name, tags: meta.tags, description: meta.description, ...rest };
	});
	writeJson("text.json", out, "\t");
	console.log(`text.json: ${out.length} items (hand-mapped)`);
}

// shape
{
	const data = readJson("shape.json");
	if (SHAPE_META.length !== data.length) {
		throw new Error(`shape meta count ${SHAPE_META.length} != data count ${data.length}`);
	}
	const out = data.map((item, i) => {
		const meta = toBilingual(SHAPE_META[i]);
		if (!meta) throw new Error(`Missing shape meta at index ${i}`);
		const { name, tags, description, ...rest } = item;
		return { id: item.id, name: meta.name, tags: meta.tags, description: meta.description, ...rest };
	});
	writeJson("shape.json", out, 4);
	console.log(`shape.json: ${out.length} items (hand-mapped)`);
}

console.log("\nDone. All presets now carry bilingual (en/zh) name/tags/description metadata.");
