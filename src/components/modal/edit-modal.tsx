"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Copy } from "lucide-react"
import { copyToClipboard } from "@/utils/clipboard"

interface EditModalProps {
  style: any
  onClose: () => void
}

export function EditModal({ style, onClose }: EditModalProps) {
  const [editedStyle, setEditedStyle] = useState(style.style)
  const [generatedCSS, setGeneratedCSS] = useState(style.css)

  // Box shadow state
  const [shadowValues, setShadowValues] = useState({
    offsetX: 0,
    offsetY: 4,
    blurRadius: 6,
    spreadRadius: 0,
    color: "#000000",
    opacity: 0.1,
  })

  // Border state
  const [borderValues, setBorderValues] = useState({
    top: { width: 2, style: "solid", color: "#e5e7eb" },
    right: { width: 2, style: "solid", color: "#e5e7eb" },
    bottom: { width: 2, style: "solid", color: "#e5e7eb" },
    left: { width: 2, style: "solid", color: "#e5e7eb" },
    unified: true,
  })

  const updateStyle = (property: string, value: any) => {
    const newStyle = { ...editedStyle, [property]: value }
    setEditedStyle(newStyle)
    generateCSS(newStyle, style.category)
  }

  const updateShadow = (newValues: any) => {
    const updatedValues = { ...shadowValues, ...newValues }
    setShadowValues(updatedValues)

    const { offsetX, offsetY, blurRadius, spreadRadius, color, opacity } = updatedValues
    const hexToRgba = (hex: string, alpha: number) => {
      const r = Number.parseInt(hex.slice(1, 3), 16)
      const g = Number.parseInt(hex.slice(3, 5), 16)
      const b = Number.parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    const shadowValue = `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${hexToRgba(color, opacity)}`
    updateStyle("boxShadow", shadowValue)
  }

  const updateBorder = (side: string, property: string, value: any) => {
    const newBorderValues = { ...borderValues }

    if (newBorderValues.unified) {
      // Update all sides when unified
      Object.keys(newBorderValues).forEach((key) => {
        if (key !== "unified" && typeof newBorderValues[key] === "object") {
          newBorderValues[key] = { ...newBorderValues[key], [property]: value }
        }
      })
    } else {
      // Update specific side
      newBorderValues[side] = { ...newBorderValues[side], [property]: value }
    }

    setBorderValues(newBorderValues)

    // Generate CSS
    if (newBorderValues.unified) {
      const { width, style: borderStyle, color } = newBorderValues.top
      updateStyle("border", `${width}px ${borderStyle} ${color}`)
    } else {
      const newStyle = { ...editedStyle }
      newStyle.borderTop = `${newBorderValues.top.width}px ${newBorderValues.top.style} ${newBorderValues.top.color}`
      newStyle.borderRight = `${newBorderValues.right.width}px ${newBorderValues.right.style} ${newBorderValues.right.color}`
      newStyle.borderBottom = `${newBorderValues.bottom.width}px ${newBorderValues.bottom.style} ${newBorderValues.bottom.color}`
      newStyle.borderLeft = `${newBorderValues.left.width}px ${newBorderValues.left.style} ${newBorderValues.left.color}`
      delete newStyle.border
      setEditedStyle(newStyle)
      generateCSS(newStyle, style.category)
    }
  }

  const generateCSS = (styleObj: any, category: string) => {
    let css = ""

    switch (category) {
      case "boxshadow":
        if (styleObj.boxShadow) {
          css = `box-shadow: ${styleObj.boxShadow};`
        }
        break
      case "border":
        if (styleObj.border) {
          css = `border: ${styleObj.border};`
        } else {
          if (styleObj.borderTop) css += `border-top: ${styleObj.borderTop}; `
          if (styleObj.borderRight) css += `border-right: ${styleObj.borderRight}; `
          if (styleObj.borderBottom) css += `border-bottom: ${styleObj.borderBottom}; `
          if (styleObj.borderLeft) css += `border-left: ${styleObj.borderLeft}; `
        }
        if (styleObj.background && styleObj.background.includes("gradient")) {
          css += ` background: ${styleObj.background};`
        }
        break
      case "gradient":
        if (styleObj.background) {
          css = `background: ${styleObj.background};`
        }
        break
      case "image":
        Object.entries(styleObj).forEach(([key, value]) => {
          if (key.startsWith("background")) {
            css += `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}; `
          }
        })
        break
      case "animation":
        if (styleObj.animation) {
          css = `animation: ${styleObj.animation};`
        }
        break
    }

    setGeneratedCSS(css)
  }

  const renderControls = () => {
    switch (style.category) {
      case "boxshadow":
        return (
          <div className="space-y-4">
            <div>
              <Label>Horizontal Offset (X)</Label>
              <Slider
                value={[shadowValues.offsetX]}
                onValueChange={([value]) => updateShadow({ offsetX: value })}
                min={-50}
                max={50}
                step={1}
                className="mt-2"
              />
              <span className="text-xs text-gray-500">{shadowValues.offsetX}px</span>
            </div>

            <div>
              <Label>Vertical Offset (Y)</Label>
              <Slider
                value={[shadowValues.offsetY]}
                onValueChange={([value]) => updateShadow({ offsetY: value })}
                min={-50}
                max={50}
                step={1}
                className="mt-2"
              />
              <span className="text-xs text-gray-500">{shadowValues.offsetY}px</span>
            </div>

            <div>
              <Label>Blur Radius</Label>
              <Slider
                value={[shadowValues.blurRadius]}
                onValueChange={([value]) => updateShadow({ blurRadius: value })}
                min={0}
                max={100}
                step={1}
                className="mt-2"
              />
              <span className="text-xs text-gray-500">{shadowValues.blurRadius}px</span>
            </div>

            <div>
              <Label>Spread Radius</Label>
              <Slider
                value={[shadowValues.spreadRadius]}
                onValueChange={([value]) => updateShadow({ spreadRadius: value })}
                min={-50}
                max={50}
                step={1}
                className="mt-2"
              />
              <span className="text-xs text-gray-500">{shadowValues.spreadRadius}px</span>
            </div>

            <div>
              <Label>Shadow Color</Label>
              <Input
                type="color"
                value={shadowValues.color}
                onChange={(e) => updateShadow({ color: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Opacity</Label>
              <Slider
                value={[shadowValues.opacity]}
                onValueChange={([value]) => updateShadow({ opacity: value })}
                min={0}
                max={1}
                step={0.01}
                className="mt-2"
              />
              <span className="text-xs text-gray-500">{Math.round(shadowValues.opacity * 100)}%</span>
            </div>
          </div>
        )

      case "border":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="unified"
                checked={borderValues.unified}
                onChange={(e) => setBorderValues({ ...borderValues, unified: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="unified">Unified Border</Label>
            </div>

            {borderValues.unified ? (
              // Unified border controls
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
                    className="mt-2 w-full p-2 border rounded"
                  >
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
              // Individual side controls
              <div className="space-y-4">
                {["top", "right", "bottom", "left"].map((side) => (
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
                          className="mt-1 w-full p-1 border rounded text-xs"
                        >
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
        )

      case "gradient":
        return (
          <div className="space-y-4">
            <div>
              <Label>Start Color</Label>
              <Input
                type="color"
                defaultValue="#ff7e5f"
                onChange={(e) => {
                  const endColor = "#feb47b"
                  updateStyle("background", `linear-gradient(135deg, ${e.target.value} 0%, ${endColor} 100%)`)
                }}
                className="mt-2"
              />
            </div>
            <div>
              <Label>End Color</Label>
              <Input
                type="color"
                defaultValue="#feb47b"
                onChange={(e) => {
                  const startColor = "#ff7e5f"
                  updateStyle("background", `linear-gradient(135deg, ${startColor} 0%, ${e.target.value} 100%)`)
                }}
                className="mt-2"
              />
            </div>
          </div>
        )

      default:
        return <div className="text-sm text-gray-600">Advanced editing for this style type is coming soon!</div>
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose} modal>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-none" forceMount>
        <DialogHeader>
          <DialogTitle>Edit Style: {style.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-4">Preview</h3>
            <div
              className="w-full h-48 rounded-lg bg-white flex items-center justify-center text-gray-600 font-medium border"
              style={editedStyle}
            >
              <span className="text-sm opacity-75">{style.name}</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Controls</h3>
            <div className="max-h-96 overflow-y-auto">{renderControls()}</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <Label>Generated CSS</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(generatedCSS)}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy CSS
            </Button>
          </div>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm max-h-32 overflow-y-auto">{generatedCSS}</div>
        </div>
      </DialogContent>
      <style jsx>{`
        [data-state="open"] {
          animation: none !important;
        }
        [data-state="closed"] {
          animation: none !important;
        }
      `}</style>
    </Dialog>
  )
}
