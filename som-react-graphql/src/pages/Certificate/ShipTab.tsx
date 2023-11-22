import React, { FC, useState, useEffect, useContext } from 'react';
import Card from "../Component/Card/Card";
import DataTable from "../Component/Table/DataTable";
import Select from '../Component/Select/Select';
import CertificateModel from '../../models/CertificatesModel';
import ShipModel from '../../models/ShipModel';
import DepartmentModel from '../../models/DepartmentModel';
import CertificateTypeModel from "../../models/CertificateTypeModel";
import { SharedContext } from '../DataContext';
import ModelFuncs from '../../models/ModelMain';

interface ShipTabProps {
  title: string;
}

const ShipTab: FC<ShipTabProps> = ({ title }) => {
  const [data, setData] = useState([]);
  const [ships, setShips] = useState<any>([]);
  const [departments, setDepartments] = useState<any>([]);
  const [certificateTypes, setCertificateTypes] = useState<any>([]);
  const { sharedObject, setSharedObject } = useContext(SharedContext);
  const [searchOptions, setSearchOptions] = useState({
    shipId: "",
    certificateTypeId: "",
    departmentId: "",
  });

  const [pagination, setPagination] = useState({
    perPage: 10,
    page: 1,
    startPage: 1,
    totalPage: 0,
  });

  const changePagination = (pagination: {
    perPage: number,
    page: number,
    startPage: number,
    totalPage: number,
  }) => {
    setPagination(pagination);
  }

  const initTable = () => {
    CertificateModel.getAll({
      filter: {
        type: "ship",
        "issue.departmentId": searchOptions.departmentId,
        certificateTypeId: searchOptions.certificateTypeId,
        shipId: searchOptions.shipId,
      },
    }).then((res) => {
      setData(res);
    });
  }

  const initSelect = () => {
    DepartmentModel.getAll({}).then((res) => {
      setDepartments([
        {
          _id: "",
          name: "All",
        },
        ...res,
      ]);
    });

    ShipModel.getAll({}).then((res) => {
      setShips([
        {
          _id: "",
          vesselName: "All",
        },
        ...res,
      ]);
    });

    CertificateTypeModel.getAll({ filter: { type: "ship" } }).then((res) => {
      setCertificateTypes([
        {
          _id: "",
          name: "All",
        },
        ...res,
      ]);
    });
  }

  const onPlusClick = () => {
    setSharedObject({
      _id: "",
      table: "certificateShip",
    });
  }

  const onEditClick = ({ _id }: { _id: number }) => {
    setSharedObject({
      _id,
      table: "certificateShip",
    });
  }

  const onDeleteClick = ({ _id, title }: { _id: number, title: string }) => {
    setSharedObject({
      _id,
      title,
      table: "certificateShip",
    });
  }

  useEffect(() => {
    initTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedObject]);

  useEffect(() => {
    initSelect();
  }, []);

  return (
    <Card title={title} hasPlus={true} plusTarget="#cert-ship-modal" onPlusClick={onPlusClick} content={
      <>
        <div className="form-row">
          <div className="col-md-9">
            <div className="form-row">
              <div className="col-md-3">
                <div className="position-relative form-group">
                  <label htmlFor="selectDepartment">Department</label>
                  <Select
                    data={departments}
                    valueKey="_id"
                    titleKey="name"
                    value={searchOptions.departmentId}
                    onChange={(value) => {
                      setSearchOptions((prev) => ({
                        ...prev,
                        departmentId: value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="position-relative form-group">
                  <label htmlFor="selectCertificate">Certificate</label>
                  <Select
                    data={certificateTypes}
                    valueKey="_id"
                    titleKey="name"
                    value={searchOptions.certificateTypeId}
                    onChange={(value) => {
                      setSearchOptions((prev) => ({
                        ...prev,
                        certificateTypeId: value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="position-relative form-group">
                  <label htmlFor="selectShip">Ship</label>
                  <Select
                    data={ships}
                    valueKey="_id"
                    titleKey="vesselName"
                    value={searchOptions.shipId}
                    onChange={(value) => {
                      setSearchOptions((prev) => ({
                        ...prev,
                        shipId: value,
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="col-md-3 d-flex align-items-end">
                <div className="d-flex">
                  <button
                    type="button"
                    className="btn btn-primary mb-3 mr-3"
                    style={{ width: 100 }}
                    onClick={initTable}>Search</button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <DataTable data={data} hasPagination={true} changePagination={changePagination} thead={
          <tr>
            <th>#</th>
            <th>Department</th>
            <th>Certificate / ID</th>
            <th>Ship</th>
            <th>Issue / Expiration date</th>
            <th>Price / Reg.fee</th>
            <th>Account / Amount</th>
            <th />
          </tr>
        } tbody={
          data.slice((pagination.page - 1) * pagination.perPage, pagination.page * pagination.perPage).map((row: any, i) => (
            <tr key={i}>
              <td>{i + (pagination.page - 1) * pagination.perPage + 1}</td>
              <td>{row.issue.department ? row.issue.department.name : ""}</td>
              <td>
                <div>{row.certificateType ? row.certificateType.name : ""}</div>
                <div className="mt-2">{row.issue.id ? row.issue.id : ""}</div>
              </td>
              <td>{row.ship ? row.ship.vesselName : ""}</td>
              <td>
                <div>{row.issue.issue ? ModelFuncs.formatDate(row.issue.issue) : ""}</div>
                <div className="mt-2">{row.issue.expire ? ModelFuncs.formatDate(row.issue.expire) : ""}</div>
              </td>
              <td>
                <div>{row.issue.price ? row.issue.price : ""}</div>
                <div className="mt-2">
                  {row.issue.registrationFee ? row.issue.registrationFee : ""}
                </div>
              </td>
              <td>
                <div>{row.issue.account ? row.issue.account : ""}</div>
                <div className="mt-2">{row.issue.account ? "2000" : ""}</div>
              </td>
              <td className="text-right">
                <button
                  className="mr-2 btn-icon btn-icon-only btn-square btn btn-primary btn-xs"
                  onClick={() => onEditClick({ _id: row._id })}
                  data-toggle="modal"
                  data-target="#cert-ship-modal">
                  <i className="lnr-pencil btn-icon-wrapper" />
                </button>
                <button
                  className="mr-2 btn-icon btn-icon-only btn-square btn btn-danger btn-xs"
                  onClick={() =>
                    onDeleteClick({
                      _id: row._id,
                      title: `Certificate of "${row.ship ? row.ship.vesselName : ""}"`,
                    })}
                  data-toggle="modal"
                  data-target="#delete-confirm-modal">
                  <i className="lnr-trash btn-icon-wrapper" />
                </button>
              </td>
            </tr >
          ))
        } />
      </>
    } />
  )

}

export default ShipTab;