export function estimateTimeComplexity(code: string): string {
  const normalized = code.toLowerCase();

  if (normalized.includes("for") && normalized.includes("for")) return "O(n²)";
  if (normalized.includes("for") && normalized.includes("while")) return "O(n²)";
  if (normalized.includes("for")) return "O(n)";
  if (normalized.includes("while")) return "O(n)";
  if (normalized.includes("recursion") || normalized.includes("factorial")) return "O(2^n)";
  if (normalized.includes("sort")) return "O(n log n)";

  return "O(1)";
}
