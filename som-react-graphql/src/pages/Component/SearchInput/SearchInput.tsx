import React, { useState } from "react";

interface SearchInputProps {
  id?: string;
  data: string[];
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ id, data, value, onChange }) => {
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [recommendVisible, setRecommendVisible] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);

    const inputValue = event.target.value;
    const filtered = data.filter(
      fruit =>
        fruit && fruit.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredData(filtered);
    setRecommendVisible(true);
  };

  const handleRecommendClick = (fruit: string) => {
    setRecommendVisible(false);
    onChange(fruit);
    // Update the value
  };

  return (
    <div className="position-relative">
      <input
        id={id}
        className="form-control"
        value={value}
        onChange={handleInputChange}
      />

      {recommendVisible && value && (
        <div className="search-recommends form-control" style={{
          background: "white",
          height: "max-content",
          position: "absolute",
          marginTop: 3,
          zIndex: 999,
        }}
        >
          {filteredData.length ? (
            filteredData.map(fruit => (
              <div
                className="cursor-pointer"
                key={fruit}
                onClick={(e) => {
                  // e.preventDefault();
                  handleRecommendClick(fruit);
                }}
              >
                {fruit}
              </div>
            ))
          ) : (
            <div>Nothing found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;