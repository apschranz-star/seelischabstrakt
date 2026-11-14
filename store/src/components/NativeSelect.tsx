/* A select the device draws itself, inside Astryx's Field shell (label,
   description, status). On a phone the system picker is the better control,
   and it needs no CSS anchor positioning, which Astryx's own Selector does
   and which iPhones before iOS 26 do not have. */
import {useId} from 'react';
import {Field} from '@astryxdesign/core/Field';

export interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  description?: string;
  error?: string;
  isRequired?: boolean;
  isLabelHidden?: boolean;
  name?: string;
  autoComplete?: string;
  size?: 'sm' | 'md';
}

export function NativeSelect(p: Props) {
  const id = useId();
  const messageID = `${id}-msg`;
  return (
    <Field
      label={p.label}
      inputID={id}
      description={p.description}
      isRequired={p.isRequired || undefined}
      isLabelHidden={p.isLabelHidden}
      status={p.error ? {type: 'error', message: p.error, messageID} : undefined}
      statusVariant="detached"
      width="100%">
      <select
        id={id}
        className={`sa-select${p.size === 'sm' ? ' sm' : ''}`}
        name={p.name}
        value={p.value}
        required={p.isRequired}
        autoComplete={p.autoComplete}
        aria-invalid={p.error ? true : undefined}
        aria-describedby={p.error ? messageID : undefined}
        onChange={(e) => p.onChange(e.target.value)}>
        {p.placeholder !== undefined && <option value="">{p.placeholder}</option>}
        {p.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
