import ModelFuncs from "./ModelMain";

let ChartererModel = {
	getAll: ({ filter = {}, includeFilter = {} }) => {
		return new Promise((resolve, reject) => {
			fetch(`${ModelFuncs.getGraphQLServerUrl()}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `{
						charterers {
							_id,
							company,
							nation,
							phone,
							email,
							note,
						}
					}`
				}),
			})
				.then((response) => response.json())
				.then((result) => {
					ModelFuncs.filter(result.data.charterers, filter, includeFilter).then((res) => {
						resolve(res);
					});
				});
		});
	},
}

export default ChartererModel;