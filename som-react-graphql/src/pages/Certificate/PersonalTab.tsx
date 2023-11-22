import React, { FC, useState, useEffect, useContext } from 'react';
import Card from "../Component/Card/Card";
import DataTable from "../Component/Table/DataTable";
import Select from '../Component/Select/Select';
import CertificateModel from '../../models/CertificatesModel';
import ShipModel from '../../models/ShipModel';
import MarinerModel from '../../models/MarinerModel';
import DepartmentModel from '../../models/DepartmentModel';
import CertificateTypeModel from "../../models/CertificateTypeModel";
import { SharedContext } from '../DataContext';
import ModelFuncs from '../../models/ModelMain';

interface ShipTabProps {
  title: string;
}

const PersonalTab: FC<ShipTabProps> = ({ title }) => {
  const [data, setData] = useState([]);
  const [ships, setShips] = useState<any>([]);
  const [departments, setDepartments] = useState<any>([]);
  const [certificateTypes, setCertificateTypes] = useState<any>([]);
  const { sharedObject, setSharedObject } = useContext(SharedContext);
  const [searchOptions, setSearchOptions] = useState({
    shipId: "",
    certificateTypeId: "",
    departmentId: "",
    person: "",
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
    MarinerModel.getAll({
      filter: {
        shipId: searchOptions.shipId,
      },
      includeFilter: {
        name: searchOptions.person,
      },
    }).then((mariners: any[]) => {
      let marinerIds = mariners.map((mariner) => mariner._id.toString());

      CertificateModel.getAll({
        filter: {
          type: "personal",
          "issue.departmentId": searchOptions.departmentId,
          certificateTypeId: searchOptions.certificateTypeId,
          personId: marinerIds,
        },
      }).then((res) => {
        setData(res);
      });
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

    CertificateTypeModel.getAll({ filter: { type: "personal" } }).then((res) => {
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
      table: "certificatePersonal",
    });
  }

  const onEditClick = ({ _id }: { _id: string }) => {
    setSharedObject({
      _id,
      table: "certificatePersonal",
    });
  }

  const onDeleteClick = ({ _id, title }: { _id: string, title: string }) => {
    setSharedObject({
      _id,
      title,
      table: "certificatePersonal",
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
    <Card title={title} hasPlus={true} plusTarget="#cert-personal-modal" onPlusClick={onPlusClick} content={
      <>
        <div className="form-row">
          <div className="col-md-8">
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
              <div className="col-md-3">
                <div className="position-relative form-group">
                  <label htmlFor="selectPersonal">Person</label>
                  <input
                    id="selectPersonal"
                    type="text"
                    className="form-control"
                    value={searchOptions.person}
                    onChange={(event) => {
                      setSearchOptions((prev) => ({
                        ...prev,
                        person: event.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 d-flex align-items-end">
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

        <DataTable data={data} hasPagination={true} changePagination={changePagination} thead={
          <tr>
            <th>#</th>
            <th>Department</th>
            <th>Certificate / ID</th>
            <th>Person</th>
            <th>Issue / Expiration date</th>
            <th>Price / Reg.fee</th>
            <th>Account / Amount</th>
            <th />
          </tr>
        } tbody={
          data.slice((pagination.page - 1) * pagination.perPage, pagination.page * pagination.perPage).map((row: any, i) => (
            <tr key={i}>
              <td>{i + (pagination.page - 1) * pagination.perPage + 1}</td>
              <td>{row.issue.department?.name}</td>
              <td>
                <div>{row.certificateType?.name}</div>
                <div className="mt-2">{row.issue.id}</div>
              </td>
              <td>
                <div>{row.person.name}</div>
                <div className="mt-2">
                  {row.person.ship?.vesselName} / {row.person.duty
                    ? row.person.duty.name
                    : ""}
                </div>
              </td>
              <td>
                <div>{ModelFuncs.formatDate(row.issue.issue)}</div>
                <div className="mt-2">{ModelFuncs.formatDate(row.issue.expire)}</div>
              </td>
              <td>
                <div>{row.issue.price}</div>
                <div className="mt-2">{row.issue.registrationFee}</div>
              </td>
              <td>
                <div>{row.issue.account}</div>
                <div className="mt-2">{2000}</div>
              </td>
              <td className="text-right">
                <button
                  className="mr-2 btn-icon btn-icon-only btn-square btn btn-primary btn-xs"
                  onClick={() => onEditClick({ _id: row._id })}
                  data-toggle="modal"
                  data-target="#cert-personal-modal">
                  <i className="lnr-pencil btn-icon-wrapper" />
                </button>
                <button
                  className="mr-2 btn-icon btn-icon-only btn-square btn btn-danger btn-xs"
                  onClick={() =>
                    onDeleteClick({
                      _id: row._id,
                      title: `Certificate of "${row.person.name}"`,
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

export default PersonalTab;