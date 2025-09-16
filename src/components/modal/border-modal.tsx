"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Copy, Plus, X } from "lucide-react";
import { copyToClipboard } from "@/utils/clipboard";
import Color from "color";
import { cssObjectParser } from "@/core/parser";

type BorderModalProps = {
	style: any;
	onClose: () => void;
};

export default function BorderModal({ style, onClose }: BorderModalProps) {
	const defaultStyle = cssObjectParser(style);

	const [borderValues, setBorderValues] = useState<BorderValues>({
		top: { width: 2, style: "solid", color: "#a6deba" },
		right: { width: 2, style: "solid", color: "#a6deba" },
		bottom: { width: 2, style: "solid", color: "#a6deba" },
		left: { width: 2, style: "solid", color: "#a6deba" },
		unified: true,
	});

	const [radiusValues, setRadiusValues] = useState<RadiusValues>({
		topLeft: 10,
		topRight: 10,
		bottomRight: 10,
		bottomLeft: 10,
		unified: true,
	});

	const [gradientStops, setGradientStops] = useState<GradientStop[]>([]);
	const [gradientDirection, setGradientDirection] = useState("135deg");

	const [mask, setMask] = useState("");

	const [generatedCSS, setGeneratedCSS] = useState(defaultStyle);

	const addGradientStop = () => {
		const newStop: GradientStop = {
			id: Date.now().toString(),
			color: "#ff7e5f",
			position: gradientStops.length === 0 ? 0 : 100,
		};
		const newStops = [...gradientStops, newStop];
		setGradientStops(newStops);
		generateCSS(borderValues, radiusValues, newStops, gradientDirection, mask);
	};

	const removeGradientStop = (id: string) => {
		const newStops = gradientStops.filter((stop) => stop.id !== id);
		setGradientStops(newStops);
		generateCSS(borderValues, radiusValues, newStops, gradientDirection, mask);
	};

	const handleBorderUnifiedChange = (checked: boolean) => {
		const { width, style, color } = borderValues.top;
		const newBorder = {
			top: { width, style, color },
			right: { width, style, color },
			bottom: { width, style, color },
			left: { width, style, color },
			unified: checked,
		};
		setBorderValues(newBorder);
		generateCSS(newBorder, radiusValues, gradientStops, gradientDirection, mask);
	};

	const handleRadiusUnifiedChange = (checked: boolean) => {
		const v = radiusValues.topLeft;
		const newRadiusValues = {
			topLeft: v,
			topRight: v,
			bottomRight: v,
			bottomLeft: v,
			unified: checked,
		};
		setRadiusValues(newRadiusValues);
		generateCSS(borderValues, newRadiusValues, gradientStops, gradientDirection, mask);
	};

	const updateBorderStyle = (value: string) => {
		setGeneratedCSS(value);

		const colorReg = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b|rgba?\([^)]+\)|hsla?\([^)]+\)|\b[a-zA-Z]+\b/;

		const borderUnified = !value.match(/border-(top|right|bottom|left):/);

		let newBorderValues = { ...borderValues };

		if (borderUnified) {
			const borderMatch = value.match(new RegExp(`border:\\s*(\\d+)px\\s+(\\w+)\\s+(${colorReg.source})`));
			if (borderMatch) {
				const width = Number(borderMatch[1]);
				const style = borderMatch[2];
				const color = borderMatch[3];
				newBorderValues = {
					top: { width, style, color },
					right: { width, style, color },
					bottom: { width, style, color },
					left: { width, style, color },
					unified: true,
				};
			}
		} else {
			const borderTopMatch = value.match(new RegExp(`border-top:\\s*(\\d+)px\\s+(\\w+)\\s+(${colorReg.source})`));
			const borderRightMatch = value.match(new RegExp(`border-right:\\s*(\\d+)px\\s+(\\w+)\\s+(${colorReg.source})`));
			const borderBottomMatch = value.match(new RegExp(`border-bottom:\\s*(\\d+)px\\s+(\\w+)\\s+(${colorReg.source})`));
			const borderLeftMatch = value.match(new RegExp(`border-left:\\s*(\\d+)px\\s+(\\w+)\\s+(${colorReg.source})`));
			if (borderTopMatch) {
				const width = Number(borderTopMatch[1]);
				const style = borderTopMatch[2];
				const color = borderTopMatch[3];
				newBorderValues.top = { width, style, color };
			} else {
				newBorderValues.top = { width: 0, style: "solid", color: "transparent" };
			}
			if (borderRightMatch) {
				const width = Number(borderRightMatch[1]);
				const style = borderRightMatch[2];
				const color = borderRightMatch[3];
				newBorderValues.right = { width, style, color };
			} else {
				newBorderValues.right = { width: 0, style: "solid", color: "transparent" };
			}
			if (borderBottomMatch) {
				const width = Number(borderBottomMatch[1]);
				const style = borderBottomMatch[2];
				const color = borderBottomMatch[3];
				newBorderValues.bottom = { width, style, color };
			} else {
				newBorderValues.bottom = { width: 0, style: "solid", color: "transparent" };
			}
			if (borderLeftMatch) {
				const width = Number(borderLeftMatch[1]);
				const style = borderLeftMatch[2];
				const color = borderLeftMatch[3];
				newBorderValues.left = { width, style, color };
			} else {
				newBorderValues.left = { width: 0, style: "solid", color: "transparent" };
			}
			newBorderValues.unified = false;
		}
		setBorderValues(newBorderValues);

		const radiusReg = /border-radius:\s*([^;]+)/;
		const radiusMatch = value.match(radiusReg);
		if (radiusMatch) {
			const radiusStr = radiusMatch[1].trim();
			const radiusArr = radiusStr
				.split(/\s+/)
				.map((v) => parseInt(v.replace("px", ""), 10))
				.filter((v) => !isNaN(v));

			const mapping = [
				[0, 0, 0, 0],
				[0, 1, 0, 1],
				[0, 1, 2, 1],
				[0, 1, 2, 3],
			];
			const len = Math.min(radiusArr.length, 4);
			const map = mapping[len - 1];
			const result = {
				topLeft: radiusArr[map[0]] ?? 0,
				topRight: radiusArr[map[1]] ?? 0,
				bottomRight: radiusArr[map[2]] ?? 0,
				bottomLeft: radiusArr[map[3]] ?? 0,
				unified: len === 1,
			};
			setRadiusValues(result);
		}

		const gradientMatch = value.match(/linear-gradient\(([^,]+),([^)]+)\)/);
		if (gradientMatch) {
			const direction = gradientMatch[1].trim();
			const stopsArr = gradientMatch[2].split(",").map((s) => s.trim());

			const newStops = stopsArr.map((stop, idx) => {
				const colorMatch = stop.match(colorReg);
				const color = colorMatch ? colorMatch[0] : "#000";
				const positionMatch = stop.match(/(\d+)%/);
				const position = positionMatch ? Number(positionMatch[1]) : 0;
				return { id: String(idx), color, position };
			});
			setGradientDirection(direction);
			setGradientStops(newStops);
		} else {
			setGradientStops([]);
		}
		const maskMatch = value.match(/mask-image:\s*([^;]+);?/);
		if (maskMatch) {
			setMask(maskMatch[1].trim());
		}
	};

	const updateGradientStop = (id: string, property: "color" | "position", value: string | number) => {
		const newStops = gradientStops.map((stop) => (stop.id === id ? { ...stop, [property]: value } : stop));
		setGradientStops(newStops);
		generateCSS(borderValues, radiusValues, newStops, gradientDirection, mask);
	};

	const updateGradientDirection = (direction: string) => {
		setGradientDirection(direction);
		generateCSS(borderValues, radiusValues, gradientStops, direction, mask);
	};

	const updateBorder = (side: BorderSide, property: string, value: any) => {
		const newBorderValues = { ...borderValues };
		if (newBorderValues.unified) {
			(["top", "right", "bottom", "left"] as BorderSide[]).forEach((key) => {
				newBorderValues[key] = { ...newBorderValues[key], [property]: value };
			});
		} else {
			newBorderValues[side] = { ...newBorderValues[side], [property]: value };
		}
		setBorderValues(newBorderValues);
		generateCSS(newBorderValues, radiusValues, gradientStops, gradientDirection, mask);
	};

	const updateRadius = (corner: BorderCorner, value: number) => {
		const newRadiusValues = { ...radiusValues };
		if (newRadiusValues.unified) {
			(["topLeft", "topRight", "bottomRight", "bottomLeft"] as BorderCorner[]).forEach((key) => {
				newRadiusValues[key] = value;
			});
		} else {
			newRadiusValues[corner] = value;
		}
		setRadiusValues(newRadiusValues);
		generateCSS(borderValues, newRadiusValues, gradientStops, gradientDirection, mask);
	};

	const updateMask = (value: string) => {
		setMask(value);
		generateCSS(borderValues, radiusValues, gradientStops, gradientDirection, value);
	};

	const generateCSS = (
		border: typeof borderValues,
		radius: typeof radiusValues,
		stops: GradientStop[],
		direction: string,
		maskValue: string
	) => {
		const cssParts: string[] = [];

		// Border
		if (border.unified) {
			const { width, style, color } = border.top;
			cssParts.push(`border: ${width}px ${style} ${color};`);
		} else {
			(["top", "right", "bottom", "left"] as BorderSide[]).forEach((side) => {
				const { width, style, color } = border[side];
				cssParts.push(`border-${side}: ${width}px ${style} ${color};`);
			});
		}

		// Border radius
		if (radius.unified) {
			cssParts.push(`border-radius: ${radius.topLeft}px;`);
		} else {
			cssParts.push(
				`border-radius: ${radius.topLeft}px ${radius.topRight}px ${radius.bottomRight}px ${radius.bottomLeft}px;`
			);
		}

		if (stops.length > 0) {
			const sortedStops = [...stops].sort((a, b) => a.position - b.position);
			const gradientString = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ");
			cssParts.push(`background: linear-gradient(${direction}, ${gradientString});`);
		}

		// Mask
		if (maskValue) {
			cssParts.push(`-webkit-mask-image: ${maskValue};`);
			cssParts.push(`mask-image: ${maskValue};`);
		}

		setGeneratedCSS(cssParts.join(" "));
	};

	const getBackgroundStyle = () => {
		if (gradientStops.length === 0) {
			return {};
		}
		const sortedStops = [...gradientStops].sort((a, b) => a.position - b.position);
		const gradientString = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ");
		return { background: `linear-gradient(${gradientDirection}, ${gradientString})` };
	};

	useEffect(() => {
		generateCSS(borderValues, radiusValues, gradientStops, gradientDirection, mask);
	}, []);

	return (
		<Dialog open={true} onOpenChange={onClose} modal>
			<DialogContent
				className="w-[80vw] h-[80vh] sm:max-w-6xl max-w-6xl max-h-[90vh] overflow-y-auto animate-none px-2 sm:px-8 mx-auto"
				forceMount>
				<DialogHeader>
					<DialogTitle>Edit Border Style</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
					<div className="flex-1 flex flex-col items-center justify-center min-w-0 max-w-full ">
						<h3 className="font-medium mb-4">Preview</h3>
						<div
							className="w-full h-48 rounded-lg bg-white flex items-center justify-center text-gray-600 font-medium border"
							style={{
								...(borderValues.unified
									? { border: `${borderValues.top.width}px ${borderValues.top.style} ${borderValues.top.color}` }
									: {
											borderTop: `${borderValues.top.width}px ${borderValues.top.style} ${borderValues.top.color}`,
											borderRight: `${borderValues.right.width}px ${borderValues.right.style} ${borderValues.right.color}`,
											borderBottom: `${borderValues.bottom.width}px ${borderValues.bottom.style} ${borderValues.bottom.color}`,
											borderLeft: `${borderValues.left.width}px ${borderValues.left.style} ${borderValues.left.color}`,
									  }),
								borderRadius: radiusValues.unified
									? `${radiusValues.topLeft}px`
									: `${radiusValues.topLeft}px ${radiusValues.topRight}px ${radiusValues.bottomRight}px ${radiusValues.bottomLeft}px`,
								...getBackgroundStyle(),
								WebkitMaskImage: mask || undefined,
								maskImage: mask || undefined,
							}}></div>
					</div>
					<div className="flex-1 space-y-6 min-w-0 sm:min-w-[320px]">
						<h3 className="font-medium mb-2">Border</h3>
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="unified-border"
									checked={borderValues.unified}
									onChange={(e) => handleBorderUnifiedChange(e.target.checked)}
									className="rounded"
								/>
								<Label htmlFor="unified-border">Unified Border</Label>
							</div>
							{borderValues.unified ? (
								<div className="space-y-3">
									<div>
										<Label>Border Width</Label>
										<Slider
											value={[borderValues.top.width]}
											onValueChange={([value]) => updateBorder("top", "width", value)}
											min={0}
											max={20}
											step={1}
											className="mt-2"
										/>
										<span className="text-xs text-gray-500">{borderValues.top.width}px</span>
									</div>
									<div>
										<Label>Border Style</Label>
										<select
											value={borderValues.top.style}
											onChange={(e) => updateBorder("top", "style", e.target.value)}
											className="mt-2 text-sm w-full p-2 border rounded">
											<option value="solid">Solid</option>
											<option value="dashed">Dashed</option>
											<option value="dotted">Dotted</option>
											<option value="double">Double</option>
											<option value="groove">Groove</option>
											<option value="ridge">Ridge</option>
											<option value="inset">Inset</option>
											<option value="outset">Outset</option>
										</select>
									</div>
									<div>
										<Label>Border Color</Label>
										<Input
											type="color"
											value={toHex6(borderValues.top.color)}
											onChange={(e) => updateBorder("top", "color", e.target.value)}
											className="mt-2"
										/>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									{(["top", "right", "bottom", "left"] as BorderSide[]).map((side) => (
										<div key={side} className="border p-3 rounded">
											<h4 className="font-medium mb-2 capitalize">{side} Border</h4>
											<div className="grid grid-cols-3 gap-2">
												<div>
													<Label className="text-xs">Width</Label>
													<Slider
														value={[borderValues[side].width]}
														onValueChange={([value]) => updateBorder(side, "width", value)}
														min={0}
														step={1}
														className="mt-1"
													/>
													<span className="text-xs text-gray-500">{borderValues[side].width}px</span>
												</div>
												<div>
													<Label className="text-xs">Style</Label>
													<select
														value={borderValues[side].style}
														onChange={(e) => updateBorder(side, "style", e.target.value)}
														className="mt-1 w-full p-1 border rounded text-xs">
														<option value="solid">Solid</option>
														<option value="dashed">Dashed</option>
														<option value="dotted">Dotted</option>
														<option value="double">Double</option>
													</select>
												</div>
												<div>
													<Label className="text-xs">Color</Label>
													<Input
														type="color"
														value={toHex6(borderValues[side].color)}
														onChange={(e) => updateBorder(side, "color", e.target.value)}
														className="mt-1 h-8"
													/>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						<h3 className="font-medium mb-2 mt-6">Radius</h3>
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="unified-radius"
									checked={radiusValues.unified}
									onChange={(e) => handleRadiusUnifiedChange(e.target.checked)}
									className="rounded"
								/>
								<Label htmlFor="unified-radius">Unified Radius</Label>
							</div>
							{radiusValues.unified ? (
								<div>
									<Label>Radius</Label>
									<Slider
										value={[radiusValues.topLeft]}
										onValueChange={([value]) => updateRadius("topLeft", value)}
										min={0}
										step={1}
										className="mt-2"
									/>
									<span className="text-xs text-gray-500">{radiusValues.topLeft}px</span>
								</div>
							) : (
								<div className="grid grid-cols-2 gap-2">
									{(
										[
											{ key: "topLeft", label: "Top Left" },
											{ key: "topRight", label: "Top Right" },
											{ key: "bottomRight", label: "Bottom Right" },
											{ key: "bottomLeft", label: "Bottom Left" },
										] as { key: BorderCorner; label: string }[]
									).map((corner) => (
										<div key={corner.key}>
											<Label className="text-xs">{corner.label}</Label>
											<Slider
												value={[radiusValues[corner.key]]}
												onValueChange={([value]) => updateRadius(corner.key, value)}
												min={0}
												step={1}
												className="mt-1"
											/>
											<span className="text-xs text-gray-500">{radiusValues[corner.key]}px</span>
										</div>
									))}
								</div>
							)}
						</div>

						{/* TODO：default gradient direction display */}
						<h3 className="font-medium mb-2 mt-6">Gradient Background</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label>Gradient Direction</Label>
								<select
									value={gradientDirection}
									onChange={(e) => updateGradientDirection(e.target.value)}
									className="text-sm p-2 border rounded">
									<option value="">Custom</option>
									<option value="0deg">↑ Top</option>
									<option value="45deg">↗ Top Right</option>
									<option value="90deg">→ Right</option>
									<option value="135deg">↘ Bottom Right</option>
									<option value="180deg">↓ Bottom</option>
									<option value="225deg">↙ Bottom Left</option>
									<option value="270deg">← Left</option>
									<option value="315deg">↖ Top Left</option>
								</select>
							</div>
							<div className="space-y-2">
								<Label className="text-xs">Angle Control</Label>
								<Slider
									value={[gradientDirection.includes("deg") ? Number.parseInt(gradientDirection) : 135]}
									onValueChange={([value]) => updateGradientDirection(`${value}deg`)}
									min={-360}
									max={360}
									step={1}
									className="mt-1"
								/>
								<div className="flex gap-2">
									<Input
										type="text"
										value={gradientDirection}
										onChange={(e) => updateGradientDirection(e.target.value)}
										className="text-xs h-8"
										placeholder="e.g. 45deg, to right"
									/>
									<Input
										type="number"
										value={gradientDirection.includes("deg") ? Number.parseInt(gradientDirection) : ""}
										onChange={(e) => updateGradientDirection(`${e.target.value}deg`)}
										className="text-xs h-8 w-20"
										placeholder="deg"
									/>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<Label>Gradient Stops ({gradientStops.length})</Label>
								<Button
									size="sm"
									variant="outline"
									onClick={addGradientStop}
									className="flex items-center gap-2 bg-transparent">
									<Plus className="h-4 w-4" />
									Add Color
								</Button>
							</div>

							{gradientStops.length === 0 ? (
								<div className="text-sm text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded">
									No gradient colors added. Click "Add Color" to start.
								</div>
							) : (
								<div className="space-y-3 max-h-48 overflow-y-auto">
									{gradientStops.map((stop, index) => (
										<div key={stop.id} className="border p-3 rounded bg-gray-50">
											<div className="flex items-center justify-between mb-2">
												<Label className="text-xs font-medium">Color {index + 1}</Label>
												<Button
													size="sm"
													variant="ghost"
													onClick={() => removeGradientStop(stop.id)}
													className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
													<X className="h-3 w-3" />
												</Button>
											</div>
											<div className="grid grid-cols-2 gap-2">
												<div>
													<Label className="text-xs">Color</Label>
													<Input
														type="color"
														value={toHex6(stop.color)}
														onChange={(e) => updateGradientStop(stop.id, "color", e.target.value)}
														className="mt-1 h-8"
													/>
												</div>
												<div>
													<Label className="text-xs">Position</Label>
													<Slider
														value={[stop.position]}
														onValueChange={([value]) => updateGradientStop(stop.id, "position", value)}
														min={0}
														max={100}
														step={1}
														className="mt-2"
													/>
													<span className="text-xs text-gray-500">{stop.position}%</span>
												</div>
											</div>
										</div>
									))}
								</div>
							)}

							{style.mask && (
								<div>
									<Label>Mask (mask-image)</Label>
									<Input
										type="text"
										value={mask}
										onChange={(e) => updateMask(e.target.value)}
										className="mt-2"
										placeholder="e.g. linear-gradient(black, transparent)"
									/>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="mt-4 sm:mt-6">
					<div className="flex items-center justify-between mb-2">
						<Label>Generated CSS</Label>
						<Button
							size="sm"
							variant="outline"
							onClick={() => copyToClipboard(generatedCSS)}
							className="flex items-center gap-2">
							<Copy className="h-4 w-4" />
							Copy CSS
						</Button>
					</div>
					<Input
						type="text"
						value={generatedCSS}
						onChange={(e) => updateBorderStyle(e.target.value)}
						className="bg-gray-100 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm max-h-32 overflow-y-auto"
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function toHex6(color: string) {
	try {
		return Color(color).hex().toLowerCase();
	} catch {
		return "#000000";
	}
}
