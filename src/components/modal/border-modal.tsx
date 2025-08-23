"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Copy } from "lucide-react";
import { copyToClipboard } from "@/utils/clipboard";

type BorderSide = "top" | "right" | "bottom" | "left";
type BorderCorner = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";
interface BorderModalProps {
	style: any;
	onClose: () => void;
}

export default function BorderModal({ style, onClose }: BorderModalProps) {
	// Border state
	const [borderValues, setBorderValues] = useState<{
		top: { width: number; style: string; color: string };
		right: { width: number; style: string; color: string };
		bottom: { width: number; style: string; color: string };
		left: { width: number; style: string; color: string };
		unified: boolean;
	}>({
		top: { width: 2, style: "solid", color: "#a6deba" },
		right: { width: 2, style: "solid", color: "#a6deba" },
		bottom: { width: 2, style: "solid", color: "#a6deba" },
		left: { width: 2, style: "solid", color: "#a6deba" },
		unified: true,
	});
	// Border radius
	const [radiusValues, setRadiusValues] = useState<{
		topLeft: number;
		topRight: number;
		bottomRight: number;
		bottomLeft: number;
		unified: boolean;
	}>({
		topLeft: 10,
		topRight: 10,
		bottomRight: 10,
		bottomLeft: 10,
		unified: true,
	});
	// Gradient background
	const [background, setBackground] = useState("");
	// Mask
	const [mask, setMask] = useState("");
	// Generated CSS
	const [generatedCSS, setGeneratedCSS] = useState("");

	useEffect(() => {
		const defaultStyle = Object.entries(style)
			.map(([key, value]) => `${key}: ${value};`)
			.join("\n");
		setGeneratedCSS(defaultStyle);
	});

	// Border update
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
		generateCSS(newBorderValues, radiusValues, background, mask);
	};

	// Radius update
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
		generateCSS(borderValues, newRadiusValues, background, mask);
	};

	// Background update
	const updateBackground = (value: string) => {
		setBackground(value);
		generateCSS(borderValues, radiusValues, value, mask);
	};

	// Mask update
	const updateMask = (value: string) => {
		setMask(value);
		generateCSS(borderValues, radiusValues, background, value);
	};

	// Generate CSS
	const generateCSS = (border: typeof borderValues, radius: typeof radiusValues, bg: string, maskValue: string) => {
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

		// Background
		if (bg) {
			cssParts.push(`background: ${bg};`);
		}

		// Mask
		if (maskValue) {
			cssParts.push(`-webkit-mask-image: ${maskValue};`);
			cssParts.push(`mask-image: ${maskValue};`);
		}

		setGeneratedCSS(cssParts.join(" "));
	};

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
								background: background,
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
									onChange={(e) => setBorderValues({ ...borderValues, unified: e.target.checked })}
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
											value={borderValues.top.color}
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
														max={20}
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
														value={borderValues[side].color}
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
									onChange={(e) => setRadiusValues({ ...radiusValues, unified: e.target.checked })}
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
										max={64}
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
												max={64}
												step={1}
												className="mt-1"
											/>
											<span className="text-xs text-gray-500">{radiusValues[corner.key]}px</span>
										</div>
									))}
								</div>
							)}
						</div>

						<h3 className="font-medium mb-2 mt-6">Gradient Background</h3>
						<div className="space-y-4">
							<div>
								<Input
									type="text"
									value={background}
									onChange={(e) => updateBackground(e.target.value)}
									className="mt-2"
									placeholder="e.g. linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)"
								/>
							</div>
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
					<div className="bg-gray-100 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm max-h-32 overflow-y-auto">
						{generatedCSS}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
