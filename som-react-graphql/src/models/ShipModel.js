import ModelFuncs from "./ModelMain";

const { v4: uuidv4 } = require("uuid");

let ShipModel = {
	getAll: ({ filter = {}, includeFilter = {} }) => {
		return new Promise((resolve, reject) => {
			fetch(`${ModelFuncs.getGraphQLServerUrl()}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `{
						ships {
							_id
							beam
							callsign
							deadWeight
							certificates {
								_id
								type
								certificateType {
									_id
									name
									issuingAgency
								}
								issue {
									putIn
									department {
										_id
										name
									}
									id
									issue
									expire
									account
									price
									registrationFee
								}
							}
							depth
							draught
							flag
							grossTonnage
							homePort
							images
							imoNumber
							length
							netTonnage
							note
							regNumber
							registered
							removed
							shipType
							vesselName
							yearOfBuild
						}
					}`
				}),
			})
				.then((response) => response.json())
				.then((result) => {
					ModelFuncs.filter(result.data.ships, filter, includeFilter).then((res) => {
						resolve(res);
					});
				});
		});
	},
	put: (data) => {
		let query = '';
		if (data._id) {
			query = `mutation {
				updateShips(
					where: {_id: "${data._id}"},
					update: {
						beam: ${data.beam},
						callsign: "${data.callsign}",
						deadWeight: ${data.deadWeight},
						depth: ${data.depth},
						draught: ${data.draught},
						flag: "${data.flag}",
						grossTonnage: ${data.grossTonnage},
						homePort: "${data.homePort}",
						images: ${data.images ?? []},
						imoNumber: "${data.imoNumber}",
						length: ${data.length},
						netTonnage: ${data.netTonnage},
						note: "${data.note}",
						regNumber: "${data.regNumber}",
						registered: "${data.registered}",
						removed: "${data.removed}",
						shipType: "${data.shipType}",
						vesselName: "${data.vesselName}",
						yearOfBuild: ${data.yearOfBuild}
					}
				) {
					ships {
						_id
					}
				}
			}`
		} else {
			query = `mutation {
				createShips(
					input: {
						_id: "${uuidv4()}"
						beam: ${data.beam},
						callsign: "${data.callsign}",
						deadWeight: ${data.deadWeight},
						depth: ${data.depth},
						draught: ${data.draught},
						flag: "${data.flag}",
						grossTonnage: ${data.grossTonnage},
						homePort: "${data.homePort}",
						images: ${data.images ?? []},
						imoNumber: "${data.imoNumber}",
						length: ${data.length},
						netTonnage: ${data.netTonnage},
						note: "${data.note}",
						regNumber: "${data.regNumber}",
						registered: "${data.registered}",
						removed: "${data.removed}",
						shipType: "${data.shipType}",
						vesselName: "${data.vesselName}",
						yearOfBuild: ${data.yearOfBuild}
					}
				) {
					ships {
						_id
					}
				}
			}`;
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
	},
	delete: (_id) => {
		return new Promise((resolve, reject) => {
			fetch(`${ModelFuncs.getGraphQLServerUrl()}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `
						mutation {
							deleteShips(
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
	},
}


export default ShipModel;