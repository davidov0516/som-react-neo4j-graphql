import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { SharedContext } from '../DataContext';
import PageTitle from '../PageTitle';
import Card from "../Component/Card/Card";
import DataTable from '../Component/Table/DataTable';
import Carousel from "../Component/Carousel/Carousel";
import ShipModel from '../../models/ShipModel';
import ModelFuncs from '../../models/ModelMain';

interface Ship {
  _id: string,
  vesselName: string,
  registered: string,
  isRemoved: boolean,
  removed: string,
  images: string[],
  shipType: string,
  yearOfBuild: number,
  flag: string,
  homePort: string,
  regNumber: string,
  callsign: string,
  imoNumber: string,
  grossTonnage: number,
  netTonnage: number,
  deadWeight: number,
  length: number,
  beam: number,
  depth: number,
  draught: number,
  note: string,
  certificate: any,
}

function App() {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState<Ship>({
    _id: "",
    vesselName: "",
    registered: "",
    isRemoved: false,
    removed: "",
    images: [],
    shipType: "",
    yearOfBuild: 0,
    flag: "",
    homePort: "",
    regNumber: "",
    callsign: "",
    imoNumber: "",
    grossTonnage: 0,
    netTonnage: 0,
    deadWeight: 0,
    length: 0,
    beam: 0,
    depth: 0,
    draught: 0,
    note: "",
    certificate: {},
  });

  const { sharedObject } = useContext(SharedContext);
  const data = [
    {
      id: 1,
      key: "Ship type",
      value: currentItem.shipType ?? "",
    },
    {
      id: 2,
      key: "Year of Built",
      value: currentItem.yearOfBuild ?? "",
    },
    {
      id: 3,
      key: "Flag",
      value: currentItem.flag ?? "",
    },
    {
      id: 4,
      key: "Homeport",
      value: currentItem.homePort ?? "",
    },
    {
      id: 5,
      key: "Reg. Number",
      value: currentItem.regNumber ?? "",
    },
    {
      id: 6,
      key: "Callsign",
      value: currentItem.callsign ?? "",
    },
    {
      id: 7,
      key: "IMO Number",
      value: currentItem.imoNumber ?? "",
    },
    {
      id: 8,
      key: "Gross Tonnage (t)",
      value: currentItem.grossTonnage ?? "",
    },
    {
      id: 9,
      key: "Net Tonnage (t)",
      value: currentItem.netTonnage ?? "",
    },
    {
      id: 10,
      key: "Deadweight (t)",
      value: currentItem.deadWeight ?? "",
    },
    {
      id: 11,
      key: "Length (m)",
      value: currentItem.length ?? "",
    },
    {
      id: 12,
      key: "Beam (m)",
      value: currentItem.beam ?? "",
    },
    {
      id: 13,
      key: "Depth (m)",
      value: currentItem.depth ?? "",
    },
    {
      id: 14,
      key: "Draught (m)",
      value: currentItem.draught ?? "",
    },
  ];

  useEffect(() => {
    if (sharedObject.table !== "ship") {
      return;
    }

    if (sharedObject._id) {
      ShipModel.getAll({ filter: { _id: sharedObject._id } }).then((items) => {
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
        title="Ship Detail"
        content="This is Ship Detail Page. You can see detailed information about a ship here."
      />

      <Card hasHeader={false} content={
        <>
          <div className="form-row">
            <div className="col-md-8">
              <div className="card-title">
                {currentItem.vesselName}
              </div>
            </div>
            <div className="col-md-4 d-flex align-items-end justify-content-end">
              <button
                type="button"
                className="btn btn-warning mb-3 mr-3"
                style={{ width: 100 }}
                onClick={() => navigate("/ship-create")}>Edit</button
              >
            </div>
          </div>

          <h6>Registered: <span>{currentItem.registered ? ModelFuncs.formatDate(currentItem.registered) : ""}</span></h6>
          <h6>
            Certificate: <span>{currentItem.certificate ? currentItem.certificate.issue?.id : ""}</span>
            <span> {currentItem.certificate && currentItem.certificate.issue ? ModelFuncs.formatDate(currentItem.certificate.issue.expire) : ""}</span>
          </h6>
          <h6>
            Removed: <span>{currentItem.removed ? ModelFuncs.formatDate(currentItem.removed) : "Not Removed"}</span>
          </h6>

          <Carousel images={currentItem.images} editable={false} />
        </>
      } />

      <div className="mb-4" />

      <Card title="VESSEL PARTICULARS" content={
        <div className="row">
          <div className="col-6">
            <DataTable
              data={data}
              hasPagination={false}
              thead={
                <tr>
                  <th>Item</th>
                  <th>Value</th>
                </tr>
              } tbody={
                data.map((row: any, i) => (
                  <tr key={i}>
                    <td>{row.key}</td>
                    <td>{row.value}</td>
                  </tr>
                ))
              } />
          </div>
          <div className="col-6">
            <div className="position-absolute pr-4">{currentItem.note ?? ""}</div>
            <div
              style={{
                backgroundImage: "url(/assets/images/ships/ship2.png)",
                backgroundSize: "257px 193px",
                backgroundPositionX: "right",
                backgroundPositionY: "bottom",
                backgroundRepeat: "no-repeat",
                height: "100%",
                opacity: 0.3,
              }} />
          </div>
        </div>
      } />
    </div>
  )
}

export default App;