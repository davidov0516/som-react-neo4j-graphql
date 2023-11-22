import React, { useState, useContext, useEffect } from 'react';
import Modal from '../Component/Modal/Modal';
import { SharedContext } from '../DataContext';
import ModelFuncs from '../../models/ModelMain';
import ShipModel from '../../models/ShipModel';
import MarinerModel from '../../models/MarinerModel';
import CertificateModel from '../../models/CertificatesModel';

const ModalWrapper: React.FC = () => {
  let modalTitle = "Delete";
  let modalID = "delete-confirm-modal";

  const { sharedObject, setSharedObject } = useContext(SharedContext);
  const [currentItem, setCurrentItem] = useState<{
    _id: string,
    title: string,
    table: string,
  }>({
    _id: "",
    title: "",
    table: "",
  });

  useEffect(() => {
    setCurrentItem(sharedObject);
  }, [sharedObject]);

  const onConfirmClick = () => {
    switch (currentItem.table) {
      case "certificateTypeShip":
      case "certificateTypePersonal":
        ModelFuncs.delete("certificatetype", currentItem._id).then(
          (result) => {
            setSharedObject({});
          }
        );
        break;

      case "certificateShip":
      case "certificatePersonal":
        CertificateModel.delete(currentItem._id).then(
          (result) => {
            setSharedObject({});
          }
        );
        break;

      case "waterarea":
        ModelFuncs.delete("waterarea", currentItem._id).then(
          (result) => {
            setSharedObject({});
          }
        );
        break;

      case "charterer":
        ModelFuncs.delete("charterer", currentItem._id).then(
          (result) => {
            setSharedObject({});
          }
        );
        break;

      case "ship":
        ShipModel.delete(currentItem._id).then((result) => {
          setSharedObject({});
        });
        break;

      case "mariner":
        MarinerModel.delete(currentItem._id).then((result) => {
          setSharedObject({});
        });
        break;

      default:
        break;
    }
  }

  return (
    <Modal
      modalTitle={modalTitle}
      modalID={modalID}
      onConfirmClick={onConfirmClick}
      content={
        <div className="position-relative form-group text-center">
          <h5>{currentItem.title ? currentItem.title : ""}</h5>
          <p>Are you sure you want to delete this item?</p>
        </div>
      }
    />
  );
};

export default ModalWrapper;
