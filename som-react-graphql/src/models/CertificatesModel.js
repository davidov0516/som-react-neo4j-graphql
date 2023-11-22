import ModelFuncs from "./ModelMain";
const { v4: uuidv4 } = require("uuid");

let CertificateModel = {
	getAll: ({ filter = {}, includeFilter = {} }) => {
		return new Promise((resolve, reject) => {
			fetch(`${ModelFuncs.getGraphQLServerUrl()}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `{
						certificates {
							_id
							type
							certificateType {
								_id
								issuingAgency
								name
								note
								type
							}
							issue {
								account
								expire
								id
								issue
								price
								putIn
								registrationFee
								department {
									_id
									name
								}
							}
							person {
								_id
								duty {
									_id
									name
								}
								name
								platoon {
									_id
									name
								}
								ship {
									_id
									vesselName
								}
								job {
									_id
									name
								}
							}
							ship {
								_id
								vesselName
							}
						}
					}`
				}),
			}).then((response) => response.json())
				.then((result) => {
					result.data.certificates.forEach((cert) => {
						cert.personId = cert.person?._id;
						cert.shipId = cert.ship?._id;
						cert.certificateTypeId = cert.certificateType?._id;
						cert.issue.departmentId = cert.issue?.department?._id;
					})

					ModelFuncs.filter(result.data.certificates, filter, includeFilter).then((res) => {
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
					updateCertificates(
						where: { _id: "${data._id}" },
						update: {
							type: "${data.type ?? ""}"
							certificateType: {
								disconnect: {},
								connect: {
									where: {
										node: {
											_id: "${data.certificateTypeId ?? ""}"
										}
									}
								}
							}
							ship: {
								disconnect: {},
								connect: {
									where: {
										node: {
											_id: "${data.shipId ?? ""}"
										}
									}
								}
							}
							person: {
								disconnect: {},
								connect: {
									where: {
										node: {
											_id: "${data.personId ?? ""}"
										}
									}
								}
							}
							issue: {
								update: {
									node: {
										account: "${data.issue?.account ?? ""}"
										expire: "${data.issue && data.issue.expire !== "" ? data.issue.expire : "1970-01-01"}"
										putIn: "${data.issue && data.issue.putIn !== "" ? data.issue.putIn : "1970-01-01"}"
										id: "${data.issue?.id ?? ""}"
										issue: "${data.issue && data.issue.issue !== "" ? data.issue.issue : "1970-01-01"}"
										price: ${data.issue?.price ?? 0}
										registrationFee: ${data.issue?.registrationFee ?? 0}
										department: {
											disconnect: {}
											connect: {
												where: {
													node: {
														_id: "${data.issue ? data.issue.departmentId : ""}"
													}
												}
											}
										}
									}
								}
							}
						}
					) {
						certificates {
							_id
						}
					}
				}
			`;
		} else {
			query = `mutation {
            	createCertificates(
              		input: {
						_id: "${uuidv4()}"
						type: "${data.type ?? ""}"
						certificateType: {
							connect: {
								where: {
									node: {
										_id: "${data.certificateTypeId ?? ""}"
									}
								}
							}
						}
						ship: {
							connect: {
								where: {
									node: {
										_id: "${data.shipId ?? ""}"
									}
								}
							}
						}
						person: {
							connect: {
								where: {
									node: {
										_id: "${data.personId ?? ""}"
									}
								}
							}
						}
						issue: {
							create: {
								node: {
									account: "${data.issue?.account ?? ""}"
									expire: "${data.issue && data.issue.expire !== "" ? data.issue.expire : "1970-01-01"}"
									putIn: "${data.issue && data.issue.putIn !== "" ? data.issue.putIn : "1970-01-01"}"
									id: "${data.issue?.id ?? ""}"
									issue: "${data.issue && data.issue.issue !== "" ? data.issue.issue : "1970-01-01"}"
									price: ${data.issue?.price ?? 0}
									registrationFee: ${data.issue?.registrationFee ?? 0}
									department: {
										connect: {
											where: {
												node: {
													_id: "${data.issue ? data.issue.departmentId : ""}"
												}
											}
										}
									}
								}
							}
						}
					}
				) {
					certificates {
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
							deleteCertificates(
								where: { _id: "${_id}" },
								delete: {
									issue: {}
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

export default CertificateModel;