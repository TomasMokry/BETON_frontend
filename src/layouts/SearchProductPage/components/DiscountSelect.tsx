import { DISCOUNT_OPTIONS, discountLabel } from "../../../models/Discount";

export const DiscountSelect: React.FC<{
  value: number;
  onChange: (percent: number) => void;
  ariaLabel: string;
  disabled?: boolean;
}> = (props) => {
  return (
    <select
      className={`form-select form-select-sm discount-select${props.value > 0 ? " is-active" : ""}`}
      value={props.value}
      onChange={(e) => props.onChange(Number(e.target.value))}
      disabled={props.disabled}
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
