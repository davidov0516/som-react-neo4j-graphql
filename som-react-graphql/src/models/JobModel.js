import ModelFuncs from "./ModelMain";

let JobModel = {
	getAll: ({ filter = {}, includeFilter = {} }) => {
		return new Promise((resolve, reject) => {
			fetch(`${ModelFuncs.getGraphQLServerUrl()}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `{
						jobs {
							_id
							name
						}
					}`
				}),
			})
				.then((response) => response.json())
				.then((result) => {
					ModelFuncs.filter(result.data.jobs, filter, includeFilter).then((res) => {
						resolve(res);
					});
				});
		});
	},
}

export default JobModel;