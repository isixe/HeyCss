export type StyleType = "boxShadow" | "border" | "text" | "shape";

export type StyleItem = {
	id: number;
	name: string;
	style: React.CSSProperties;
	css: string;
};

export type StylesData = {
	boxShadow: StyleItem[];
	border: StyleItem[];
	text: StyleItem[];
	shape: StyleItem[];
};
