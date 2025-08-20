export enum StyleTabs {
	BoxShadow = "boxShadow",
	Border = "border",
	Gradient = "gradient",
	Text = "text",
}

export const TABS = [
	{ value: StyleTabs.BoxShadow, label: "Box Shadows" },
	{ value: StyleTabs.Border, label: "Borders" },
	{ value: StyleTabs.Gradient, label: "Gradients" },
	{ value: StyleTabs.Text, label: "Text" },
];

export const TAB_TRIGGER_CLASS: Record<string, string> = {
	[StyleTabs.BoxShadow]: "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 hover:bg-blue-200",
	[StyleTabs.Border]: "data-[state=active]:bg-green-100 data-[state=active]:text-green-800 hover:bg-green-200",
	[StyleTabs.Gradient]: "data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 hover:bg-pink-200",
	[StyleTabs.Text]: "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 hover:bg-purple-200",
};
