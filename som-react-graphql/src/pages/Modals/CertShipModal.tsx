import React, { useState, useContext, useEffect } from 'react';
import Modal from '../Component/Modal/Modal';
import Select from '../Component/Select/Select';
import { useNavigate } from "react-router-dom";
import { SharedContext } from '../DataContext';
import CertificateModel from '../../models/CertificatesModel';
import ShipModel from '../../models/ShipModel';
import CertificateTypeModel from '../../models/CertificateTypeModel';

interface CertificateType {
  _id: string;
  certificateTypeId: string;
  shipId: string;
}

const ModalWrapper: React.FC = () => {
  const navigate = useNavigate();
  const modalTitle = "CERTIFICATE";
  const modalID = "cert-ship-modal";

  const { sharedObject, setSharedObject } = useContext(SharedContext);
  const [ships, setShips] = useState<any[]>([]);
  const [certificateTypes, setCertificateTypes] = useState<any[]>([]);
  const [currentItem, setCurrentItem] = useState<CertificateType>({
    _id: "",
    certificateTypeId: "",
    shipId: "",
  });

  useEffect(() => {
    if (sharedObject.table !== "certificateShip") {
      return;
    }

    if (sharedObject._id) {
      CertificateModel.getAll({ filter: { _id: sharedObject._id } }).then(
        (items) => {
          setCurrentItem({
            _id: items[0]._id,
            shipId: items[0].shipId,
            certificateTypeId: items[0].certificateTypeId,
          });
        }
      );
    } else {
      setCurrentItem({
        _id: "",
        certificateTypeId: "",
        shipId: "",
      });
    }
  }, [sharedObject]);

  const onConfirmClick = () => {
    setSharedObject({
      ...currentItem,
      certificateTypeId: currentItem.certificateTypeId === '' ? certificateTypes[0]._id : currentItem.certificateTypeId,
      shipId: currentItem.shipId === '' ? ships[0]._id : currentItem.shipId,
      type: "ship",
      page: "certificateEdit",
    });

    navigate("/certificate-edit");
  }

  const initSelect = () => {
    ShipModel.getAll({}).then((res) => {
      setShips(res);
    });

    CertificateTypeModel.getAll({ filter: { type: "ship" } }).then(
      (res) => {
        setCertificateTypes(res);
      }
    );
  }

  useEffect(() => {
    initSelect();
  }, [])

  return (
    <Modal
      modalTitle={modalTitle}
      modalID={modalID}
      onConfirmClick={onConfirmClick}
      content={
        <>
          <div className="position-relative form-group">
            <label htmlFor="cert-ship-modal-certificate-name">Certificate</label>
            <Select
              data={certificateTypes}
              valueKey="_id"
              titleKey="name"
              value={currentItem.certificateTypeId}
              onChange={(value) => {
                setCurrentItem((prev) => ({
                  ...prev,
                  certificateTypeId: value,
                }));
              }}
            />
          </div>
          <div className="position-relative form-group">
            <label htmlFor="cert-ship-modal-ship-name">Ship</label>
            <Select
              data={ships}
              valueKey="_id"
              titleKey="vesselName"
              value={currentItem.shipId}
              onChange={(value) => {
                setCurrentItem((prev) => ({
                  ...prev,
                  shipId: value,
                }));
              }}
            />
          </div>
        </>
      }
    />
  );
};

export default ModalWrapper;
