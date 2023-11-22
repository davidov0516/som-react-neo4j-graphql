import ModelFuncs from "./ModelMain";

let PlatoonModel = {
	getAll: ({ filter = {}, includeFilter = {} }) => {
		return new Promise((resolve, reject) => {
			fetch(`${ModelFuncs.getGraphQLServerUrl()}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `{
						platoons {
							_id
							name
						}
					}`
				}),
			})
				.then((response) => response.json())
				.then((result) => {
					ModelFuncs.filter(result.data.platoons, filter, includeFilter).then((res) => {
						resolve(res);
					});
				});
		});
	},
}

export default PlatoonModel;