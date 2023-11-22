import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { SharedContext } from '../DataContext';
import PageTitle from '../PageTitle';
import Card from "../Component/Card/Card";
import DataTable from '../Component/Table/DataTable';
import MarinerModel from '../../models/MarinerModel';
import ModelFuncs from '../../models/ModelMain';

interface Mariner {
  _id: string,
  birthday: string,
  boardedYears: string,
  code: number,
  dailyFee: number,
  dutyId: string,
  homePhone: string,
  image: string,
  isRemoved: boolean,
  jobId: string,
  mobilePhone: string,
  name: string,
  note: string,
  placeOfBorn: string,
  placeOfResidence: string,
  platoon_id: string,
  previousAffiliation: string,
  qualificationGrade: string,
  registered: string,
  removed: string,
  retired: string,
  shipId: string,
  graduated: { date: string, note: string },
  job: { name: string, _id: string },
  certificates: any[],
  ship: any,
  duty: { name: string, _id: string },
  platoon: { name: string, _id: string },
}

function App() {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState<Mariner>({
    _id: "",
    birthday: "",
    boardedYears: "",
    code: 0,
    dailyFee: 0,
    dutyId: "",
    homePhone: "",
    image: "",
    isRemoved: false,
    jobId: "",
    mobilePhone: "",
    name: "",
    note: "",
    placeOfBorn: "",
    placeOfResidence: "",
    platoon_id: "",
    previousAffiliation: "",
    qualificationGrade: "",
    registered: "",
    removed: "",
    retired: "",
    shipId: "",
    graduated: { date: "", note: "" },
    job: { name: "", _id: "" },
    certificates: [],
    ship: "",
    duty: { name: "", _id: "" },
    platoon: { name: "", _id: "" },
  });

  const { sharedObject } = useContext(SharedContext);
  const data = [
    {
      id: 1,
      key: "Job",
      value: currentItem.job ? currentItem.job.name : "",
    },
    {
      id: 2,
      key: "Daily Fee",
      value: currentItem.dailyFee,
    },
    {
      id: 3,
      key: "Platoon",
      value: currentItem.platoon ? currentItem.platoon.name : "",
    },
    {
      id: 4,
      key: "Previous Affiliation",
      value: currentItem.previousAffiliation,
    },
    {
      id: 5,
      key: "Place Of Born",
      value: currentItem.placeOfBorn,
    },
    {
      id: 6,
      key: "Place of Residence",
      value: currentItem.placeOfResidence,
    },
    {
      id: 7,
      key: "Code",
      value: currentItem.code,
    },
    {
      id: 8,
      key: "Mobile Phone",
      value: currentItem.mobilePhone,
    },
    {
      id: 9,
      key: "Home Phone",
      value: currentItem.homePhone,
    },
    {
      id: 10,
      key: "Graduated",
      value: currentItem.graduated ? currentItem.graduated?.note : "",
    },
    {
      id: 11,
      key: "Qualification Grade",
      value: currentItem.qualificationGrade,
    },
    {
      id: 12,
      key: "Boarded Years",
      value: currentItem.boardedYears,
    },
  ];

  useEffect(() => {
    if (sharedObject.table !== "mariner") {
      return;
    }

    if (sharedObject._id) {
      MarinerModel.getAll({ filter: { _id: sharedObject._id } }).then((items) => {
        setCurrentItem({
          ...items[0],
        });
      });
    }
  }, [sharedObject]);

  return (
    <div className="app-main__inner">
      <PageTitle
        icon="helm"
        title="Mariner Detail"
        content="This is Mariner Detail Page. You can see detailed information about a mariner here."
      />

      <Card hasHeader={false} content={
        <>
          <div className="row">
            <div className="col-md-4">
              <img
                alt="mariner"
                className="w-100"
                src={currentItem.image
                  ? `${ModelFuncs.getServerUrl()}/uploads/${currentItem.image}`
                  : "assets/images/mariners/placeholder.png"}
              />
            </div>

            <div className="col-md-8">
              <div className="row">
                <div className="col-md-6">
                  <h2>{currentItem.name ?? ""}</h2>
                  <h6>Birthday: <span>{currentItem.birthday}</span></h6>
                  <h6>
                    Ship: <span
                    >{currentItem.ship ? currentItem.ship.vesselName : ""}</span
                    >
                  </h6>
                  <h6>
                    Duty: <span>{currentItem.duty ? currentItem.duty.name : ""}</span>
                  </h6>
                  <h6>Registered: <span>{currentItem.registered}</span></h6>
                  <h6>
                    Retired: <span
                    >{currentItem.removed ? currentItem.removed : "-"}</span
                    >
                  </h6>
                </div>

                <div className="col-md-6 text-right">
                  <button
                    type="button"
                    className="btn btn-warning mb-3 mr-3"
                    style={{ width: 100 }}
                    onClick={() => navigate("/mariner-create")}>Edit</button
                  >
                </div>

                <div className="col-md-12 mt-3">
                  <div>{currentItem.note}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      } />

      <div className="mb-4" />

      <Card title="VESSEL PARTICULARS" content={

        <div className="row">
          <div className="col-12">
            <DataTable
              data={[
                {
                  id: 1,
                  key: "Job",
                  value: currentItem.job ? currentItem.job.name : "",
                },
                {
                  id: 2,
                  key: "Daily Fee",
                  value: currentItem.dailyFee ?? "",
                },
                {
                  id: 3,
                  key: "Platoon",
                  value: currentItem.platoon ? currentItem.platoon.name : "",
                },
                {
                  id: 4,
                  key: "Previous Affiliation",
                  value: currentItem.previousAffiliation ?? "",
                },
                {
                  id: 5,
                  key: "Place Of Born",
                  value: currentItem.placeOfBorn ?? "",
                },
                {
                  id: 6,
                  key: "Place of Residence",
                  value: currentItem.placeOfResidence ?? "",
                },
                {
                  id: 7,
                  key: "Code",
                  value: currentItem.code ?? "",
                },
                {
                  id: 8,
                  key: "Mobile Phone",
                  value: currentItem.mobilePhone ?? "",
                },
                {
                  id: 9,
                  key: "Home Phone",
                  value: currentItem.homePhone ?? "",
                },
                {
                  id: 10,
                  key: "Graduated",
                  value: currentItem.graduated ? currentItem.graduated.note : "",
                },
                {
                  id: 11,
                  key: "Qualification Grade",
                  value: currentItem.qualificationGrade ?? "",
                },
                {
                  id: 12,
                  key: "Boarded Years",
                  value: currentItem.boardedYears ?? "",
                },
              ]}
              hasPagination={false}
              thead={
                <tr>
                  <th>Item</th>
                  <th>Value</th>
                </tr>}
              tbody={
                data.map((row: any, i) => (
                  <tr key={i}>
                    <td>{row.key}</td>
                    <td>{row.value}</td>
                  </tr>
                ))
              } />
          </div>
        </div>
      } />

      <div className="mb-4" />

      <Card title="PERSONAL CERTIFICATES" content={
        <div className="row">
          <div className="col-12">
            <DataTable
              data={[currentItem]}
              hasPagination={false}
              thead={
                <tr>
                  <th>Name</th>
                  <th>Number</th>
                  <th>Issue</th>
                  <th>Expire</th>
                </tr>
              } tbody={currentItem.certificates.map((row: any, i: any) => (

                <tr key={i}>
                  <td>{row.certificateType ? row.certificateType.name : ""}</td>
                  <td>{row.issue ? row.issue.id : ""}</td>
                  <td>{row.issue ? ModelFuncs.formatDate(row.issue.issue) : ""}</td>
                  <td>{row.issue ? ModelFuncs.formatDate(row.issue.expire) : ""}</td>
                </tr>
              ))
              } />
          </div>
        </div>
      } />
    </div >
  )
}



export default App;