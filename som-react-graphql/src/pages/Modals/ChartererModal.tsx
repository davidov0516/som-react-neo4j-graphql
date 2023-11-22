import React, { useState, useContext, useEffect } from 'react';
import Modal from '../Component/Modal/Modal';
import { SharedContext } from '../DataContext';
import ChartererModel from '../../models/ChartererModel';
import ModelFuncs from '../../models/ModelMain';

interface Charterer {
  _id: string;
  company: string;
  nation: string;
  phone: string;
  email: string;
  note: string;
}

const ModalWrapper: React.FC = () => {
  let modalTitle = "CHARTERER";
  let modalID = "charterer-modal";

  const { sharedObject, setSharedObject } = useContext(SharedContext);
  const [currentItem, setCurrentItem] = useState<Charterer>({
    _id: "",
    company: "",
    nation: "",
    phone: "",
    email: "",
    note: "",
  });

  useEffect(() => {
    if (sharedObject.table !== "charterer") {
      return;
    }

    if (sharedObject._id) {
      ChartererModel.getAll({ filter: { _id: sharedObject._id } }).then((items) => {
        setCurrentItem(items[0]);
      });
    } else {
      setCurrentItem({
        _id: "",
        company: "",
        nation: "",
        phone: "",
        email: "",
        note: "",
      });
    }
  }, [sharedObject]);

  const onConfirmClick = () => {
    ModelFuncs.put("charterer", {
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
          <form className="charter">
            <div className="form-row">
              <div className="col-md-6">
                <div className="position-relative form-group">
                  <label htmlFor="charterer-modal-company">Company</label>
                  <input
                    id="charterer-modal-company"
                    className="form-control"
                    value={currentItem.company}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="position-relative form-group">
                  <label htmlFor="charterer-modal-nation">Nation</label>
                  <input
                    id="charterer-modal-nation"
                    className="form-control"
                    value={currentItem.nation}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        nation: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-6">
                <div className="position-relative form-group">
                  <label htmlFor="charterer-modal-contract">Contract</label>
                  <input
                    id="charterer-modal-contract"
                    className="form-control"
                    value={currentItem.phone}
                    placeholder="Phone"
                    onChange={(e) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="position-relative form-group">
                  <label htmlFor="charterer-modal-email">&nbsp;</label>
                  <input
                    id="charterer-modal-email"
                    type="email"
                    className="form-control"
                    value={currentItem.email}
                    placeholder="email"
                    onChange={(e) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-12">
                <div className="position-relative form-group">
                  <label htmlFor="charterer-modal-note">Note</label>
                  <textarea
                    id="charterer-modal-note"
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
              </div>
            </div>
          </form>
        </>
      }
    />
  );
};

export default ModalWrapper;
