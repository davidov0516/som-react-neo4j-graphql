import React from 'react';
import Modal from '../Component/Modal/Modal';

const ModalWrapper: React.FC = () => {
  const onConfirmClick = () => {
    alert('button clicked');
  }

  return (
    <Modal
      modalTitle="Basic Modal Title"
      modalID="basicModal"
      modalWidth="500px"
      onConfirmClick={onConfirmClick}
      content={
        <>
          <div className="position-relative form-group">
            <label htmlFor="exampleEmail">Email</label>
            <input
              name="email"
              id="exampleEmail"
              placeholder="with a placeholder"
              type="email"
              className="form-control"
            />
          </div>
          <div className="position-relative form-group">
            <label htmlFor="examplePassword">Password</label>
            <input
              name="password"
              id="examplePassword"
              placeholder="password placeholder"
              type="password"
              className="form-control"
            />
          </div>
          <div className="position-relative form-group">
            <label htmlFor="exampleAddress">Address</label>
            <input
              name="address"
              id="exampleAddress"
              placeholder="1234 Main St"
              type="text"
              className="form-control"
            />
          </div>
        </>
      }
    />
  );
};

export default ModalWrapper;
