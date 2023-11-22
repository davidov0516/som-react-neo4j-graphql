import React, { FC } from 'react';

interface CheckBoxAndInputProps {
  value: string;
  checked: boolean;
  title: string;
  onInputChange: (value: string) => void;
  onCheckChange: (checked: boolean) => void;
}

const CheckBoxAndInput: FC<CheckBoxAndInputProps> = ({ value, checked, title, onInputChange, onCheckChange }) => {
  return (
    <>
      <div className="position-relative form-group">
        <label className="form-check-label">
          <input type="checkbox" className="form-check-input mr-1" checked={checked} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onCheckChange(event.target.checked);
          }} />
          {title}
        </label>
        <input type="date" className="form-control" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onInputChange(event.target.value);
        }} value={value} disabled={!checked} />
      </div>
    </>
  );
};

export default CheckBoxAndInput;













