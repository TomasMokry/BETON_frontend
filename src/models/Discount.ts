export const DISCOUNT_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 100] as const;

export const GIFT_PERCENT = 100;

export const discountLabel = (percent: number): string => {
  if (percent === 0) return "No discount";
  if (percent === GIFT_PERCENT) return "Gift (100 %)";
  return `-${percent} %`;
};
