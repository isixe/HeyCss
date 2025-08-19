export type StyleType = "boxShadow" | "border" | "gradient" | "text";

export interface StyleItem {
	id: number;
	name: string;
	style: React.CSSProperties;
	css: string;
}

export interface StylesData {
	boxShadow: StyleItem[];
	border: StyleItem[];
	gradient: StyleItem[];
	text: StyleItem[];
}
