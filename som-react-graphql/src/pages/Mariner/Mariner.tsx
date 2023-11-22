import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { SharedContext } from '../DataContext';
import PageTitle from '../../pages/PageTitle';
import Card from '../Component/Card/Card'
import DataTable from '../Component/Table/DataTable';
import Select from '../Component/Select/Select';
import ModelFuncs from '../../models/ModelMain';
import ShipModel from '../../models/ShipModel';
import MarinerModel from '../../models/MarinerModel';
import SearchInput from '../Component/SearchInput/SearchInput';

function App() {
  const navigate = useNavigate();
  const [data, setData] = useState<[]>([]);
  const { sharedObject, setSharedObject } = useContext(SharedContext);
  const [ships, setShips] = useState<any[]>([]);
  const [marinerNames, setMarinerNames] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    perPage: 10,
    page: 1,
    startPage: 1,
    totalPage: 0,
  });

  const [searchOptions, setSearchOptions] = useState({
    name: "",
    shipId: "",
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
      setShips([
        {
          _id: "",
          vesselName: "All",
        },
        ...res,
      ]);
    });

    MarinerModel.getAll({
      filter: {
        "ship._id": searchOptions.shipId,
      },
      includeFilter: {
        name: searchOptions.name,
      },
    }).then((res) => {
      setData(res);
    });

    MarinerModel.getAll({}).then((res) => {
      setMarinerNames([...new Set(res.map((item: any) => item.name))]);
    });
  };

  const onPlusClick = () => {
    setSharedObject({
      _id: "",
      table: "mariner"
    });

    navigate('/mariner-create');
  };

  const onEditClick = ({ _id }: { _id: string }) => {
    setSharedObject({
      _id,
      table: "mariner",
    });

    navigate("/mariner-create")
  }

  const goToDetail = ({ _id }: { _id: string }) => {
    setSharedObject({
      _id,
      table: "mariner",
    });

    navigate("/mariner-detail");
  }

  const onDeleteClick = ({ _id, title }: { _id: string; title: string }) => {
    setSharedObject({
      _id,
      title,
      table: "mariner",
    })
  };

  useEffect(() => {
    initTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedObject]);

  return (
    <div className="app-main__inner">
      <PageTitle
        icon="users"
        title="Mariners"
        content="This is Mariners Page. You can see the contents of the Mariners Page here."
      />

      <Card title="Mariners" hasPlus={true} onPlusClick={onPlusClick}
        content={
          <>
            <div className="form-row">
              <div className="col-md-9">
                <div className="form-row">
                  <div className="col-md-3">
                    <div className="position-relative form-group">
                      <label htmlFor="selectName">Name</label>
                      <SearchInput
                        id="selectName"
                        data={marinerNames}
                        value={searchOptions.name}
                        onChange={(value) => {
                          setSearchOptions((prev: any) => ({
                            ...prev,
                            name: value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="position-relative form-group">
                      <label htmlFor="selectPersonal">Ship</label>
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
                <th>Name</th>
                <th>Ship</th>
                <th>Duty(Job)</th>
                <th>Certificate(Expire)</th>
                <th />
              </tr>
            } tbody={
              data.slice((pagination.page - 1) * pagination.perPage, pagination.page * pagination.perPage).map((row: any, i) => (
                <tr key={i}>
                  <td>{i + (pagination.page - 1) * pagination.perPage + 1}</td>
                  <td className="d-flex">
                    <div style={{ minWidth: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "#ccc" }}>
                      <img
                        alt="mariner"
                        className="mariner-img-sm"
                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                        src={row.image
                          ? `${ModelFuncs.getServerUrl()}/uploads/${row.image}`
                          : "/assets/images/mariners/placeholder.png"}
                      />
                    </div>
                    <div className="ml-3 my-auto">
                      <h6>
                        <a
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            goToDetail({ _id: row._id });
                          }}>{row.name ? row.name : "-"}
                        </a>
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div>{row.ship ? row.ship.vesselName : ""}</div>
                  </td>
                  <td>
                    <div>
                      {row.duty ? row.duty.name : ""}&nbsp;
                      {row.job ? `(${row.job.name})` : ""}
                    </div>
                  </td>
                  <td>
                    <div>
                      {row.certificates.length
                        ? row.certificates[0].issue?.id
                        : ""}&nbsp;
                      {row.certificates.length && row.certificates[0].issue
                        ? `(${ModelFuncs.formatDate(row.certificates[0].issue.expire)})`
                        : ""}
                    </div>
                  </td>
                  <td className="text-right">
                    <button
                      className="mb-2 mr-2 btn-icon btn-icon-only btn-square btn btn-primary btn-xs"
                      onClick={() => onEditClick({ _id: row._id })}
                    >
                      <i className="lnr-pencil btn-icon-wrapper" />
                    </button>
                    <button
                      className="mb-2 mr-2 btn-icon btn-icon-only btn-square btn btn-danger btn-xs"
                      onClick={() =>
                        onDeleteClick({
                          _id: row._id,
                          title: row.name,
                        })
                      }
                      data-toggle="modal"
                      data-target="#delete-confirm-modal"
                    >
                      <i className="lnr-trash btn-icon-wrapper" />
                    </button>
                  </td>
                </tr>
              ))
            } />
          </>
        } />
    </div>
  )
}
export default App;


