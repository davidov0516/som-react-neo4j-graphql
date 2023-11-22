import React, { useState, useEffect, useContext } from 'react';
import Card from '../Component/Card/Card'
import DataTable from '../Component/Table/DataTable';
import ChartererModel from '../../models/ChartererModel';
import PageTitle from '../../pages/PageTitle';
import { SharedContext } from '../DataContext';
import SearchInput from '../Component/SearchInput/SearchInput';

interface Charterer {
  _id: string;
  company: string;
  nation: string;
  phone: string;
  email: string;
}

interface Props {
  title: string;
}

const Charterers: React.FC<Props> = ({ title }) => {
  const [data, setData] = useState<Charterer[]>([]);
  const { sharedObject, setSharedObject } = useContext(SharedContext);
  const [companies, setCompanies] = useState<any[]>([]);
  const [nations, setNations] = useState<any[]>([]);
  const [searchOptions, setSearchOptions] = useState({
    company: "",
    nation: "",
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
    ChartererModel.getAll({
      filter: {},
      includeFilter: {
        company: searchOptions.company,
        nation: searchOptions.nation,
      },
    }).then((res) => {
      setData(res);
    });

    ChartererModel.getAll({}).then((res) => {
      setCompanies([...new Set(res.map((item: any) => item.company))]);
      setNations([...new Set(res.map((item: any) => item.nation))]);
    });
  };

  const onPlusClick = () => {
    setSharedObject({
      _id: "",
      table: "charterer"
    })
  };

  const onEditClick = ({ _id }: { _id: string }) => {
    setSharedObject({
      _id,
      table: "charterer",
    })
  };

  const onDeleteClick = ({ _id, title }: { _id: string; title: string }) => {
    setSharedObject({
      _id,
      title,
      table: "charterer",
    })
  };

  useEffect(() => {
    initTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedObject]);

  return (
    <div className="app-main__inner">
      <PageTitle
        icon="id"
        title="Charterers"
        content="This is Charterers Page. You can see the contents of the Charterers Page here."
      />
      <Card title="CHARTERER" hasPlus={true} plusTarget="#charterer-modal" onPlusClick={onPlusClick}
        content={
          <>
            <div className="form-row">
              <div className="col-md-3">
                <div className="position-relative form-group">
                  <label htmlFor="inputCompany">Company</label>
                  <SearchInput
                    id="inputCompany"
                    data={companies}
                    value={searchOptions.company}
                    onChange={(value) => {
                      setSearchOptions((prev: any) => ({
                        ...prev,
                        company: value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="position-relative form-group">
                  <label htmlFor="inputNation">Nation</label>
                  <SearchInput
                    id="inputNation"
                    data={nations}
                    value={searchOptions.nation}
                    onChange={(value) => {
                      setSearchOptions((prev: any) => ({
                        ...prev,
                        nation: value,
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="col-md-6 d-flex align-items-end">
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
                <th>Company</th>
                <th>Nation</th>
                <th>Phone</th>
                <th>Email</th>
                <th />
              </tr>
            } tbody={
              data.slice((pagination.page - 1) * pagination.perPage, pagination.page * pagination.perPage).map((row: any, i) => (
                <tr key={i}>
                  <td>{i + (pagination.page - 1) * pagination.perPage + 1}</td>
                  <td>{row.company ? row.company : ""}</td>
                  <td>{row.nation ? row.nation : ""}</td>
                  <td>{row.phone ? row.phone : ""}</td>
                  <td>{row.email ? row.email : ""}</td>
                  <td className="text-right">
                    <button
                      className="mb-2 mr-2 btn-icon btn-icon-only btn-square btn btn-primary btn-xs"
                      onClick={() => onEditClick({ _id: row._id })}
                      data-toggle="modal"
                      data-target="#charterer-modal"
                    >
                      <i className="lnr-pencil btn-icon-wrapper" />
                    </button>
                    <button
                      className="mb-2 mr-2 btn-icon btn-icon-only btn-square btn btn-danger btn-xs"
                      onClick={() =>
                        onDeleteClick({
                          _id: row._id,
                          title: row.company,
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

export default Charterers;
