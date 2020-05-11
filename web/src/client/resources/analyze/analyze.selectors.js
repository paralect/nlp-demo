export function analyzeData({ analyze }) {
  return analyze.data ? analyze.data : null;
}

export function getTextErrors({ analyze }) {
  if (!analyze.errors) {
    return [];
  }

  const textErrors = analyze.errors.filter((e) => !!e.text).map((e) => e.text);
  return textErrors;
}

export function getImageError({ analyze }) {
  if (!analyze.errors) {
    return null;
  }

  const imageErrors = analyze.errors.filter((e) => !!e.image).map((e) => e.image);
  return imageErrors;
}
