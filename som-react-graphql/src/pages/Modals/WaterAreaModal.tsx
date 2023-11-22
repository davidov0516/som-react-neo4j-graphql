import React, { useState, useContext, useEffect } from 'react';
import Modal from '../Component/Modal/Modal';
import { SharedContext } from '../DataContext';
import WaterAreaModel from '../../models/WaterAreaModel';
import ModelFuncs from '../../models/ModelMain';

interface WaterArea {
  _id: string;
  name: string;
  note: string;
}

const ModalWrapper: React.FC = () => {
  let modalTitle = "WATER AREA";
  let modalID = "waterarea-modal";

  const { sharedObject, setSharedObject } = useContext(SharedContext);
  const [currentItem, setCurrentItem] = useState<WaterArea>({
    _id: "",
    name: "",
    note: "",
  });

  useEffect(() => {
    if (sharedObject.table !== "waterarea") {
      return;
    }

    if (sharedObject._id) {
      WaterAreaModel.getAll({ filter: { _id: sharedObject._id } }).then((items: any) => {
        setCurrentItem(items[0]);
      });
    } else {
      setCurrentItem({
        _id: "",
        name: "",
        note: "",
      });
    }
  }, [sharedObject]);

  const onConfirmClick = () => {
    ModelFuncs.put("waterarea", {
      ...currentItem,
    }).then((result) => {
      setSharedObject({});
    });
  }

  return (
    <Modal
      modalTitle={modalTitle}
      modalID={modalID}
      onConfirmClick={onConfirmClick}
      content={
        <>
          <div className="position-relative form-group">
            <label htmlFor="waterarea-modal-name">Name</label>
            <input
              id="waterarea-modal-name"
              className="form-control"
              value={currentItem.name}
              onChange={(e) =>
                setCurrentItem((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className="position-relative form-group">
            <label htmlFor="waterarea-modal-note">Note</label>
            <textarea
              id="waterarea-modal-note"
              className="form-control"
              value={currentItem.note}
              onChange={(e) =>
                setCurrentItem((prev) => ({
                  ...prev,
                  note: e.target.value,
                }))
              }
            />
          </div>
        </>
      }
    />
  );
};

export default ModalWrapper;
