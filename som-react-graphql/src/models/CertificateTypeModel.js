import ModelFuncs from "./ModelMain";

let CertificateTypeModel = {
	getAll: ({ filter = {}, includeFilter = {} }) => {
		return new Promise((resolve, reject) => {
			fetch(`${ModelFuncs.getGraphQLServerUrl()}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `{
						certificateTypes {
							_id
							issuingAgency
							name
							note
							type
						  }
					}`
				}),
			})
				.then((response) => response.json())
				.then((result) => {
					ModelFuncs.filter(result.data.certificateTypes, filter, includeFilter).then((res) => {
						resolve(res);
					});
				});
		});
	},
}

export default CertificateTypeModel;