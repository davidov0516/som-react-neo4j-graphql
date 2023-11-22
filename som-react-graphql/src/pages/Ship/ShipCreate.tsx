import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { SharedContext } from '../DataContext';
import PageTitle from '../PageTitle';
import Card from "../Component/Card/Card";
import CheckBoxAndInput from "../Component/CheckBoxAndInput/CheckBoxAndInput";
import Carousel from "../Component/Carousel/Carousel";
import ShipModel from '../../models/ShipModel';

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
  });
  const { sharedObject } = useContext(SharedContext);

  const onSave = () => {
    ShipModel.put({
      ...currentItem,
      removed: currentItem.isRemoved ? currentItem.removed : "",
    }).then((result) => {
      navigate("/ship");
    });

  }

  useEffect(() => {
    if (sharedObject.table !== "ship") {
      return;
    }

    if (sharedObject._id) {
      ShipModel.getAll({ filter: { _id: sharedObject._id } }).then((items) => {
        setCurrentItem({
          ...items[0],
          isRemoved: items[0].removed ? true : false,
        });
      });
    }
  }, [sharedObject]);

  return (
    <div className="app-main__inner">
      <PageTitle
        icon="helm"
        title={currentItem._id ? "Edit Ship" : "Add Ship"}
        content="This is Edit Ship Page. You can add or edit ship here."
      />

      <Card hasHeader={false} content={
        <>
          <div className="form-row">
            <div className="col-md-8">
              <div className="form-row">
                <div className="col-md-6">
                  <div className="position-relative form-group">
                    <label htmlFor="vessel-name" className="">Vessel name</label>
                    <input
                      id="vessel-name"
                      type="text"
                      className="form-control"
                      value={currentItem.vesselName}
                      onChange={(e) =>
                        setCurrentItem((prev) => ({
                          ...prev,
                          vesselName: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="position-relative form-group">
                    <label htmlFor="registered" className="">Registered</label>
                    <input
                      id="registered"
                      type="date"
                      className="form-control"
                      value={currentItem.registered}
                      onChange={(e) =>
                        setCurrentItem((prev) => ({
                          ...prev,
                          registered: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <CheckBoxAndInput
                    title="Removed"
                    value={currentItem.removed ?? ""}
                    checked={currentItem.isRemoved}
                    onInputChange={(value) => {
                      setCurrentItem((prev) => ({
                        ...prev,
                        removed: value,
                      }))
                    }}
                    onCheckChange={(checked) => {
                      setCurrentItem((prev) => ({
                        ...prev,
                        isRemoved: checked,
                      }))
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4 d-flex align-items-end justify-content-end">
              <div className="d-flex">
                <button
                  type="button"
                  className="btn btn-primary mb-3 mr-3"
                  style={{ width: 100 }}
                  data-dismiss="modal"
                  onClick={onSave}>Save</button
                >
                <a href="/" onClick={(e) => {
                  e.preventDefault();
                  navigate("/ship");
                }}>
                  <button
                    type="button"
                    className="btn-transition btn btn-outline-primary mb-3"
                    style={{ width: 100 }}>
                    Cancel
                  </button>
                </a>
              </div>
            </div>
          </div>

          <label htmlFor="registered" className="">Photos</label>
          <Carousel images={currentItem.images} editable={true} changeImages={(newImages: string[]) => {
            setCurrentItem((prev) => ({
              ...prev,
              images: newImages,
            }))
          }} />
        </>
      } />

      <div className="mb-4" />

      <Card title="VESSEL PARTICULARS" content={
        <>
          <div className="form-row">
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="ship-type" className="">Ship Type</label>
                <input
                  id="ship-type"
                  type="text"
                  className="form-control"
                  value={currentItem.shipType}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      shipType: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="year-of-build" className="">Year of Build</label>
                <input
                  id="year-of-build"
                  type="number"
                  className="form-control"
                  value={currentItem.yearOfBuild}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      yearOfBuild: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="flag" className="">Flag</label>
                <input
                  id="flag"
                  type="text"
                  className="form-control"
                  value={currentItem.flag}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      flag: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="homeport" className="">Homeport</label>
                <input
                  id="homeport"
                  type="text"
                  className="form-control"
                  value={currentItem.homePort}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      homePort: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="reg-number" className="">Reg.Number</label>
                <input
                  id="reg-number"
                  type="text"
                  className="form-control"
                  value={currentItem.regNumber}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      regNumber: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="callsign" className="">Callsign</label>
                <input
                  id="callsign"
                  type="text"
                  className="form-control"
                  value={currentItem.callsign}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      callsign: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="imo-number" className="">IMO Number</label>
                <input
                  id="imo-number"
                  type="text"
                  className="form-control"
                  value={currentItem.imoNumber}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      imoNumber: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="gross-tonnage" className="">Gross Tonnage (t)</label>
                <input
                  id="gross-tonnage"
                  type="number"
                  className="form-control"
                  value={currentItem.grossTonnage}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      grossTonnage: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="net-tonnage" className="">Net Tonnage (t)</label>
                <input
                  id="net-tonnage"
                  type="number"
                  className="form-control"
                  value={currentItem.netTonnage}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      netTonnage: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="dead-weight" className="">Deadweight (t)</label>
                <input
                  id="dead-weight"
                  type="number"
                  className="form-control"
                  value={currentItem.deadWeight}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      deadWeight: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="length" className="">Length (m)</label>
                <input
                  id="length"
                  type="number"
                  className="form-control"
                  value={currentItem.length}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      length: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="beam" className="">Beam (m)</label>
                <input
                  id="beam"
                  type="number"
                  className="form-control"
                  value={currentItem.beam}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      beam: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="depth" className="">Depth (m)</label>
                <input
                  id="depth"
                  type="number"
                  className="form-control"
                  value={currentItem.depth}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      depth: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="draught" className="">Draught (m)</label>
                <input
                  id="draught"
                  type="number"
                  className="form-control"
                  value={currentItem.draught}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      draught: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-12">
              <div className="position-relative form-group">
                <label htmlFor="note" className="">Note</label>
                <textarea
                  id="note"
                  className="form-control"
                  value={currentItem.note}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </>
      } />
    </div>
  )
}

export default App;