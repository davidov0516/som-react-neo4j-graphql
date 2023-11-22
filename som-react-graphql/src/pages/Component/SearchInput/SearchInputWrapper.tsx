import React, { useState } from "react";
import SearchInput from "./SearchInput";

const App: React.FC = () => {
  const data = [
    "Apple",
    "Banana",
    "Lemon",
    "Pineapple",
    "Strawberry",
    "Berry",
    "Watermelon",
    "Melon",
    "Grapes",
    "Papaya",
    "Guava",
    "Mango",
    "Pear",
    "Peach",
    "Pomegranate"
  ];

  const [value, setValue] = useState("");

  return (
    <>
      <p>Input Fruit Name.</p>
      <div>
        <SearchInput data={data} value={value} onChange={(value: string) => {
          setValue(value);
        }} />
        <div className="mt-3">Selected Value: {value}.</div>
      </div>
    </>
  );
};

export default App;