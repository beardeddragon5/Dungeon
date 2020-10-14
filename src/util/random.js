
export function randInt(minValue, maxValue) {
  console.assert(maxValue > minValue, `maxValue=${maxValue} should be bigger than minValue=${minValue}`);
  const span = maxValue - minValue;
  return Math.trunc(Math.random() * span + minValue);
}
