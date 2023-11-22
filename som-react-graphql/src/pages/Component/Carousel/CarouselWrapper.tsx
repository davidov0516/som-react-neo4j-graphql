import React, { useState } from 'react';
import Carousel from './Carousel';

const App: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  return (
    <Carousel images={images} changeImages={(newImages: string[]) => {
      setImages(newImages);
    }} editable={true} />
  );
};

export default App;