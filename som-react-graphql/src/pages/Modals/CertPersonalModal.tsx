import React, { useState, useContext, useEffect } from 'react';
import Modal from '../Component/Modal/Modal';
import Select from '../Component/Select/Select';
import { useNavigate } from "react-router-dom";
import { SharedContext } from '../DataContext';
import CertificateModel from '../../models/CertificatesModel';
import CertificateTypeModel from '../../models/CertificateTypeModel';
import ShipModel from '../../models/ShipModel';
import MarinerModel from '../../models/MarinerModel';

interface CertificateType {
  _id: string;
  certificateTypeId: string;
  shipId: string;
  personId: string,
}

const ModalWrapper: React.FC = () => {
  const navigate = useNavigate();
  const modalTitle = "CERTIFICATE";
  const modalID = "cert-personal-modal";

  const { sharedObject, setSharedObject } = useContext(SharedContext);
  const [ships, setShips] = useState<any[]>([]);
  const [mariners, setMariners] = useState<any[]>([]);
  const [certificateTypes, setCertificateTypes] = useState<any[]>([]);
  const [currentItem, setCurrentItem] = useState<CertificateType>({
    _id: "",
    certificateTypeId: "",
    shipId: "",
    personId: "",
  });

  useEffect(() => {
    if (sharedObject.table !== "certificatePersonal") {
      return;
    }

    if (sharedObject._id) {
      CertificateModel.getAll({ filter: { _id: sharedObject._id } }).then(
        (items) => {
          setCurrentItem({
            _id: items[0]._id,
            shipId: items[0].shipId,
            certificateTypeId: items[0].certificateTypeId,
            personId: items[0].personId,
          });
        }
      );
    } else {
      setCurrentItem({
        _id: "",
        certificateTypeId: "",
        shipId: "",
        personId: "",
      });
    }
  }, [sharedObject]);

  const onConfirmClick = () => {
    setSharedObject({
      ...currentItem,
      certificateTypeId: currentItem.certificateTypeId === '' ? certificateTypes[0]._id : currentItem.certificateTypeId,
      shipId: currentItem.shipId === '' ? ships[0]._id : currentItem.shipId,
      personId: currentItem.personId === '' ? mariners[0]._id : currentItem.personId,
      type: "personal",
      page: "certificateEdit",
    });

    navigate("/certificate-edit");
  }

  const initSelect = () => {
    ShipModel.getAll({}).then((res) => {
      setShips(res);
    });

    CertificateTypeModel.getAll({ filter: { type: "personal" } }).then(
      (res) => {
        setCertificateTypes(res);
      }
    );

    MarinerModel.getAll({}).then((res) => {
      setMariners(res);
    });
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
            <label htmlFor="cert-personal-modal-certificate-name">Certificate</label>
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
            <label htmlFor="cert-personal-modal-ship-name">Ship</label>
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
          <div className="position-relative form-group">
            <label htmlFor="select-person">Person</label>
            <Select
              data={mariners}
              valueKey="_id"
              titleKey="name"
              value={currentItem.personId}
              onChange={(value) => {
                setCurrentItem((prev) => ({
                  ...prev,
                  personId: value,
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
