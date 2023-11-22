import React, { useState } from 'react';
import Select from './Select';

const App: React.FC = () => {
  let data: { id: number, name: string }[] = [
    {
      id: 1,
      name: "Apple",
    },
    {
      id: 2,
      name: "Banana",
    },
    {
      id: 3,
      name: "Lemon",
    },
  ];

  const [value, setValue] = useState('');

  const handleSelectChange = (value: string) => {
    setValue(value);
  };

  return (
    <>
      <Select
        data={data}
        valueKey="id"
        titleKey="name"
        value={value}
        onChange={handleSelectChange}
      />
      <div className="mt-3 text-center">Selected Value: {value}.</div>
    </>
  );
};

export default App;