import { Tile } from "@/components/Tile";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuirkContext } from "../../feature-quirk-builder/ui/QuirkContext";

export function CanonQuirksHeader() {
  const { inputText, setInputText } = useQuirkContext();

  return (
    <Tile className="p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Canon Quirks</h1>
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
