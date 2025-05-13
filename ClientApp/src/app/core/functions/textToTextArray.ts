export function textToTextArray(detail: string) {
  if (!detail.includes(" to ")) return []; // Handle missing or invalid details

  // Split details into array of objects and destructure values
  return detail.split(" | ").map((entry) => {
    const [field, values] = entry.split(": ");
    const [oldValue, newValue] = values.split(" to ");
    return { field, oldValue, newValue };
  });
}
