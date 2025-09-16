type BorderSide = "top" | "right" | "bottom" | "left";
type BorderCorner = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";

type BorderValue = {
	width: number;
	style: string;
	color: string;
};

type BorderValues = {
	top: BorderValue;
	right: BorderValue;
	bottom: BorderValue;
	left: BorderValue;
	unified: boolean;
};

type RadiusValues = {
	topLeft: number;
	topRight: number;
	bottomRight: number;
	bottomLeft: number;
	unified: boolean;
};
