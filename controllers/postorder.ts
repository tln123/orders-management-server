export const handlePostOrder = (req: any, res: any, Order: any, Employee: any) => {
	const orderId = parseInt(req.params.orderId);
	const { fulfillmentStatus, employeeUN } = req.body;

	if (fulfillmentStatus === 'not-fulfilled') {
		Order.findOne({ id: orderId }, (err: any, order: any) => {
			if (err) {
				console.log(err);
			} else {
				if (order.fulfillmentStatus === 'not-fulfilled') {
					res.json('already marked as not-fulfilled')
				} else {
					Order.updateOne({ id: orderId }, { fulfillmentStatus: fulfillmentStatus }, (err: any) => {
						if (err) {
							console.log(err);
						} else {
							console.log('orders DB updated');
							if (order.fulfillmentStatus !== 'fulfilled') {
								const oldEmployeeUN = order.fulfillmentStatus.split('-')[2];
								Employee.findOne({ username: oldEmployeeUN }, async (err: any, employee: any) => {
									if (err) {
										console.log(err);
									} else {
										const newFulfilCount: number = employee.fulfilledCount - 1;
										await Employee.updateOne({ username: oldEmployeeUN }, { fulfilledCount: newFulfilCount }, (err: any) => {
											if (err) {
												console.log(err);
											} else {
												console.log('employee db updated');
											}
										});
									}
								});
							}
						}
					});
					res.status(200).json('success');
				}
			}
		});
	} else {  //fulfillmentStatus === 'fulfilled' || === 'fullfilled-by-USERNAME'
		Order.findOne({ id: orderId }, (err: any, order: any) => {
			if (err) {
				console.log(err);
				res.json("error retreiving order from DB")
			} else {
				if (order.fulfillmentStatus.split('-')[0] === 'fulfilled') {
					res.json('already-fulfilled');
				} else {
					Order.updateOne({ id: orderId }, { fulfillmentStatus: fulfillmentStatus }, (err: any) => {
						if (err) {
							console.log(err);
							res.json('error updating DB');
						} else {
							console.log("orders DB updated");
							Employee.findOne({ username: employeeUN }, async (err: any, employee: any) => {
								if (err) {
									console.log(err);
								} else {
									const newFulfilCount: number = employee.fulfilledCount + 1;
									await Employee.updateOne({ username: employeeUN }, { fulfilledCount: newFulfilCount }, (err: any) => {
										if (err) {
											console.log(err);
										} else {
											console.log('employee db updated');
										}
									});
								}
							})
							res.status(200).json('success');
						}
					});
				}
			}
		});
	}

}
