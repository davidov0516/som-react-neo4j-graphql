import React, { useState, useEffect, useContext } from 'react';
import Card from '../Component/Card/Card'
import DataTable from '../Component/Table/DataTable';
import WaterAreaModel from '../../../src/models/WaterAreaModel'
import PageTitle from '../../pages/PageTitle';
import { SharedContext } from '../DataContext';

interface WaterArea {
  _id: string;
  name: string;
  note: string;
}

interface Props {
  title: string;
}

const WaterAreas: React.FC<Props> = ({ title }) => {
  const [data, setData] = useState<WaterArea[]>([]);
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
    WaterAreaModel.getAll({ filter: {}, includeFilter: {} }).then((res: any) => {
      setData(res);
    });
  };

  const onPlusClick = () => {
    setSharedObject({
      _id: "",
      table: "waterarea"
    })
  };

  const onEditClick = ({ _id }: { _id: string }) => {
    setSharedObject({
      _id,
      table: "waterarea",
    })
  };

  const onDeleteClick = ({ _id, title }: { _id: string; title: string }) => {
    setSharedObject({
      _id,
      title,
      table: "waterarea",
    })
  };

  useEffect(() => {
    initTable();
  }, [sharedObject]);


  return (
    <div className="app-main__inner">
      <PageTitle
        icon="target"
        title="Water Areas"
        content="This is Water Areas Page. You can see the contents of the Water Areas Page here."
      />
      <Card title="WATER AREAS" hasPlus={true} plusTarget="#waterarea-modal" onPlusClick={onPlusClick}
        content={
          <DataTable data={data} hasPagination={true} changePagination={changePagination} thead={
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Note</th>
              <th />
            </tr>
          } tbody={
            data.slice((pagination.page - 1) * pagination.perPage, pagination.page * pagination.perPage).map((row: any, i) => (
              <tr key={i}>
                <td>{i + (pagination.page - 1) * pagination.perPage + 1}</td>
                <td>{row.name ? row.name : ''}</td>
                <td>{row.note ? row.note : ''}</td>
                <td className="text-right">
                  <button
                    className="mb-2 mr-2 btn-icon btn-icon-only btn-square btn btn-primary btn-xs"
                    onClick={() => onEditClick({ _id: row._id })}
                    data-toggle="modal"
                    data-target="#waterarea-modal"
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
        } />
    </div>
  )
}

export default WaterAreas;
