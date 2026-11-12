import { useId, type ReactNode } from 'react';

interface Option<T extends string> { value: T; label: string; icon?: ReactNode }
interface Props<T extends string> {
  legend: string;
  value: T;
  options: Array<Option<T>>;
  onChange: (v: T) => void;
}

/** Radio-group styled as a segmented control (native radios keep keyboard + screen-reader behaviour). */
export function Segmented<T extends string>({ legend, value, options, onChange }: Props<T>) {
  const name = useId();
  return (
    <fieldset className="segmented">
      <legend className="segmented__legend">{legend}</legend>
      <div className="segmented__row">
        {options.map((o) => (
          <label key={o.value} className={`segmented__opt ${o.value === value ? 'is-on' : ''}`}>
            <input type="radio" name={name} value={o.value} checked={o.value === value} onChange={() => onChange(o.value)} />
            {o.icon}
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
