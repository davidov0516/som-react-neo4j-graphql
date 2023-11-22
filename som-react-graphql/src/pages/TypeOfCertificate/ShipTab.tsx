import React, { FC, useState, useEffect, useContext } from 'react';
import Card from "../Component/Card/Card";
import DataTable from "../Component/Table/DataTable";
import CertificateTypeModel from "../../models/CertificateTypeModel";
import { SharedContext } from '../DataContext';

interface ShipTabProps {
  title: string;
}

const ShipTab: FC<ShipTabProps> = ({ title }) => {
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
    CertificateTypeModel.getAll({ filter: { type: "ship" } }).then((res) => {
      setData(res);
    });
  }

  const onPlusClick = () => {
    setSharedObject({
      _id: "",
      table: "certificateTypeShip",
    });
  }

  const onEditClick = ({ _id }: { _id: number }) => {
    setSharedObject({
      _id,
      table: "certificateTypeShip",
    });
  }

  const onDeleteClick = ({ _id, title }: { _id: number, title: string }) => {
    setSharedObject({
      _id,
      title,
      table: "certificateTypeShip",
    });
  }

  useEffect(() => {
    initTable();
  }, [sharedObject]);

  return (
    <Card title={title} hasPlus={true} plusTarget="#toc-ship-modal" onPlusClick={onPlusClick} content={
      <DataTable data={data} hasPagination={true} changePagination={changePagination} thead={
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Issuing Agency</th>
          <th>Note</th>
          <th />
        </tr>
      } tbody={
        data.slice((pagination.page - 1) * pagination.perPage, pagination.page * pagination.perPage).map((row: any, i) => (
          <tr key={i}>
            <td>{i + (pagination.page - 1) * pagination.perPage + 1}</td>
            <td>{row.name ? row.name : ""}</td>
            <td>{row.issuingAgency ? row.issuingAgency : ""}</td>
            <td>{row.note ? row.note : ""}</td>
            <td className="text-right">
              <button
                className="mr-2 btn-icon btn-icon-only btn-square btn btn-primary btn-xs"
                onClick={() => onEditClick({ _id: row._id })}
                data-toggle="modal"
                data-target="#toc-ship-modal">
                <i className="lnr-pencil btn-icon-wrapper" />
              </button>
              <button
                className="mr-2 btn-icon btn-icon-only btn-square btn btn-danger btn-xs"
                onClick={() =>
                  onDeleteClick({
                    _id: row._id,
                    title: row.name,
                  })}
                data-toggle="modal"
                data-target="#delete-confirm-modal">
                <i className="lnr-trash btn-icon-wrapper" />
              </button>
            </td>
          </tr>
        ))
      } />
    } />
  )

}

export default ShipTab;