import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { SharedContext } from '../DataContext';
import PageTitle from '../PageTitle';
import Card from "../Component/Card/Card";
import DataTable from "../Component/Table/DataTable";
import ModelFuncs from '../../models/ModelMain';
import ShipModel from '../../models/ShipModel';

function App() {
  const navigate = useNavigate();
  const title = "Ships";
  const [data, setData] = useState([]);
  const { sharedObject, setSharedObject } = useContext(SharedContext);

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
    ShipModel.getAll({}).then((res) => {
      setData(res);
    });
  }

  const onPlusClick = () => {
    setSharedObject({
      _id: "",
      table: "ship",
    });

    navigate("/ship-create");
  }

  const onEditClick = ({ _id }: { _id: string }) => {
    setSharedObject({
      _id,
      table: "ship",
    });

    navigate("/ship-create");
  }

  const onDeleteClick = ({ _id, title }: { _id: string, title: string }) => {
    setSharedObject({
      _id,
      title,
      table: "ship",
    });
  }

  const goToDetail = ({ _id }: { _id: string }) => {
    setSharedObject({
      _id,
      table: "ship",
    });

    navigate("/ship-detail");
  }

  useEffect(() => {
    initTable();
  }, [sharedObject]);

  return (
    <div className="app-main__inner">
      <PageTitle
        icon="helm"
        title="Ships"
        content="This is Ships Page. You can see the contents of the Ships Page here."
      />

      <Card title={title} hasPlus={true} onPlusClick={onPlusClick} content={
        <DataTable data={data} hasPagination={true} changePagination={changePagination} thead={
          <tr>
            <th>#</th>
            <th>Vessel</th>
            <th>IMO / CS</th>
            <th>Length / Beam</th>
            <th>DWT / GT</th>
            <th>Certificate / Expiration</th>
            <th />
          </tr>
        } tbody={
          data.slice((pagination.page - 1) * pagination.perPage, pagination.page * pagination.perPage).map((row: any, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td className="d-flex">
                <div style={{ minWidth: 100, height: 57, display: "flex", alignItems: "center", justifyContent: "center", background: "#ccc" }}>
                  <img
                    alt="ship"
                    className="ship-img-sm"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                    src={row.images && row.images.length
                      ? `${ModelFuncs.getServerUrl()}/uploads/${row.images[0]}`
                      : "/assets/images/ships/placeholder.png"}
                  />
                </div>

                <div className="ml-3 my-auto">
                  <h6>
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        goToDetail({ _id: row._id });
                      }}>{row.vesselName ? row.vesselName : "-"}</a
                    >
                  </h6>
                  <div className="mt-2">{row.shipType ? row.shipType : ""}</div>
                </div>
              </td>
              <td>
                <div>{row.imoNumber ? row.imoNumber : ""}</div>
                <div className="mt-2">{row.callsign ? row.callsign : ""}</div>
              </td>
              <td>
                <div>{row.length ? row.length : ""}</div>
                <div className="mt-2">{row.beam ? row.beam : ""}</div>
              </td>
              <td>
                <div>{row.deadWeight ? row.deadWeight : ""}</div>
                <div className="mt-2">{row.grossTonnage ? row.grossTonnage : ""}</div>
              </td>
              <td>
                <div>{row.certificate ? row.certificate.issue.id : ""}</div>
                <div className="mt-2">
                  {row.certificate ? ModelFuncs.formatDate(row.certificate.issue.expire) : ""}
                </div>
              </td>
              <td className="text-right">
                <button
                  className="mr-2 btn-icon btn-icon-only btn-square btn btn-primary btn-xs"
                  onClick={() => onEditClick({ _id: row._id })}
                ><i className="lnr-pencil btn-icon-wrapper" />
                </button>
                <button
                  className="mr-2 btn-icon btn-icon-only btn-square btn btn-danger btn-xs"
                  onClick={() =>
                    onDeleteClick({
                      _id: row._id,
                      title: row.vesselName,
                    })}
                  data-toggle="modal"
                  data-target="#delete-confirm-modal"
                ><i className="lnr-trash btn-icon-wrapper" /></button
                >
              </td>
            </tr>
          ))
        } />
      } />
    </div>
  )
}

export default App;