import slugify from "slugify";

export function convertToSlug(value: string) {
  return slugify(value, { lower: true });
}
