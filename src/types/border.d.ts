type BorderSide = "top" | "right" | "bottom" | "left";
type BorderCorner = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";

type BorderValues = {
	borderTop: string;
	borderRight: string;
	borderBottom: string;
	borderLeft: string;
	unified: boolean;
};

type RadiusValues = {
	topLeft: number;
	topRight: number;
	bottomRight: number;
	bottomLeft: number;
	unified: boolean;
};
