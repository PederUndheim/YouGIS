export const getRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360); // Full hue range for a complete color spectrum
  const saturation = 50 + Math.random() * 50; // Saturation between 50% and 100% for vibrancy
  const lightness = 40 + Math.random() * 40; // Lightness between 40% and 80% for balanced brightness

  // Convert generated HSL to hex and return
  return hslToHex(hue, saturation, lightness);
};

export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // Convert to 2-digit hex
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};
