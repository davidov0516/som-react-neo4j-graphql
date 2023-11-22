import React, { useState, useContext, useEffect } from 'react';
import Modal from '../Component/Modal/Modal';
import { SharedContext } from '../DataContext';
import CertificateTypeModel from '../../models/CertificateTypeModel';
import ModelFuncs from '../../models/ModelMain';

interface CertificateType {
  _id: string;
  name: string;
  issuingAgency: string;
  note: string;
}

const ModalWrapper: React.FC = () => {
  let modalTitle = "TYPE OF CERTIFICATE";
  let modalID = "toc-personal-modal";

  const { sharedObject, setSharedObject } = useContext(SharedContext);
  const [currentItem, setCurrentItem] = useState<CertificateType>({
    _id: "",
    name: "",
    issuingAgency: "",
    note: "",
  });

  useEffect(() => {
    if (sharedObject.table !== "certificateTypePersonal") {
      return;
    }

    if (sharedObject._id) {
      CertificateTypeModel.getAll({ filter: { _id: sharedObject._id } }).then((items) => {
        setCurrentItem(items[0]);
      });
    } else {
      setCurrentItem({
        _id: "",
        name: "",
        issuingAgency: "",
        note: "",
      });
    }
  }, [sharedObject]);

  const onConfirmClick = () => {
    ModelFuncs.put("certificatetype", {
      type: "personal",
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
            <label htmlFor="toc-personal-modal-name">Name</label>
            <input
              id="toc-personal-modal-name"
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
            <label htmlFor="toc-personal-modal-issuing-agency">Issuing Agency</label>
            <input
              id="toc-personal-modal-issuing-agency"
              className="form-control"
              value={currentItem.issuingAgency}
              onChange={(e) =>
                setCurrentItem((prev) => ({
                  ...prev,
                  issuingAgency: e.target.value,
                }))
              }
            />
          </div>
          <div className="position-relative form-group">
            <label htmlFor="toc-personal-modal-note">Note</label>
            <textarea
              id="toc-personal-modal-note"
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
