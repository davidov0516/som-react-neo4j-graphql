import ModelFuncs from "./ModelMain";
const { v4: uuidv4 } = require("uuid");

let MarinerModel = {
	getAll: ({ filter = {}, includeFilter = {} }) => {
		return new Promise((resolve, reject) => {
			fetch(`${ModelFuncs.getGraphQLServerUrl()}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `{
						mariners {
							_id
							birthday
							boardedYears
							code
							dailyFee
							duty {
								_id
								name
							}
							homePhone
							image
							job {
								_id
								name
							}
							mobilePhone
							name
							note
							placeOfBorn
							placeOfResidence
							platoon {
								_id
								name
							}
							previousAffiliation
							qualificationGrade
							registered
							removed
							retired
							ship {
								_id
								vesselName
							}
							graduated {
								date
								note
							}
							certificates {
								_id
								type
								certificateType {
									_id
									name
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
						}
					}`
				}),
			})
				.then((response) => response.json())
				.then((result) => {
					ModelFuncs.filter(result.data.mariners, filter, includeFilter).then((res) => {
						resolve(res);
					});
				});
		});
	},
	put: (data) => {
		let query = '';
		if (data._id) {
			query = `
				mutation {
					updateMariners(
						where: { _id: "${data._id}" },
						update: {
							birthday: "${data.birthday ?? ""}"
							boardedYears: ${data.boardedYears}
							code: ${data.code}
							dailyFee: ${data.dailyFee}
							duty: {
								disconnect: {},
								connect: {
									where: {
										node: {
											_id: "${data.duty?._id ?? ""}"
										}
									}
								}
							}
							homePhone: "${data.homePhone ?? ""}"
							image: "${data.image ?? ""}"
							job: {
								disconnect: {},
								connect: {
									where: {
										node: {
											_id: "${data.job?._id ?? ""}"
										}
									}
								}
							}
							mobilePhone: "${data.mobilePhone ?? ""}"
							name: "${data.name ?? ""}"
							note: "${data.note ?? ""}"
							placeOfBorn: "${data.placeOfBorn ?? ""}"
							placeOfResidence: "${data.placeOfResidence ?? ""}"
							platoon: {
								disconnect: {},
								connect: {
									where: {
										node: {
											_id: "${data.platoon?._id ?? ""}"
										}
									}
								}
							}
							previousAffiliation: "${data.previousAffiliation ?? ""}"
							qualificationGrade: "${data.qualificationGrade ?? ""}"
							registered: "${data.registered ?? ""}"
							removed: "${data.removed ?? ""}"
							retired: "${data.retired ?? ""}"
							ship: {
								disconnect: {},
								connect: {
									where: {
										node: {
											_id: "${data.ship?._id ?? ""}"
										}
									}
								}
							}
							graduated: {
								update: {
									node: {
										date: "${data.graduated?.date ?? ""}"
										note: "${data.graduated?.note ?? ""}"
									}
								}
							}
						}
					) {
						mariners {
							_id
						}
					}
				}
			`;
		} else {
			query = `
          mutation {
            createMariners(
              input: {
								_id: "${uuidv4()}"
								birthday: "${data.birthday ?? ""}"
								boardedYears: ${data.boardedYears}
								code: ${data.code}
								dailyFee: ${data.dailyFee}
								duty: {
									connect: {
										where: {
											node: {
												_id: "${data.duty?._id ?? ""}"
											}
										}
									}
								}
								homePhone: "${data.homePhone ?? ""}"
								image: "${data.image ?? ""}"
								job: {
									connect: {
										where: {
											node: {
												_id: "${data.job?._id ?? ""}"
											}
										}
									}
								}
								mobilePhone: "${data.mobilePhone ?? ""}"
								name: "${data.name ?? ""}"
								note: "${data.note ?? ""}"
								placeOfBorn: "${data.placeOfBorn ?? ""}"
								placeOfResidence: "${data.placeOfResidence ?? ""}"
								platoon: {
									connect: {
										where: {
											node: {
												_id: "${data.platoon?._id ?? ""}"
											}
										}
									}
								}
								previousAffiliation: "${data.previousAffiliation ?? ""}"
								qualificationGrade: "${data.qualificationGrade ?? ""}"
								registered: "${data.registered ?? ""}"
								removed: "${data.removed ?? ""}"
								retired: "${data.retired ?? ""}"
								ship: {
									connect: {
										where: {
											node: {
												_id: "${data.ship?._id ?? ""}"
											}
										}
									}
								}
								graduated: {
									create: {
                    node: {
                      date: "${data.graduated?.date ?? ""}"
                      note: "${data.graduated?.note ?? ""}"
                    }
                  }
								}
							}
            ) {
							mariners {
								_id
							}
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
							deleteMariners(
								where: { _id: "${_id}" },
								delete: {
									graduated: {}
								}
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

export default MarinerModel;