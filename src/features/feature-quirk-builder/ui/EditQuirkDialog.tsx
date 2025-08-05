import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  HelpCircleIcon,
} from "lucide-react";
import type { Quirk } from "../utilities/quirk";

// Import canon quirks for presets
import { alterniaQuirks } from "../../feature-canon-quirks/data/alternia";
import { beforusQuirks } from "../../feature-canon-quirks/data/beforus";
import { cherubsQuirks } from "../../feature-canon-quirks/data/cherubs";
import { hiveswapQuirks } from "../../feature-canon-quirks/data/hiveswap";
import { spritesQuirks } from "../../feature-canon-quirks/data/sprites";

type QuirkAttribute =
  | {
      type: "simple";
      match: string;
      replacement: string;
      caseSensitive?: boolean;
      condition?: string;
      probability?: number;
    }
  | {
      type: "word";
      match: string;
      replacement: string;
      caseSensitive?: boolean;
      condition?: string;
      probability?: number;
    }
  | {
      type: "wordMatchCase";
      match: string;
      replacement: string;
      condition?: string;
      probability?: number;
    }
  | {
      type: "matchCase";
      match: string;
      replacement: string;
      condition?: string;
      probability?: number;
    }
  | {
      type: "regex";
      match: string;
      replacement: string;
      applyProbabilityToEachMatch?: boolean;
      caseSensitive?: boolean;
      condition?: string;
      probability?: number;
    }
  | { type: "prefix"; text: string; condition?: string; probability?: number }
  | { type: "suffix"; text: string; condition?: string; probability?: number }
  | {
      type: "emoticon";
      replacementEyes: string;
      replacementSmile: string;
      replacementFrown: string;
      condition?: string;
      probability?: number;
    }
  | {
      type: "random";
      match: string;
      replacements: string[];
      caseSensitive?: boolean;
      condition?: string;
      probability?: number;
    };

type EditQuirkFormData = {
  name: string;
  description: string;
  color: string;
  attributes: QuirkAttribute[];
};

