const ILLEGAL = /[\\/:*?"<>|]/g;
const WHITESPACE = /\s+/g;
const REPEATED_DASH = /-+/g;

export function slugify(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed
    .replace(ILLEGAL, "-")
    .replace(WHITESPACE, "-")
    .replace(REPEATED_DASH, "-")
    .replace(/^-+|-+$/g, "");
}
