export const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t;
};

export const interpolatePath = (smallPath: string, bigPath: string, progress: number) => {
  const regex = /-?\d*\.?\d+/g;

  const small = smallPath.match(regex)!.map(Number);
  const big = bigPath.match(regex)!.map(Number);

  let index = 0;

  return bigPath.replace(regex, () => {
    const value = lerp(small[index], big[index], progress);

    index++;

    return value.toFixed(3);
  });
};
