import ModelFuncs from "./ModelMain";

let WaterAreaModel = {
	getAll: ({ filter = {}, includeFilter = {} }) => {
		if (navigator.onLine) {
			return new Promise((resolve, reject) => {
				WaterAreaModel.getStore().then((store) => {
					let request = store.getAll();

					request.onsuccess = () => {
						let cachedData = request.result ? request.result : [];

						cachedData.forEach((data, i) => {
							if (data._operation === "add" || data._operation === "edit") {
								if (data._operation === "add") {
									delete data._id;
								}

								delete data._operation;
								ModelFuncs.put("waterarea", data).then((result) => { });
							} else if (data._operation === "delete") {
								ModelFuncs.delete("waterarea", data._id).then((result) => { });
							}

							store.delete(data._id);
						});

						setTimeout(() => {
							fetch(`${ModelFuncs.getGraphQLServerUrl()}`, {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									query: `{
										waterAreas {
											_id,
											name,
											note,
										}
									}`,
								}),
							})
								.then((response) => response.json())
								.then((result) => {
									if (result.data.waterAreas) {
										WaterAreaModel.getStore().then((store) => {
											store.clear();

											result.data.waterAreas.forEach((data, i) => {
												store.put(data);
											});
										});
									}

									ModelFuncs.filter(result.data.waterAreas, filter, includeFilter).then((res) => {
										resolve(res);
									});
								});
						}, 1000);
					};
				});
			});
		} else {
			return new Promise((resolve, reject) => {
				WaterAreaModel.getStore().then((store) => {
					resolve(ModelFuncs.getCachedAll(store, filter, includeFilter));
				});
			});
		}
	},

	getStore: () => {
		return new Promise((resolve, reject) => {
			ModelFuncs.openIndexedDB().then((db) => {
				resolve(db.transaction('waterareas', 'readwrite').objectStore('waterareas'));
			});
		});
	},
}

export default WaterAreaModel;
