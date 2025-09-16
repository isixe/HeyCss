type StyleType = "boxShadow" | "border" | "gradient" | "text";

type StyleItem = {
	id: number;
	name: string;
	style: React.CSSProperties;
	css: string;
};

type StylesData = {
	boxShadow: StyleItem[];
	border: StyleItem[];
	gradient: StyleItem[];
	text: StyleItem[];
};
