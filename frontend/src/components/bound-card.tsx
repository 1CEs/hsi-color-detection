import React, { ChangeEvent } from "react";
import Input from "./input";
import Card from "./card/card";
import CardHeader from "./card/card-header";
import CardBody from "./card/card-body";

interface BoundCardProps {
  boundType: "Upper" | "Lower";
  hsi: HSIColor;
  onHSIValueChange: (
    e: ChangeEvent<HTMLInputElement>,
    name: keyof HSIColor,
    bound: "Upper" | "Lower"
  ) => void;
  rgb: { r: number; g: number; b: number } | null;
  hsl: { h: number; s: number; l: number };
}

const BoundCard: React.FC<BoundCardProps> = ({ boundType, hsi, onHSIValueChange, rgb, hsl }) => {
  const attrs:BoundCardAttrs[] = [
    {
      name: "h",
      placeholder: "0 - 360",
      range: { min: "0", max: "359", name: `range-h-${boundType.toLowerCase()}` },
      boxcss: "bg-hue-gradient",
    },
    {
      name: "s",
      placeholder: "0 - 1",
      range: { step: 0.01, min: "0", max: "1", name: `range-s-${boundType.toLowerCase()}` },
      boxcss: `linear-gradient(to right, hsl(0, 0%, 50%), hsl(${hsl.h}, 50%, 50%))`,
    },
    {
      name: "i",
      placeholder: "0 - 255",
      range: { min: "0", max: "255", name: `range-i-${boundType.toLowerCase()}` },
      boxcss: `linear-gradient(to right, hsl(0, ${hsl.s}%, 0%), hsl(${hsl.h}, 50%, 100%))`,
    },
  ];

  return (
    <Card className="p-8 gap-y-6">
      <CardHeader>
        <div className="flex items-center justify-center gap-x-3">
          <h1 className="text-3xl">HSI {boundType} Bound</h1>
        </div>
      </CardHeader>
      <CardBody className="gap-y-6 ">
        <form className="flex flex-col gap-y-3">
          <div className="flex gap-x-6">
            {attrs.map((attr, idx) => (
              <div className="flex flex-col gap-y-2" key={idx}>
                <div className="flex gap-x-2 w-[250px] justify-between items-center">
                  <label className="text-lg">{attr.name.toUpperCase()}:</label>
                  <Input
                    onChange={(e) => onHSIValueChange(e, attr.name, boundType)}
                    value={hsi[attr.name]}
                    className=" text-center w-[60px] placeholder:text-sm placeholder:text-center"
                    placeholder={attr.placeholder}
                  />
                </div>
                <div className="flex flex-col gap-y-5">
                  <Input
                    className="w-full h-4"
                    onChange={(e) => onHSIValueChange(e, attr.name, boundType)}
                    value={hsi[attr.name]}
                    {...attr.range}
                    type="range"
                  />
                  <div
                    className={`h-5 ${attr.boxcss}`}
                    style={{ background: attr.name === "h" ? "" : attr.boxcss }}
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-x-3">
            <div
              className="w-5 h-5"
              style={{ backgroundColor: `rgb(${rgb?.r}, ${rgb?.g}, ${rgb?.b})` }}
            />
            {rgb && <label>RGB: ({rgb.r}, {rgb.g}, {rgb.b})</label>}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default BoundCard;