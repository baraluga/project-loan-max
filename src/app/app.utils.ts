function createArrayFromRange(start, end): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => i);
}

export const Utils = {
  createArrayFromRange,
};
