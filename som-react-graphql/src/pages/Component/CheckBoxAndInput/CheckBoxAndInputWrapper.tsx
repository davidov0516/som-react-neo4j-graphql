import React from 'react';
import CheckBoxAndInput from './CheckBoxAndInput';
import { useState } from 'react';

const App: React.FC = () => {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);

  return (
    <>
      <CheckBoxAndInput title="Check Box" value={value} checked={checked}
        onInputChange={(value: string) => {
          setValue(value);
        }}
        onCheckChange={(isChecked: boolean) => {
          setChecked(isChecked);
        }} />
      <div className="mt-3">
        <h5>Checked: {checked.toString()}</h5>
        <h5>Value: {checked ? value : ""}</h5>
      </div>
    </>
  );
};

export default App;





