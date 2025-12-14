export enum StyleTabs {
	BoxShadow = "boxShadow",
	Border = "border",
	Text = "text",
	Shape = "shape",
}

export const TABS = [
	{ value: StyleTabs.BoxShadow, label: "Box Shadows" },
	{ value: StyleTabs.Border, label: "Borders" },
	{ value: StyleTabs.Text, label: "Text" },
	{ value: StyleTabs.Shape, label: "Shapes" },
];

export const TAB_TRIGGER_CLASS: Record<string, string> = {
	[StyleTabs.BoxShadow]: "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 hover:bg-blue-200",
	[StyleTabs.Border]: "data-[state=active]:bg-green-100 data-[state=active]:text-green-800 hover:bg-green-200",
	[StyleTabs.Text]: "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 hover:bg-purple-200",
	[StyleTabs.Shape]: "data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 hover:bg-pink-200",
};

export const BORDER_PROP_MAP: Record<BorderSide, string> = {
	top: "borderTop",
	right: "borderRight",
	bottom: "borderBottom",
	left: "borderLeft",
};
