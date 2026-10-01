import { DISCOUNT_OPTIONS, discountLabel } from "../../../models/Discount";

export const DiscountSelect: React.FC<{
  value: number;
  onChange: (percent: number) => void;
  ariaLabel: string;
}> = (props) => {
  return (
    <select
      className="form-select form-select-sm w-auto"
      value={props.value}
      onChange={(e) => props.onChange(Number(e.target.value))}
      aria-label={props.ariaLabel}
    >
      {DISCOUNT_OPTIONS.map((percent) => (
        <option key={percent} value={percent}>
          {discountLabel(percent)}
        </option>
      ))}
    </select>
  );
};
