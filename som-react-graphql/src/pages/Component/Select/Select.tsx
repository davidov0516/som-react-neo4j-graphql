import React, { FC } from 'react';

interface SelectProps {
  data: any[];
  valueKey: string;
  titleKey: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Select: FC<SelectProps> = ({ data, valueKey, titleKey, value, onChange, placeholder, }) => {
  return (
    <select className="form-control" value={value} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(event.target.value);
    }}>
      {placeholder && placeholder !== "" &&
        <option value="" disabled>{placeholder}</option>
      }
      {data.map((item, i) => (
        <option key={i} value={item[valueKey]}>
          {item[titleKey]}
        </option>
      ))}
    </select>
  );
};

export default Select;