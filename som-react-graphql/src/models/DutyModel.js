import ModelFuncs from "./ModelMain";

let DutyModel = {
	getAll: ({ filter = {}, includeFilter = {} }) => {
		return new Promise((resolve, reject) => {
			fetch(`${ModelFuncs.getGraphQLServerUrl()}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `{
						duties {
							_id
							name
						}
					}`
				}),
			})
				.then((response) => response.json())
				.then((result) => {
					ModelFuncs.filter(result.data.duties, filter, includeFilter).then((res) => {
						resolve(res);
					});
				});
		});
	},
}

export default DutyModel;