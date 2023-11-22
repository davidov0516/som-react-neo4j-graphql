import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import PageTitle from '../PageTitle';
import Select from '../Component/Select/Select';
import Card from '../Component/Card/Card'
import { SharedContext } from '../DataContext';
import CheckBoxAndInput from '../Component/CheckBoxAndInput/CheckBoxAndInput';
import ModelFuncs from '../../models/ModelMain';
import MarinerModel from '../../models/MarinerModel';
import ShipModel from '../../models/ShipModel';
import DutyModel from '../../models/DutyModel';
import PlatoonModel from '../../models/PlatoonModel';
import JobModel from '../../models/JobModel';

interface Mariner {
  _id: string,
  birthday: string,
  boardedYears: number,
  code: number,
  dailyFee: number,
  duty: {
    _id: string,
  },
  homePhone: string,
  image: string,
  isRemoved: boolean,
  job: {
    _id: string
  },
  mobilePhone: string,
  name: string,
  note: string,
  placeOfBorn: string,
  placeOfResidence: string,
  platoon: {
    _id: string,
  },
  previousAffiliation: string,
  qualificationGrade: string,
  registered: string,
  removed: string,
  retired: string,
  ship: {
    _id: string,
  },
  graduated: { date: string, note: string },
}

function App() {
  let fileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState<Mariner>({
    _id: "",
    birthday: "",
    boardedYears: 0,
    code: 0,
    dailyFee: 0,
    duty: {
      _id: "",
    },
    homePhone: "",
    image: "",
    isRemoved: false,
    job: {
      _id: "",
    },
    mobilePhone: "",
    name: "",
    note: "",
    placeOfBorn: "",
    placeOfResidence: "",
    platoon: {
      _id: "",
    },
    previousAffiliation: "",
    qualificationGrade: "",
    registered: "",
    removed: "",
    retired: "",
    ship: {
      _id: "",
    },
    graduated: { date: "", note: "" },
  });

  const { sharedObject } = useContext(SharedContext);
  const [ships, setShips] = useState<any[]>([]);
  const [duties, setDuties] = useState<any[]>([]);
  const [platoons, setPlatoons] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  const onSave = () => {
    MarinerModel.put({
      ...currentItem,
      removed: currentItem.isRemoved ? currentItem.removed : "",
    }).then((result) => {
      navigate("/mariner");
    });
  }

  function initSelect() {
    ShipModel.getAll({}).then((res) => {
      setShips(res);
    });

    DutyModel.getAll({}).then((res) => {
      setDuties(res);
    });

    PlatoonModel.getAll({}).then((res) => {
      setPlatoons(res);
    });

    JobModel.getAll({}).then((res) => {
      setJobs(res);
    });
  }

  const onImageChange = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    fetch(`${ModelFuncs.getServerUrl()}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentItem({
          ...currentItem,
          image: data.filename,
        });
      });
  }

  useEffect(() => {
    initSelect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sharedObject.table !== "mariner") {
      return;
    }

    if (sharedObject._id) {
      MarinerModel.getAll({ filter: { _id: sharedObject._id } }).then((items) => {
        setCurrentItem({
          ...items[0],
          isRemoved: items[0].removed ? true : false,
        });
      });
    } else {
      setCurrentItem({
        _id: "",
        birthday: "",
        boardedYears: 0,
        code: 0,
        dailyFee: 0,
        duty: {
          _id: "",
        },
        homePhone: "",
        image: "",
        isRemoved: false,
        job: {
          _id: "",
        },
        mobilePhone: "",
        name: "",
        note: "",
        placeOfBorn: "",
        placeOfResidence: "",
        platoon: {
          _id: "",
        },
        previousAffiliation: "",
        qualificationGrade: "",
        registered: "",
        removed: "",
        retired: "",
        ship: {
          _id: "",
        },
        graduated: { date: "", note: "" }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedObject]);

  // useEffect(() => {
  //   initTable();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);


  return (
    <div className="app-main__inner">
      <PageTitle
        icon="users"
        title={currentItem._id ? "Edit Mariner" : "Add Mariner"}
        content="This is Edit Mariner Page. You can add or edit mariner here."
      />
      <Card hasHeader={false}
        content={
          <>
            <div className="form-row">
              <div className="col-md-4">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    if (fileInput && fileInput.current) {
                      fileInput.current.click();
                    }
                  }}
                ><img
                    className="w-100 cursor-pointer"
                    alt="mariner"
                    src={currentItem.image
                      ? `${ModelFuncs.getServerUrl()}/uploads/${currentItem.image}`
                      : "/assets/images/mariners/placeholder.png"}
                  />
                </a>
                <input
                  className="d-none"
                  type="file"
                  ref={fileInput}
                  onChange={(event) => {
                    if (event.target.files && event.target.files.length) {
                      onImageChange(event.target.files[0]);
                    }
                  }}
                />
              </div>

              <div className="col-md-5 px-3">
                <div className="position-relative form-group">
                  <label htmlFor="mariner-name">Name</label>
                  <input
                    id="mariner-name"
                    type="text"
                    className="form-control"
                    value={currentItem.name ?? ""}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))}
                  />
                </div>
                <div className="position-relative form-group">
                  <label htmlFor="selectMarnier">Ship</label>
                  <Select
                    data={ships}
                    valueKey="_id"
                    titleKey="vesselName"
                    placeholder="Select a Ship"
                    value={currentItem.ship?._id ?? ""}
                    onChange={(value) =>
                      setCurrentItem((prev: any) => ({
                        ...prev,
                        ship: {
                          _id: value,
                        }
                      }))
                    }
                  />
                </div>
                <div className="position-relative form-group">
                  <label htmlFor="birthday">Birthday</label>
                  <input
                    id="birthday"
                    type="date"
                    className="form-control"
                    value={currentItem.birthday ?? ""}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        birthday: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="position-relative form-group">
                  <label htmlFor="selectDuty">Duty</label>
                  <Select
                    data={duties}
                    valueKey="_id"
                    titleKey="name"
                    value={currentItem.duty?._id ?? ""}
                    placeholder="Select a Duty"
                    onChange={(value) => {
                      setCurrentItem((prev: any) => ({
                        ...prev,
                        duty: {
                          _id: value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="position-relative form-group">
                      <label htmlFor="registered">Registered</label>
                      <input
                        id="registered"
                        type="date"
                        className="form-control"
                        value={currentItem.registered ?? ""}
                        onChange={(e) =>
                          setCurrentItem((prev) => ({
                            ...prev,
                            registered: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <CheckBoxAndInput
                      title="Retired"
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
              <div className="col-md-3 d-flex justify-content-end">
                <div className="d-flex">
                  <button
                    type="button"
                    className="btn btn-primary mb-3 mr-3"
                    style={{ width: 100 }}
                    data-dismiss="modal"
                    onClick={onSave}>
                    Save
                  </button>
                  <a href='/' onClick={(e) => {
                    e.preventDefault();
                    navigate("/mariner");
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
          </>
        } />

      <div className='mb-4' />

      <Card title="MARINER PARTICULARS" content={
        <>
          <div className="form-row">
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="selectDuty">Job</label>
                <Select
                  data={jobs}
                  valueKey="_id"
                  titleKey="name"
                  value={currentItem.job?._id ?? ""}
                  placeholder="Select a Job"
                  onChange={(value) => {
                    setCurrentItem((prev: any) => ({
                      ...prev,
                      job: {
                        _id: value,
                      },
                    }));
                  }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="dailiyfee">Daily fee</label>
                <input
                  id="dailyfee"
                  type="number"
                  className="form-control"
                  value={currentItem.dailyFee ?? 0}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      dailyFee: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="selectPlatoon">P----</label>
                <Select
                  data={platoons}
                  valueKey="_id"
                  titleKey="name"
                  value={currentItem.platoon?._id ?? ""}
                  placeholder="Select a Platoon"
                  onChange={(value) => {
                    setCurrentItem((prev: any) => ({
                      ...prev,
                      platoon: {
                        _id: value,
                      },
                    }));
                  }}
                />
              </div>
            </div>
            <div className="col-md-8">
              <div className="position-relative form-group">
                <label htmlFor="Previous-affiliation">Previous affiliation </label>
                <input
                  id="Previous-affiliation"
                  type="text"
                  placeholder="ABC.corp"
                  className="form-control"
                  value={currentItem.previousAffiliation ?? ""}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      previousAffiliation: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="placeOfBorn">Place of Born</label>
                <input
                  id="placeOfBorn"
                  type="text"
                  className="form-control"
                  value={currentItem.placeOfBorn ?? ""}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      placeOfBorn: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="placeOfResidence">Place of Residence</label>
                <input
                  id="placeOfResidence"
                  type="text"
                  className="form-control"
                  value={currentItem.placeOfResidence ?? ""}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      placeOfResidence: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="code">Code</label>
                <input
                  id="code"
                  type="number"
                  className="form-control"
                  value={currentItem.code ? currentItem.code.toString() : ""}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      code: Number(e.target.value)
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="mobile-phone">Mobile Phone</label>
                <input
                  id="mobile-phone"
                  type="text"
                  className="form-control"
                  value={currentItem.mobilePhone ?? ""}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      mobilePhone: e.target.value
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="home-phone">Home Phone</label>
                <input
                  id="home-phone"
                  type="text"
                  className="form-control"
                  value={currentItem.homePhone ?? ""}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      homePhone: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-8">
              <div className="position-relative form-group">
                <label htmlFor="graduated">Graduated</label>
                <input
                  id="graduated"
                  type="text"
                  className="form-control"
                  value={currentItem.graduated ? currentItem.graduated.note : ""}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      graduated: {
                        ...prev.graduated,
                        note: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="graduated-date">&nbsp;</label>
                <input
                  id="graduated-date"
                  type="date"
                  className="form-control"
                  value={currentItem.graduated ? currentItem.graduated.date : ""}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      graduated: {
                        ...prev.graduated,
                        date: e.target.value,
                      }
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="qualification-grade">Qualification Grade</label>
                <input
                  id="qualification-grade"
                  type="text"
                  className="form-control"
                  value={currentItem.qualificationGrade ?? ""}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      qualificationGrade: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative form-group">
                <label htmlFor="boarded-years">Boarded Years</label>
                <input
                  id="boarded-years"
                  type="number"
                  className="form-control"
                  value={currentItem.boardedYears ?? 0}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({
                      ...prev,
                      boardedYears: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-12">
              <div className="position-relative form-group">
                <label htmlFor="mariner-note">Note</label>
                <textarea
                  id="mariner-note"
                  className="form-control"
                  value={currentItem.note ?? ""}
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
