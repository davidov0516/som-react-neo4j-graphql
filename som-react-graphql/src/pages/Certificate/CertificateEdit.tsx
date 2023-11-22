import React, { useState, useContext, useEffect } from 'react';
import { SharedContext } from '../DataContext';

import PageTitle from '../PageTitle';
import LabelGroup from '../Component/LabelGroup/LabelGroup';
import Card from '../Component/Card/Card';
import DataTable from '../Component/Table/DataTable';
import Select from '../Component/Select/Select';

import CertificateModel from '../../models/CertificatesModel';
import CertificateTypeModel from '../../models/CertificateTypeModel';
import DepartmentModel from '../../models/DepartmentModel';
import ShipModel from '../../models/ShipModel';
import MarinerModel from '../../models/MarinerModel';
import ModelFuncs from '../../models/ModelMain';

interface Certificate {
  _id: string,
  certificateTypeId: string,
  certificateType?: any,
  issue: {
    putIn: string,
    departmentId?: string,
    department?: any,
    id: string,
    issue: string,
    expire: string,
    account: string,
    price: number,
    registrationFee: number,
  },
  personId: string,
  person?: any,
  shipId: string,
  ship?: any,
  type: string,
}

function App() {
  const [currentItem, setCurrentItem] = useState<Certificate>({
    _id: "",
    certificateTypeId: "",
    certificateType: {},
    issue: {
      putIn: '',
      departmentId: '',
      department: {},
      id: '',
      issue: '',
      expire: '',
      account: '',
      price: 0,
      registrationFee: 0,
    },
    personId: "",
    person: {},
    shipId: "",
    ship: {},
    type: '',
  });

  const { sharedObject, setSharedObject } = useContext(SharedContext);
  const [departments, setDepartments] = useState<any[]>([]);
  const data = [
    {
      id: 1,
      key: "Department",
      value: currentItem.issue?.department?.name,
    },
    {
      id: 2,
      key: "ID",
      value: currentItem.issue?.id,
    },
    {
      id: 3,
      key: "Issue Date",
      value: currentItem.issue ? ModelFuncs.formatDate(currentItem.issue.issue) : "",
    },
    {
      id: 4,
      key: "Expiration Date",
      value: currentItem.issue ? ModelFuncs.formatDate(currentItem.issue.expire) : "",
    },
    {
      id: 5,
      key: "Account",
      value: currentItem.issue?.account,
    },
    {
      id: 6,
      key: "Price",
      value: currentItem.issue?.price,
    },
    {
      id: 7,
      key: "Registration fee",
      value: currentItem.issue?.registrationFee,
    },
    {
      id: 8,
      key: "Amount",
      value: 200,
    },
  ];

  const [tableCardVisible, setTableCardVisible] = useState(false);
  const [issueCardVisible, setIssueCardVisible] = useState(false);
  const [issueDetailVisible, setIssueDetailVisible] = useState(false);
  const [issueBtnVisible, setIssueBtnVisible] = useState(false);
  const [putInBtnVisible, setPutInBtnVisible] = useState(false);
  const [completeBtnVisible, setCompleteBtnVisible] = useState(false);

  useEffect(() => {
    if (sharedObject.page !== "certificateEdit") {
      return;
    }

    if (sharedObject._id) {
      init(sharedObject._id);
    } else {
      let tmpCurrentItem = { ...sharedObject };
      delete tmpCurrentItem.page;
      tmpCurrentItem.issue = {
        putIn: '',
        departmentId: '',
        id: '',
        issue: '',
        expire: '',
        account: '',
        price: 0,
        registrationFee: 0,
      };

      CertificateTypeModel.getAll({
        filter: {
          _id: tmpCurrentItem.certificateTypeId,
        },
      }).then((items) => {
        tmpCurrentItem.certificateType = items[0];

        ShipModel.getAll({
          filter: {
            _id: tmpCurrentItem.shipId,
          },
        }).then((items) => {
          tmpCurrentItem.ship = items[0];

          MarinerModel.getAll({
            filter: {
              _id: tmpCurrentItem.personId,
            },
          }).then((items) => {
            tmpCurrentItem.person = items[0];

            setCurrentItem(tmpCurrentItem);
          });
        });
      });

      setIssueCardVisible(true);
      setPutInBtnVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedObject]);

  const init = (_id: string) => {
    CertificateModel.getAll({ filter: { _id } }).then((items) => {
      let tmpCurrentItem = items[0];

      CertificateTypeModel.getAll({
        filter: {
          _id: sharedObject.certificateTypeId,
        },
      }).then((items) => {
        tmpCurrentItem.certificateTypeId = sharedObject.certificateTypeId;
        tmpCurrentItem.certificateType = items[0];

        ShipModel.getAll({
          filter: {
            _id: sharedObject.shipId,
          },
        }).then((items) => {
          tmpCurrentItem.shipId = sharedObject.shipId;
          tmpCurrentItem.ship = items[0];

          MarinerModel.getAll({
            filter: {
              _id: sharedObject.personId,
            },
          }).then((items) => {
            tmpCurrentItem.personId = sharedObject.personId;
            tmpCurrentItem.person = items[0];

            setCurrentItem(tmpCurrentItem);
          });
        });
      });

      setTableCardVisible(true);
      setIssueBtnVisible(true);
      setPutInBtnVisible(true);
    });
  }

  const onIssueClick = () => {
    setIssueBtnVisible(false);
    setIssueCardVisible(true);
  }

  const onPutInClick = () => {
    setPutInBtnVisible(false);
    setCompleteBtnVisible(true);
    setIssueDetailVisible(true);
  }

  const onCompleteClick = () => {
    setPutInBtnVisible(true);
    setCompleteBtnVisible(false);
    setIssueDetailVisible(false);
    setIssueCardVisible(false);
    setTableCardVisible(true);
    setIssueBtnVisible(true);

    if (currentItem.issue.departmentId === "") {
      delete currentItem.issue.departmentId;
    }

    CertificateModel.put(currentItem).then((result) => {
      let _id;
      if (sharedObject._id) {
        _id = result.result.data.updateCertificates?.certificates[0]?._id;
      } else {
        _id = result.result.data.createCertificates?.certificates[0]?._id;
      }

      setSharedObject({
        _id: _id ?? sharedObject._id,
        page: "certificateEdit",
      });
    });
  }

  const initSelect = () => {
    DepartmentModel.getAll({}).then((res) => {
      setDepartments(res);
    });
  }

  useEffect(() => {
    initSelect();
  }, []);

  return (
    <div className="app-main__inner">
      <PageTitle
        icon="credit"
        title="Edit Certificate"
        content="This is Certificate Edit Page. You can edit certificate here."
      />

      <Card hasHeader={false} content={
        <div className="d-flex">
          <div style={{ width: 600 }}>
            <LabelGroup
              leftLabel={currentItem.certificateType?.name}
              rightLabel={currentItem.type === "ship"
                ? currentItem.ship?.vesselName
                : currentItem.person?.name}
              isOrange={currentItem.type === "ship"}
              fontSize={20}
            />
          </div>
          {issueBtnVisible &&
            <button
              type="button"
              className="btn-transition btn btn-warning ml-3"
              style={{ width: 100 }}
              onClick={onIssueClick}>
              Issue
            </button>
          }
        </div>
      } />

      <div className="row mt-4">
        {tableCardVisible &&
          <div className="col-5">
            <Card hasHeader={false} content={
              <DataTable
                data={data}
                hasPagination={false}
                thead={
                  <tr>
                    <th>Item</th>
                    <th>Value</th>
                  </tr>
                }
                tbody={
                  data.map((row, i) => (
                    <tr key={i}>
                      <td>{row.key}</td>
                      <td>{row.value}</td>
                    </tr>
                  ))
                } />
            } />
          </div>
        }

        {issueCardVisible &&
          <div className="col-7">
            <Card title="ISSUE" content={
              <>
                <div className="form-row">
                  <div className="col-4">
                    <div className="position-relative form-group">
                      <label htmlFor="put-in" className="">Put In</label>
                      <input
                        id="put-in"
                        type="date"
                        className="form-control"
                        value={currentItem.issue ? currentItem.issue.putIn : ""}
                        onChange={(e) => {
                          setCurrentItem({
                            ...currentItem,
                            issue: {
                              ...currentItem.issue,
                              putIn: e.target.value,
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <label className="">Department</label>
                    <Select
                      data={departments}
                      valueKey="_id"
                      titleKey="name"
                      value={currentItem.issue && currentItem.issue.departmentId ? currentItem.issue.departmentId : ""}
                      onChange={(value) => {
                        setCurrentItem({
                          ...currentItem,
                          issue: {
                            ...currentItem.issue,
                            departmentId: value,
                          }
                        });
                      }}
                    />
                  </div>
                  <div className="col-4 d-flex align-items-end">
                    {putInBtnVisible &&
                      <button
                        type="button"
                        className="btn-transition btn btn-outline-primary mb-3"
                        style={{ width: 100 }}
                        onClick={onPutInClick}>
                        Put In
                      </button>
                    }
                    {completeBtnVisible &&
                      <button
                        type="button"
                        className="btn-transition btn btn-primary mb-3"
                        style={{ width: 100 }}
                        onClick={onCompleteClick}>
                        Completed
                      </button>
                    }
                  </div>
                </div>

                {issueDetailVisible &&
                  <>
                    <hr />

                    <div className="form-row">
                      <div className="col-4">
                        <div className="position-relative form-group">
                          <label htmlFor="id" className="">ID</label>
                          <input
                            id="id"
                            type="text"
                            className="form-control"
                            value={currentItem.issue ? currentItem.issue.id : ""}
                            onChange={(e) => {
                              setCurrentItem({
                                ...currentItem,
                                issue: {
                                  ...currentItem.issue,
                                  id: e.target.value,
                                }
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-4">
                        <div className="position-relative form-group">
                          <label htmlFor="issue" className="">Issue</label>
                          <input
                            id="issue"
                            type="date"
                            className="form-control"
                            value={currentItem.issue ? currentItem.issue.issue : ""}
                            onChange={(e) => {
                              setCurrentItem({
                                ...currentItem,
                                issue: {
                                  ...currentItem.issue,
                                  issue: e.target.value,
                                }
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-4">
                        <div className="position-relative form-group">
                          <label htmlFor="expire" className="">Expire</label>
                          <input
                            id="expire"
                            type="date"
                            className="form-control"
                            value={currentItem.issue ? currentItem.issue.expire : ""}
                            onChange={(e) => {
                              setCurrentItem({
                                ...currentItem,
                                issue: {
                                  ...currentItem.issue,
                                  expire: e.target.value,
                                }
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="col-4">
                        <div className="position-relative form-group">
                          <label htmlFor="account" className="">Account</label>
                          <input
                            id="account"
                            type="text"
                            className="form-control"
                            value={currentItem.issue ? currentItem.issue.account : ""}
                            onChange={(e) => {
                              setCurrentItem({
                                ...currentItem,
                                issue: {
                                  ...currentItem.issue,
                                  account: e.target.value,
                                }
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-4">
                        <div className="position-relative form-group">
                          <label htmlFor="price" className="">Price</label>
                          <input
                            id="price"
                            type="number"
                            className="form-control"
                            value={currentItem.issue ? currentItem.issue.price : 0}
                            onChange={(e) => {
                              setCurrentItem({
                                ...currentItem,
                                issue: {
                                  ...currentItem.issue,
                                  price: Number(e.target.value),
                                }
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-4">
                        <div className="position-relative form-group">
                          <label htmlFor="registration-fee" className="">Registration Fee</label>
                          <input
                            id="registration-fee"
                            type="number"
                            className="form-control"
                            value={currentItem.issue ? currentItem.issue.registrationFee : 0}
                            onChange={(e) => {
                              setCurrentItem({
                                ...currentItem,
                                issue: {
                                  ...currentItem.issue,
                                  registrationFee: Number(e.target.value),
                                }
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                }
              </>
            } />
          </div>
        }
      </div>
    </div>
  )
}

export default App;
