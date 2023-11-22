import ModelFuncs from "./ModelMain";
import MarinerModel from "./MarinerModel";

let ShippingModel = {
	getAll: ({ filter = {}, includeFilter = {} }) => {
		return new Promise((resolve, reject) => {
			ModelFuncs.get('shipping', filter, includeFilter).then((shippings) => {
				MarinerModel.getAll({}).then((mariners) => {
					ModelFuncs.get('ship').then((ships) => {
						ModelFuncs.get('charterer').then((charterers) => {
							ModelFuncs.get('waterarea').then((waterareas) => {
								shippings.forEach((shipping) => {
									shipping.main_ship = ships.find(ship => ship._id === shipping.main_ship_id);
									shipping.main_charterer = charterers.find(charterer => charterer._id === shipping.main_charterer_id);

									if (shipping.cost_crews != null) {
										shipping.cost_crews.forEach((cost_crew) => {
											cost_crew.mariner = mariners.find(mariner => mariner._id === cost_crew.mariner_id);
										});
									}

									shipping.mariners = [];
									mariners.forEach((mariner) => {
										if (mariner.shipId === shipping.main_ship_id) {
											shipping.mariners.push(mariner);
										}
									});

									[
										'departure_areas',
										'navigation_areas',
										'arrived_areas',
									].forEach((item) => {
										if (shipping[item] != null) {
											shipping[item].forEach((area) => {
												waterareas.forEach((waterarea) => {
													if (waterarea._id === area.area_id) {
														area.area = waterarea;
													}
												});
											});
										}
									});
								});

								resolve(shippings);
							});
						});
					});
				});
			});
		});
	},
}

export default ShippingModel;