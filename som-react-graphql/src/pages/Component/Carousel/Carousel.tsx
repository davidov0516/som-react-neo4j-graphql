import React, { FC, useRef, useState } from 'react';
import ModelFuncs from '../../../models/ModelMain';
import styles from './Carousel.module.css';

interface CarouselProps {
  images: string[];
  editable?: boolean;
  changeImages?: (newImages: string[]) => void;
}

const Carousel: FC<CarouselProps> = ({ images, editable = false, changeImages }) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const shipImg1 = useRef<HTMLImageElement>(null);
  const shipImg2 = useRef<HTMLImageElement>(null);
  const [imageChanging, setImageChanging] = useState(false);

  const onImageChange = (image: string) => {
    if (imageChanging) {
      return;
    }

    if (shipImg2.current) {
      shipImg2.current.src = `${ModelFuncs.getServerUrl()}/uploads/${image}`;
    }

    setImageChanging(true);

    setTimeout(() => {
      setImageChanging(false);

      if (shipImg1.current) {
        shipImg1.current.src = `${ModelFuncs.getServerUrl()}/uploads/${image}`;
      }
    }, 500);
  }

  const onPlusImage = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    fetch(`${ModelFuncs.getServerUrl()}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        images.push(data.filename);
        if (changeImages) {
          changeImages([...images]);
        }
      });
  }

  return (
    <div className="form-row mb-5">
      <div className="col-md-8">
        <div
          style={{
            height: 400,
            overflow: "hidden",
            boxShadow: "0px 0px 5px rgb(0,0,0,0.3)",
          }} >
          <img
            ref={shipImg1}
            alt="ship"
            className={`${styles.carouselImage} ${styles.carouselImage1}`}
            src={images.length
              ? `${ModelFuncs.getServerUrl()}/uploads/${images[0]}`
              : "/assets/images/ships/placeholder.png"}
            width="100%"
          />
          <img
            ref={shipImg2}
            alt="ship"
            className={`${styles.carouselImage} ${styles.carouselImage2} ${imageChanging ? styles.changing : ""}`}
            src={images.length
              ? `${ModelFuncs.getServerUrl()}/uploads/${images[0]}`
              : "/assets/images/ships/placeholder.png"}
            width="100%"
          />
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-row">
          {(images ?? []).map((image, i) => (
            <div className="col-md-4 mb-2" key={i}>
              <div className="image-wrapper">
                <a href="/" onClick={(e) => {
                  e.preventDefault();
                  onImageChange(image);
                }}>
                  <img
                    alt="ship"
                    src={`${ModelFuncs.getServerUrl()}/uploads/${image}`}
                    width="100"
                    height="57"
                  />
                </a>
              </div>
            </div>
          ))}

          {editable &&
            <div className="col-md-4">
              <div className="image-wrapper">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    if (fileInput.current) {
                      fileInput.current.click();
                    }
                  }}
                ><img
                    alt="plus"
                    src="/assets/images/ships/ship-plus.png"
                    className="cursor-pointer"
                    width="100"
                    height="57"
                  /></a
                >
                <input
                  className="d-none"
                  type="file"
                  ref={fileInput}
                  onChange={(event) => {
                    if (event.target.files && event.target.files.length) {
                      onPlusImage(event.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Carousel;
