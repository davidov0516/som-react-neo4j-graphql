import React, { FC } from 'react';

interface ModalProps {
  modalTitle: string;
  modalID: string;
  modalWidth?: string;
  content: React.ReactNode;
  onConfirmClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Modal: FC<ModalProps> = ({ modalTitle, modalID, modalWidth = "500px", content, onConfirmClick }) => {
  return (
    <div
      className="modal fade"
      id={modalID}
      tabIndex={-1}
      style={{
        display: "none",
        position: "absolute",
      }}
      aria-hidden="true"
    >
      <div
        className="modal-dialog"
        role="document"
        style={
          {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: modalWidth
          }
        }
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modalTitle}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            {content}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: 100 }}
              data-dismiss="modal"
              onClick={onConfirmClick}>OK</button
            >
            <button
              type="button"
              className="btn-transition btn btn-outline-primary"
              style={{ width: 100 }}
              data-dismiss="modal">Close</button
            >
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
