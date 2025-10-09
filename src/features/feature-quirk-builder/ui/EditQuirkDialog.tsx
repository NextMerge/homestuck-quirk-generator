import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import * as Sentry from "@sentry/react";
import { toast } from "sonner";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Trash2Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  HelpCircleIcon,
  PlusIcon,
} from "lucide-react";
import type { Quirk } from "../utilities/quirk";
import { isValidRegex } from "../utilities/quirk";
import { ATTRIBUTE_COUNT_MAX } from "convex/limits";

type QuirkAttribute = Quirk["attributes"][number];

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
  word: "Will match the characters provided so long as they are surrounded by word boundaries (spaces, commas, periods, quotes).",
  wordMatchCase:
    "Replace whole words, preserving case. Example: foo → bar would match 'foo' → 'bar', 'Foo' → 'Bar', 'FOO' → 'BAR'.",
  matchCase:
    "Replace text, preserving case. Example: foo → bar would match 'foo' → 'bar', 'Foo' → 'Bar', 'FOO' → 'BAR'.",
  regex:
    "Replace using regular expressions. Take a look at the preset quirks to see examples of how to use this",
  prefix: "Add text to the beginning",
  suffix: "Add text to the end",
  emoticon: "Replace emoticons with custom text",
  random: "Randomly replace with one of multiple options",
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

  // Validation helpers
  const isMatchPatternInvalid = () => {
    if (
      (attribute.type === "regex" || attribute.type === "random") &&
      attribute.match
    ) {
      return !isValidRegex(attribute.match);
    }
    return false;
  };

  const isConditionPatternInvalid = () => {
    if (attribute.condition) {
      return !isValidRegex(attribute.condition);
    }
    return false;
  };

  // Generate descriptive header text based on attribute type and content
  const getAttributeDescription = () => {
    const typeLabel = attributeTypeLabels[attribute.type];

    switch (attribute.type) {
      case "simple":
      case "word":
      case "wordMatchCase":
      case "matchCase":
      case "regex":
        return `${typeLabel}: "${attribute.match || "?"}" → "${attribute.replacement || "?"}"`;
      case "random": {
        const optionsCount = attribute.replacements?.length || 0;
        return `${typeLabel}: "${attribute.match || "?"}" → ${optionsCount} option${optionsCount !== 1 ? "s" : ""}`;
      }
      case "prefix":
        return `${typeLabel}: "${attribute.text || "?"}"`;
      case "suffix":
        return `${typeLabel}: "${attribute.text || "?"}"`;
      case "emoticon": {
        const eyes = attribute.replacementEyes || "?";
        const smile = attribute.replacementSmile || "?";
        const frown = attribute.replacementFrown || "?";
        return `${typeLabel}: eyes: ${eyes}, smile: ${smile}, frown: ${frown}`;
      }
      default:
        return typeLabel;
    }
  };

  return (
    <div className="border rounded-lg">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="attribute" className="border-none">
          <div className="flex items-center justify-between w-full">
            <AccordionTrigger className="flex-1 text-left hover:no-underline py-3 px-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {getAttributeDescription()}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{attributeDescriptions[attribute.type]}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </AccordionTrigger>

            {/* Move and delete buttons */}
            <div className="flex items-center gap-1 px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveUp}
                disabled={!canMoveUp}
                className="h-8 w-8 p-0"
                aria-label="Move attribute up"
              >
                <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveDown}
                disabled={!canMoveDown}
                className="h-8 w-8 p-0"
                aria-label="Move attribute down"
              >
                <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                aria-label="Delete attribute"
              >
                <Trash2Icon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <AccordionContent className="px-4 pb-4">
            <Accordion
              type="multiple"
              defaultValue={["basic"]}
              className="w-full"
            >
              {/* Basic Configuration Section */}
              <AccordionItem value="basic">
                <AccordionTrigger className="text-sm font-medium">
                  Basic Configuration
                  <span className="text-xs text-muted-foreground ml-2">
                    {attribute.type === "random"
                      ? "Match text and replacement options"
                      : attribute.type === "emoticon"
                        ? "Emoticon replacement settings"
                        : attribute.type === "prefix" ||
                            attribute.type === "suffix"
                          ? `Text to ${attribute.type === "prefix" ? "prepend" : "append"}`
                          : "Match and replacement text"}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {/* Match Text */}
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
                        onChange={(e) =>
                          updateAttribute({ match: e.target.value })
                        }
                        placeholder="Text to match"
                        className={
                          isMatchPatternInvalid()
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }
                      />
                      {isMatchPatternInvalid() && (
                        <p className="text-sm text-red-600">
                          Invalid regular expression pattern
                        </p>
                      )}
                    </div>
                  )}

                  {/* Replacement Text */}
                  {(attribute.type === "simple" ||
                    attribute.type === "word" ||
                    attribute.type === "wordMatchCase" ||
                    attribute.type === "matchCase" ||
                    attribute.type === "regex") && (
                    <div className="space-y-2">
                      <Label>Replacement</Label>
                      <Input
                        value={attribute.replacement}
                        onChange={(e) =>
                          updateAttribute({ replacement: e.target.value })
                        }
                        placeholder="Replacement text"
                      />
                    </div>
                  )}

                  {/* Text for prefix/suffix */}
                  {(attribute.type === "prefix" ||
                    attribute.type === "suffix") && (
                    <div className="space-y-2">
                      <Label>Text</Label>
                      <Input
                        value={attribute.text}
                        onChange={(e) =>
                          updateAttribute({ text: e.target.value })
                        }
                        placeholder={
                          attribute.type === "prefix"
                            ? "Text to add at beginning"
                            : "Text to add at end"
                        }
                      />
                    </div>
                  )}

                  {/* Random replacement options */}
                  {attribute.type === "random" && (
                    <div className="space-y-2">
                      <Label>Replacement Options</Label>
                      <Textarea
                        value={attribute.replacements.join("\n")}
                        onChange={(e) =>
                          updateAttribute({
                            replacements: e.target.value.split("\n"),
                          })
                        }
                        placeholder="One replacement option per line"
                        rows={4}
                      />
                    </div>
                  )}

                  {/* Emoticon settings */}
                  {attribute.type === "emoticon" && (
                    <div className="space-y-2">
                      <Label>Emoticon Components</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Eyes</Label>
                          <Input
                            value={attribute.replacementEyes}
                            onChange={(e) =>
                              updateAttribute({
                                replacementEyes: e.target.value,
                              })
                            }
                            placeholder=":"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Smile</Label>
                          <Input
                            value={attribute.replacementSmile}
                            onChange={(e) =>
                              updateAttribute({
                                replacementSmile: e.target.value,
                              })
                            }
                            placeholder=")"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Frown</Label>
                          <Input
                            value={attribute.replacementFrown}
                            onChange={(e) =>
                              updateAttribute({
                                replacementFrown: e.target.value,
                              })
                            }
                            placeholder="("
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Advanced Options Section */}
              <AccordionItem value="advanced">
                <AccordionTrigger className="text-sm font-medium">
                  Advanced Options
                  <span className="text-xs text-muted-foreground ml-2">
                    Case sensitivity, conditions, and probability
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {/* Case sensitive option */}
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

                  {/* Condition field */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Condition (optional)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p>
                            RegEx pattern which will only perform this attribute
                            if the inputted text matches it. If left blank the
                            attribute will always run. Note that this condition
                            only runs once and not for every match. Use the{" "}
                            <code className="bg-gray-800 text-gray-200 px-1 rounded">
                              Random
                            </code>{" "}
                            attribute instead to run a condition on each match.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      value={attribute.condition || ""}
                      onChange={(e) =>
                        updateAttribute({
                          condition: e.target.value || undefined,
                        })
                      }
                      placeholder="Optional RegEx condition"
                      className={
                        isConditionPatternInvalid()
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }
                    />
                    {isConditionPatternInvalid() && (
                      <p className="text-sm text-red-600">
                        Invalid regular expression pattern
                      </p>
                    )}
                  </div>

                  {/* Probability field */}
                  <div className="space-y-2">
                    <Label>Probability (optional)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={attribute.probability ?? ""}
                      onChange={(e) =>
                        updateAttribute({
                          probability: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="0.0 - 1.0 (leave empty for always)"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function EditQuirkDialog({ quirk, open, onOpenChange }: Props) {
  const updateQuirk = useMutation(api.quirks.update);
  const deleteQuirk = useMutation(api.quirks.remove);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
        toast.success("Quirk updated successfully!");
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to update quirk:", error);
        Sentry.captureException(error, {
          tags: {
            action: "updateQuirk",
          },
          extra: {
            quirkId: quirk.id,
            quirkName: quirk.name,
            attributeCount: value.attributes.length,
          },
        });
        toast.error("Failed to update quirk. Please try again.");
      }
    },
  });

  const [attributes, setAttributes] = useState(quirk.attributes);

  // Update form when attributes change
  useEffect(() => {
    form.setFieldValue("attributes", attributes);
  }, [attributes, form]);

  // Reset delete confirmation when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setShowDeleteConfirmation(false);
      setIsDeleting(false);
    }
  }, [open]);

  const addAttribute = (type: QuirkAttribute["type"]) => {
    // Prevent adding attributes beyond the limit
    if (attributes.length >= ATTRIBUTE_COUNT_MAX) {
      return;
    }

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
            replacementEyes: "",
            replacementSmile: "",
            replacementFrown: "",
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

  const handleDelete = async () => {
    if (!showDeleteConfirmation) {
      setShowDeleteConfirmation(true);
      return;
    }

    try {
      setIsDeleting(true);
      await deleteQuirk({ id: quirk.id as Id<"quirks"> });
      toast.success("Quirk deleted successfully!");
      onOpenChange(false);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Failed to delete quirk:", error);
      Sentry.captureException(error, {
        tags: {
          action: "deleteQuirk",
        },
        extra: {
          quirkId: quirk.id,
          quirkName: quirk.name,
        },
      });
      toast.error("Failed to delete quirk. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
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
                        autoComplete="off"
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
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">
                    Text Transformation Rules
                  </h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                      <p>
                        Most quirks can probably be easily created with RegEx
                        patterns, but they can be a little tricky to understand.
                        Some presets are provided below as a starting point, but
                        if you're ever stuck you can likely ask an AI chatbot to
                        make the pattern for you.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {attributes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No transformation rules yet</p>
                    <p className="text-sm">
                      Add your first rule using the button below
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {attributes.map(
                      (attribute: QuirkAttribute, index: number) => (
                        <AttributeForm
                          key={`${attribute.type}-${index}`}
                          attribute={attribute}
                          onChange={(updated) =>
                            updateAttribute(index, updated)
                          }
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

                {/* Add Rule Button */}
                <div className="flex justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={attributes.length >= ATTRIBUTE_COUNT_MAX}
                        title={
                          attributes.length >= ATTRIBUTE_COUNT_MAX
                            ? `Maximum ${ATTRIBUTE_COUNT_MAX} attributes per quirk`
                            : "Add a new transformation rule"
                        }
                      >
                        <PlusIcon className="h-4 w-4" />
                        Add Rule
                        {attributes.length >= ATTRIBUTE_COUNT_MAX && (
                          <span className="text-xs text-gray-500">
                            (Max {ATTRIBUTE_COUNT_MAX})
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-56">
                      {Object.entries(attributeTypeLabels).map(
                        ([type, label]) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() =>
                              addAttribute(type as QuirkAttribute["type"])
                            }
                            className="cursor-pointer"
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{label}</span>
                              <span className="text-xs text-muted-foreground">
                                {
                                  attributeDescriptions[
                                    type as keyof typeof attributeDescriptions
                                  ]
                                }
                              </span>
                            </div>
                          </DropdownMenuItem>
                        ),
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                {!showDeleteConfirmation ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    Delete
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelDelete}
                      disabled={isDeleting}
                    >
                      Cancel Delete
                    </Button>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <Button
                      type="submit"
                      disabled={!canSubmit || isSubmitting || isDeleting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
