export function extractStrings(obj: unknown): string[] {
  if (typeof obj === "string") return [obj];
  if (Array.isArray(obj)) return obj.flatMap(extractStrings);
  if (typeof obj === "object" && obj !== null)
    return Object.values(obj).flatMap(extractStrings);
  return [];
}

export function reconstruct(
  obj: unknown,
  replacements: string[],
  index: { value: number },
): unknown {
  if (typeof obj === "string") return replacements[index.value++];
  if (Array.isArray(obj))
    return obj.map((item) => reconstruct(item, replacements, index));
  if (typeof obj === "object" && obj !== null)
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [
        key,
        reconstruct(val, replacements, index),
      ]),
    );
  return obj;
}
