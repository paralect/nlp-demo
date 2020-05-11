exports.rgbToHex = ({ red, green, blue }) => {
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`;
};