type Props = {
  quirk: Quirk;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const attributeTypeLabels = {
  simple: "Simple Replace",
  word: "Word Replace",
  wordMatchCase: "Word Replace (Match Case)",
  matchCase: "Match Case",
  regex: "Regex Replace",
  prefix: "Prefix",
  suffix: "Suffix",
  emoticon: "Emoticon",
  random: "Random",
} as const;

const attributeDescriptions = {
  simple: "Replace any occurrence of text",
  word: "Replace whole words only",
  wordMatchCase: "Replace whole words, preserving case",
  matchCase: "Replace text, preserving case",
  regex: "Replace using regular expressions",
  prefix: "Add text to the beginning",
  suffix: "Add text to the end",
  emoticon: "Replace emoticons with custom text",
  random: "Randomly replace with one of multiple options",
} as const;

// Group quirks by series for better organization
const canonQuirksByGroup = {
  Alternia: alterniaQuirks,
  Beforus: beforusQuirks,
  Cherubs: cherubsQuirks,
  Hiveswap: hiveswapQuirks,
  Sprites: spritesQuirks,
} as const;

function AttributeForm({
  attribute,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  attribute: QuirkAttribute;
  onChange: (attribute: QuirkAttribute) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const updateAttribute = (
    updates: Partial<Record<string, string | number | boolean | string[]>>,
  ) => {
    onChange({ ...attribute, ...updates } as QuirkAttribute);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{attributeTypeLabels[attribute.type]}</h4>
          <div className="group relative">
            <HelpCircleIcon className="h-4 w-4 text-gray-400" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {attributeDescriptions[attribute.type]}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="h-8 w-8 p-0"
          >
            <ChevronUpIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="h-8 w-8 p-0"
          >
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Common fields based on attribute type */}
      {(attribute.type === "simple" ||
        attribute.type === "word" ||
        attribute.type === "wordMatchCase" ||
        attribute.type === "matchCase" ||
        attribute.type === "regex" ||
        attribute.type === "random") && (
        <div className="space-y-2">
          <Label>Match Text</Label>
          <Input
            value={attribute.match}
            onChange={(e) => updateAttribute({ match: e.target.value })}
            placeholder="Text to match"
          />
        </div>
      )}

      {(attribute.type === "simple" ||
        attribute.type === "word" ||
        attribute.type === "wordMatchCase" ||
        attribute.type === "matchCase" ||
        attribute.type === "regex") && (
        <div className="space-y-2">
          <Label>Replacement</Label>
          <Input
            value={attribute.replacement}
            onChange={(e) => updateAttribute({ replacement: e.target.value })}
            placeholder="Replacement text"
          />
        </div>
      )}

      {(attribute.type === "prefix" || attribute.type === "suffix") && (
        <div className="space-y-2">
          <Label>Text</Label>
          <Input
            value={attribute.text}
            onChange={(e) => updateAttribute({ text: e.target.value })}
            placeholder={
              attribute.type === "prefix"
                ? "Text to add at beginning"
                : "Text to add at end"
            }
          />
        </div>
      )}

      {attribute.type === "random" && (
        <div className="space-y-2">
          <Label>Replacement Options</Label>
          <Textarea
            value={attribute.replacements.join("\n")}
            onChange={(e) =>
              updateAttribute({
                replacements: e.target.value.split("\n").filter(Boolean),
              })
            }
            placeholder="One replacement option per line"
            rows={3}
          />
        </div>
      )}

      {attribute.type === "emoticon" && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Eyes</Label>
              <Input
                value={attribute.replacementEyes}
                onChange={(e) =>
                  updateAttribute({ replacementEyes: e.target.value })
                }
                placeholder=":"
              />
            </div>
            <div>
              <Label>Smile</Label>
              <Input
                value={attribute.replacementSmile}
                onChange={(e) =>
                  updateAttribute({ replacementSmile: e.target.value })
                }
                placeholder=")"
              />
            </div>
            <div>
              <Label>Frown</Label>
              <Input
                value={attribute.replacementFrown}
                onChange={(e) =>
                  updateAttribute({ replacementFrown: e.target.value })
                }
                placeholder="("
              />
            </div>
          </div>
        </div>
      )}

      {/* Case sensitive option for applicable types */}
      {(attribute.type === "simple" ||
        attribute.type === "word" ||
        attribute.type === "regex" ||
        attribute.type === "random") && (
        <div className="flex items-center space-x-2">
          <Switch
            checked={attribute.caseSensitive || false}
            onCheckedChange={(checked) =>
              updateAttribute({ caseSensitive: checked })
            }
          />
          <Label>Case Sensitive</Label>
        </div>
      )}

      {/* Regex specific options */}
      {attribute.type === "regex" && (
        <div className="flex items-center space-x-2">
          <Switch
            checked={attribute.applyProbabilityToEachMatch || false}
            onCheckedChange={(checked) =>
              updateAttribute({ applyProbabilityToEachMatch: checked })
            }
          />
          <Label>Apply Probability to Each Match</Label>
        </div>
      )}

      {/* Condition field for all types */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Condition (optional)</Label>
          <div className="group relative">
            <HelpCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded max-w-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal z-50">
              RegEx pattern which will only perform this attribute if the
              inputted text matches it. If left blank the attribute will always
              run. Note that this condition only runs once and not for every
              match. Use the{" "}
              <code className="bg-gray-600 px-1 rounded">Random</code> attribute
              instead to run a condition on each match.
            </div>
          </div>
        </div>
        <Input
          value={attribute.condition || ""}
          onChange={(e) =>
            updateAttribute({ condition: e.target.value || undefined })
          }
          placeholder="Optional condition"
        />
      </div>

      {/* Probability field for all types */}
      <div className="space-y-2">
        <Label>Probability (optional)</Label>
        <Input
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={attribute.probability || ""}
          onChange={(e) =>
            updateAttribute({
              probability: e.target.value
                ? parseFloat(e.target.value)
                : undefined,
            })
          }
          placeholder="0.0 - 1.0"
        />
      </div>
    </div>
  );
}

export function EditQuirkDialog({ quirk, open, onOpenChange }: Props) {
  const updateQuirk = useMutation(api.quirks.update);

  const form = useForm({
    defaultValues: {
      name: quirk.name,
      description: quirk.description || "",
      color: quirk.color,
      attributes: quirk.attributes,
    } as EditQuirkFormData,
    onSubmit: async ({ value }: { value: EditQuirkFormData }) => {
      try {
        await updateQuirk({
          id: quirk.id as Id<"quirks">,
          name: value.name,
          description: value.description || undefined,
          color: value.color,
          attributes: value.attributes,
        });
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to update quirk:", error);
      }
    },
  });

  const [attributes, setAttributes] = useState(quirk.attributes);

  // Update form when attributes change
  useEffect(() => {
    form.setFieldValue("attributes", attributes);
  }, [attributes, form]);

  const addAttribute = (type: QuirkAttribute["type"]) => {
    const newAttribute: QuirkAttribute = (() => {
      switch (type) {
        case "simple":
        case "word":
          return { type, match: "", replacement: "" };
        case "wordMatchCase":
        case "matchCase":
          return { type, match: "", replacement: "" };
        case "regex":
          return { type, match: "", replacement: "" };
        case "prefix":
        case "suffix":
          return { type, text: "" };
        case "emoticon":
          return {
            type,
            replacementEyes: ":",
            replacementSmile: ")",
            replacementFrown: "(",
          };
        case "random":
          return { type, match: "", replacements: [] };
      }
    })();

    setAttributes([...attributes, newAttribute]);
  };

  const updateAttribute = (index: number, updated: QuirkAttribute) => {
    const newAttributes = [...attributes];
    newAttributes[index] = updated;
    setAttributes(newAttributes);
  };

  const deleteAttribute = (index: number) => {
    const newAttributes = attributes.filter(
      (_: QuirkAttribute, i: number) => i !== index,
    );
    setAttributes(newAttributes);
  };

  const moveAttribute = (index: number, direction: "up" | "down") => {
    const newAttributes = [...attributes];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (
      targetIndex >= 0 &&
      targetIndex < newAttributes.length &&
      newAttributes[index] &&
      newAttributes[targetIndex]
    ) {
      [newAttributes[index], newAttributes[targetIndex]] = [
        newAttributes[targetIndex],
        newAttributes[index],
      ];
      setAttributes(newAttributes);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit Quirk</DialogTitle>
            <DialogDescription>
              Customize your quirk's properties and text transformation rules.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Basic Properties */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Properties</h3>

              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    if (!value || value.trim() === "") {
                      return "Quirk name is required";
                    }
                    if (value.trim().length < 2) {
                      return "Quirk name must be at least 2 characters";
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Name*</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Quirk name"
                      className={
                        field.state.meta.errors.length > 0
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {field.state.meta.errors.length > 0 && (
                      <div className="text-red-500 text-sm">
                        {field.state.meta.errors[0]}
                      </div>
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
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Optional description"
                      rows={2}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="color">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-12 h-10"
                      />
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="#6366f1"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                  </div>
                )}
              </form.Field>
            </div>

            <Separator />

            {/* Attributes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">
                    Text Transformation Rules
                  </h3>
                  <div className="group relative">
                    <HelpCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded max-w-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal z-50">
                      Most quirks can probably be easily created with RegEx
                      patterns, but they can be a little tricky to understand.
                      Some presets are provided below as a starting point, but
                      if you're ever stuck you can likely ask an AI chatbot to
                      make the pattern for you.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    onValueChange={(value) => {
                      if (value) {
                        addAttribute(value as QuirkAttribute["type"]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Add Rule..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(attributeTypeLabels).map(
                        ([type, label]) => (
                          <SelectItem key={type} value={type}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {attributes.length === 0 ? (
                <div className="space-y-6">
                  <div className="text-center py-4 text-gray-500">
                    <p>No transformation rules yet</p>
                    <p className="text-sm">
                      Add a rule using the dropdown above, or pick a preset
                      below
                    </p>
                  </div>

                  {/* Canon Quirk Presets */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-gray-700">
                      Pick a Canon Quirk Preset:
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(canonQuirksByGroup).map(
                        ([groupName, quirks]) => (
                          <div key={groupName} className="space-y-2">
                            <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                              {groupName}
                            </h5>
                            <div className="grid grid-cols-2 gap-2">
                              {quirks.map((canonQuirk) => (
                                <Button
                                  key={canonQuirk.id}
                                  variant="outline"
                                  size="sm"
                                  className="justify-start text-left h-auto py-2 px-3"
                                  onClick={() => {
                                    setAttributes(canonQuirk.attributes);
                                    form.setFieldValue("name", canonQuirk.name);
                                    form.setFieldValue(
                                      "color",
                                      canonQuirk.color,
                                    );
                                  }}
                                >
                                  <div className="flex items-center gap-2 w-full">
                                    <div
                                      className="w-3 h-3 rounded-full border flex-shrink-0"
                                      style={{
                                        backgroundColor: canonQuirk.color,
                                      }}
                                    />
                                    <span className="text-xs truncate">
                                      {canonQuirk.name}
                                    </span>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {attributes.map(
                    (attribute: QuirkAttribute, index: number) => (
                      <AttributeForm
                        key={`${attribute.type}-${index}`}
                        attribute={attribute}
                        onChange={(updated) => updateAttribute(index, updated)}
                        onDelete={() => deleteAttribute(index)}
                        onMoveUp={() => moveAttribute(index, "up")}
                        onMoveDown={() => moveAttribute(index, "down")}
                        canMoveUp={index > 0}
                        canMoveDown={index < attributes.length - 1}
                      />
                    ),
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
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
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
