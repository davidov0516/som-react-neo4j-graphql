import WaterAreaModel from './WaterAreaModel';
const { v4: uuidv4 } = require('uuid');

let ModelFuncs = {
  openIndexedDB: () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('som', 10);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        [
          'waterareas',
        ].forEach((store) => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: '_id' });
          }
        });
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },
  filter: (data, filter, includeFilter) => {
    return new Promise((resolve, reject) => {
      let filtered = [];

      data.forEach((item) => {
        let matched = true;

        if (filter && Object.keys(filter).length) {
          Object.keys(filter).forEach((key) => {
            if (filter[key]) {
              if (Array.isArray(filter[key])) {
                filter[key] = filter[key].map(item => item.toString());

                if (!eval(`item.${key}`) || filter[key].indexOf(eval(`item.${key}`).toString()) === -1) {  // eslint-disable-line no-eval
                  matched = false;
                }
              } else {
                if ((eval(`item.${key}`) !== filter[key])) { // eslint-disable-line no-eval
                  matched = false;
                }
              }
            }
          });
        }

        if (includeFilter && Object.keys(includeFilter).length) {
          Object.keys(includeFilter).forEach((key) => {
            if (includeFilter[key] && (!eval(`item.${key}`) || (eval(`item.${key}`).toLowerCase().indexOf(includeFilter[key].toLowerCase()) === -1))) {  // eslint-disable-line no-eval
              matched = false;
            }
          });
        }

        if (matched) {
          filtered.push(item);
        }
      });

      resolve(filtered);
    });
  },
  getServerUrl: () => {
    return "http://localhost:8083";
  },
  getGraphQLServerUrl: () => {
    return "http://localhost:8084";
  },
  formatDate: (date) => {
    date = new Date(date);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  },
  period_total_days: (from, to) => {
    // Convert the date strings to Date objects
    let startDate = new Date(from);
    let endDate = new Date(to);

    // Calculate the difference in milliseconds
    let timeDifference = Math.abs(endDate.getTime() - startDate.getTime());
    // Calculate the number of days
    let dayMilliSeconds = 1000 * 60 * 60 * 24;
    let totalDays = Math.floor(timeDifference / dayMilliSeconds);

    return isNaN(totalDays) ? 0 : totalDays;
  },
  get: (table, filter, includeFilter) => {
    return new Promise((resolve, reject) => {
      fetch(`${ModelFuncs.getServerUrl()}/${table}/find/`)
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            resolve({ result: [] });
          }
        });
    }).then(({ result }) => {
      return ModelFuncs.filter(result, filter, includeFilter);
    });
  },
  put: (table, data) => {
    if (navigator.onLine) {
      let title = {
        waterarea: {
          create: 'createWaterAreas',
          update: 'updateWaterAreas',
          normal: 'waterAreas',
        },
        charterer: {
          create: 'createCharterers',
          update: 'updateCharterers',
          normal: 'charterers',
        },
        certificatetype: {
          create: 'createCertificateTypes',
          update: 'updateCertificateTypes',
          normal: 'certificateTypes',
        },
      }[table];

      let query = '';
      if (data._id) {
        query = `
            mutation {
              ${title.update}(
                where: { _id: "${data._id}" },
                update: {
                  ${Object.keys(data).map((key) => { return `${key}: "${data[key]}" `; }).join(',')}
              }) {
                ${title.normal} {${Object.keys(data).join(',')}}
              }
            }
          `;
      } else {
        delete data._id;
        query = `
            mutation {
              ${title.create}(
                input: { _id: "${uuidv4()}",
                ${Object.keys(data).map((key) => { return `${key}: "${data[key]}" `; }).join(',')}
              }) {
                ${title.normal} {${Object.keys(data).join(',')}}
              }
            }
          `;
      }

      return new Promise((resolve, reject) => {
        fetch(`${ModelFuncs.getGraphQLServerUrl()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            resolve({ result });
          })
      });
    } else {
      return new Promise((resolve, reject) => {
        let model = {
          waterarea: WaterAreaModel,
        }[table];

        model.getStore().then((store) => {
          store.put({
            ...data,
            _operation: data._operation ?? (data._id ? "edit" : "add"),
            _id: data._id ? data._id : uuidv4(),
          });

          resolve({});
        });
      });
    }
  },
  delete: (table, _id) => {
    if (navigator.onLine) {
      let title = {
        waterarea: {
          delete: 'deleteWaterAreas',
        },
        charterer: {
          delete: 'deleteCharterers',
        },
        certificatetype: {
          delete: 'deleteCertificateTypes',
        },
      }[table];

      return new Promise((resolve, reject) => {
        fetch(`${ModelFuncs.getGraphQLServerUrl()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              mutation {
                ${title.delete}(
                  where: { _id: "${_id}" },
                )
                {
                  nodesDeleted
                }
              }
            `
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            resolve({ result });
          })
      });
    } else {
      return new Promise((resolve, reject) => {
        let model = {
          waterarea: WaterAreaModel,
        }[table];

        model.getStore().then((store) => {
          store.put({
            _id,
            _operation: "delete",
          });

          resolve({});
        });
      });
    }
  },
  getCachedAll: (store, filter, includeFilter) => {
    return new Promise((resolve, reject) => {
      let request = store.getAll();

      request.onsuccess = () => {
        let result = request.result ? request.result : [];
        let filtered = result.filter(item => item._operation !== "delete");

        resolve(ModelFuncs.filter(filtered, filter, includeFilter));
      };
    });
  }
}

export default ModelFuncs;