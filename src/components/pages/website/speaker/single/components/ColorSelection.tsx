import { SpeakerColor } from "../type";

const ColorSelection = ({
  colors,
  selectedColor,
  onColorChange,
}: {
  colors: SpeakerColor[];
  selectedColor: SpeakerColor;
  onColorChange: (color: SpeakerColor) => void;
}) => (
  <div className="flex flex-col gap-4 md:gap-4 w-full">
    <p className="text-base md:text-xl-bold text-gray-25">
      رنگ: {selectedColor.name}
    </p>
    <div className="flex gap-3">
      {colors.map((color) => (
        <button
          key={color.id}
          onClick={() => onColorChange(color)}
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full transition-all cursor-pointer ${
            selectedColor.id === color.id
              ? "outline-offset-[5px] outline-1 outline-base-white outline"
              : "outline-gray-600 hover:outline-offset-2 hover:outline-1"
          }`}
          style={{ backgroundColor: color.hexColor }}
        />
      ))}
    </div>
  </div>
);

export default ColorSelection;
