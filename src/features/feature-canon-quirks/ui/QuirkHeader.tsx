import { Tile } from "@/components/Tile";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuirkContext } from "../../feature-quirk-builder/ui/QuirkContext";

export type PresetType =
  | "All"
  | "Alternia"
  | "Beforus"
  | "Cherubs"
  | "Sprites"
  | "Hiveswap";

type CanonQuirksHeaderProps = {
  selectedPreset: PresetType;
  setSelectedPreset: (preset: PresetType) => void;
};

export function CanonQuirksHeader({
  selectedPreset,
  setSelectedPreset,
}: CanonQuirksHeaderProps) {
  const { inputText, setInputText } = useQuirkContext();

  return (
    <Tile className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Canon Quirks</h1>
          <div className="flex items-center gap-2">
            <Label htmlFor="preset-select">Preset:</Label>
            <Select
              value={selectedPreset}
              onValueChange={(value) => {
                setSelectedPreset(value as PresetType);
              }}
            >
              <SelectTrigger id="preset-select" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Alternia">Alternia</SelectItem>
                <SelectItem value="Beforus">Beforus</SelectItem>
                <SelectItem value="Cherubs">Cherubs</SelectItem>
                <SelectItem value="Sprites">Sprites</SelectItem>
                <SelectItem value="Hiveswap">Hiveswap</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="quirk-input">Input text</Label>
          <Textarea
            id="quirk-input"
            placeholder="Enter text to transform..."
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            rows={3}
            className="resize-none"
          />
        </div>
      </div>
    </Tile>
  );
}
