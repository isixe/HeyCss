export type StyleType = "boxShadow" | "border" | "gradient" | "text";

export type StyleItem = {
	id: number;
	name: string;
	style: React.CSSProperties;
	css: string;
};

export type StylesData = {
	boxShadow: StyleItem[];
	border: StyleItem[];
	gradient: StyleItem[];
	text: StyleItem[];
};
