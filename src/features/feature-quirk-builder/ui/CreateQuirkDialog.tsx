import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Import canon quirks
import { alterniaQuirks } from "../../feature-canon-quirks/data/alternia";
import { beforusQuirks } from "../../feature-canon-quirks/data/beforus";
import { cherubsQuirks } from "../../feature-canon-quirks/data/cherubs";
import { hiveswapQuirks } from "../../feature-canon-quirks/data/hiveswap";
import { spritesQuirks } from "../../feature-canon-quirks/data/sprites";
import type { Quirk } from "../utilities/quirk";

type QuirkAttribute = Quirk["attributes"][number];

interface CreateQuirkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: Id<"collections">;
  existingQuirks: Array<{
    _id: Id<"quirks">;
    name: string;
    description?: string;
    color: string;
    attributes: QuirkAttribute[];
  }>;
}

type PresetType = "blank" | "canon" | "existing";

const canonQuirksByGroup = {
  Alternia: alterniaQuirks,
  Beforus: beforusQuirks,
  Cherubs: cherubsQuirks,
  Hiveswap: hiveswapQuirks,
  Sprites: spritesQuirks,
};

export default function CreateQuirkDialog({
  open,
  onOpenChange,
  collectionId,
  existingQuirks,
}: CreateQuirkDialogProps) {
  const [presetType, setPresetType] = useState<PresetType>("blank");
  const [selectedCanonGroup, setSelectedCanonGroup] = useState<string>("");
  const [selectedCanonQuirk, setSelectedCanonQuirk] = useState<string>("");
  const [selectedExistingQuirk, setSelectedExistingQuirk] =
    useState<string>("");

  const createQuirk = useMutation(api.quirks.create);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      color: "#000000",
    },
    onSubmit: async ({ value }) => {
      let quirkData = {
        name: value.name,
        description: value.description,
        color: value.color,
        attributes: [] as QuirkAttribute[],
      };

      // Apply preset data if selected
      if (presetType === "canon" && selectedCanonGroup && selectedCanonQuirk) {
        const canonQuirks =
          canonQuirksByGroup[
            selectedCanonGroup as keyof typeof canonQuirksByGroup
          ];
        const canonQuirk = canonQuirks.find((q) => q.id === selectedCanonQuirk);
        if (canonQuirk) {
          quirkData = {
            name: canonQuirk.name,
            description: canonQuirk.description || "",
            color: canonQuirk.color,
            attributes: canonQuirk.attributes,
          };
        }
      } else if (presetType === "existing" && selectedExistingQuirk) {
        const existingQuirk = existingQuirks.find(
          (q) => q._id === selectedExistingQuirk,
        );
        if (existingQuirk) {
          quirkData = {
            name: `${existingQuirk.name} Copy`,
            description: existingQuirk.description || "",
            color: existingQuirk.color,
            attributes: existingQuirk.attributes,
          };
        }
      }

      await createQuirk({
        collectionId,
        ...quirkData,
      });

      // Reset form and close dialog
      form.reset();
      setPresetType("blank");
      setSelectedCanonGroup("");
      setSelectedCanonQuirk("");
      setSelectedExistingQuirk("");
      onOpenChange(false);
    },
  });

  const getSelectedCanonQuirks = () => {
    if (!selectedCanonGroup) return [];
    return (
      canonQuirksByGroup[
        selectedCanonGroup as keyof typeof canonQuirksByGroup
      ] || []
    );
  };

  const getPreviewQuirk = () => {
    if (presetType === "canon" && selectedCanonGroup && selectedCanonQuirk) {
      const canonQuirks = getSelectedCanonQuirks();
      return canonQuirks.find((q) => q.id === selectedCanonQuirk);
    } else if (presetType === "existing" && selectedExistingQuirk) {
      return existingQuirks.find((q) => q._id === selectedExistingQuirk);
    }
    return null;
  };

  const previewQuirk = getPreviewQuirk();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Quirk</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Preset Type Selection */}
          <div className="space-y-2">
            <Label>Create From</Label>
            <Select
              value={presetType}
              onValueChange={(value) => {
                setPresetType(value as PresetType);
                setSelectedCanonGroup("");
                setSelectedCanonQuirk("");
                setSelectedExistingQuirk("");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blank">Blank Quirk</SelectItem>
                <SelectItem value="canon">Canon Quirk Preset</SelectItem>
                {existingQuirks.length > 0 && (
                  <SelectItem value="existing">Copy Existing Quirk</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Canon Quirk Selection */}
          {presetType === "canon" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Canon Group</Label>
                <Select
                  value={selectedCanonGroup}
                  onValueChange={(value) => {
                    setSelectedCanonGroup(value);
                    setSelectedCanonQuirk("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a canon group" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(canonQuirksByGroup).map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCanonGroup && (
                <div className="space-y-2">
                  <Label>Canon Quirk</Label>
                  <Select
                    value={selectedCanonQuirk}
                    onValueChange={setSelectedCanonQuirk}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a canon quirk" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSelectedCanonQuirks().map((quirk) => (
                        <SelectItem key={quirk.id} value={quirk.id}>
                          {quirk.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Existing Quirk Selection */}
          {presetType === "existing" && existingQuirks.length > 0 && (
            <div className="space-y-2">
              <Label>Existing Quirk</Label>
              <Select
                value={selectedExistingQuirk}
                onValueChange={setSelectedExistingQuirk}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a quirk to copy" />
                </SelectTrigger>
                <SelectContent>
                  {existingQuirks.map((quirk) => (
                    <SelectItem key={quirk._id} value={quirk._id}>
                      {quirk.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Preview */}
          {previewQuirk && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-3 border rounded-md bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: previewQuirk.color }}
                  />
                  <span className="font-medium">{previewQuirk.name}</span>
                </div>
                {previewQuirk.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {previewQuirk.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {previewQuirk.attributes?.length || 0} transformation rules
                </p>
              </div>
            </div>
          )}

          {/* Custom Fields (only for blank quirks) */}
          {presetType === "blank" && (
            <>
              <Separator />
              <div className="space-y-4">
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? "Name is required" : undefined,
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Name *</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter quirk name"
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="description">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Description</Label>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter quirk description (optional)"
                        rows={3}
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="color">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          id={field.name}
                          name={field.name}
                          type="color"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-12 h-10 border border-input rounded-md cursor-pointer"
                        />
                        <Input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="#000000"
                          className="font-mono"
                        />
                      </div>
                    </div>
                  )}
                </form.Field>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={
                    !canSubmit ||
                    isSubmitting ||
                    (presetType === "canon" &&
                      (!selectedCanonGroup || !selectedCanonQuirk)) ||
                    (presetType === "existing" && !selectedExistingQuirk)
                  }
                >
                  {isSubmitting ? "Creating..." : "Create Quirk"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
