const getFilter = (filterString: string): string => {
	return filterString.replace(' ', '-').toLowerCase();
}

const getReturnObj = (orders: any[], page: number, PAGE_SIZE: number): {length: number, unfulfilledCount: number, ordersToReturn: any[]} => {
	let i: number, unfulfilledCount: number = 0;
	for (i = 0; i < orders.length; i++) {
		if (orders[i].fulfillmentStatus === "not-fulfilled")
			unfulfilledCount++;
	}

	const ordersToReturn: any[] = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const returnObj: { length: number, unfulfilledCount: number, ordersToReturn: any[] } =
		{ length: orders.length, unfulfilledCount: unfulfilledCount, ordersToReturn: ordersToReturn };
	return returnObj;
}


export const handleGetOrders = (PAGE_SIZE: number, req: any, res: any, Order: any, Product: any) => {
	const page = <number>(req.query.pageNumber || 1);
	const searchValue = <string>(req.query.searchValue);
	const fulfillmentFilter = getFilter(<string>(req.query.fulfillmentFilter));
	const paymentFilter = getFilter(<string>(req.query.paymentFilter));
	const searchMethod = <string>(req.query.searchMethod);


	if (searchMethod === 'Name'){
		if (fulfillmentFilter === 'no-filter' && paymentFilter === 'no-filter'){
			Order.find({ 'customer.name': {$regex: searchValue, $options: "i"} }, (err: any, orders: any) => {
				if (err) {
					console.log(err);
					res.json('error retrieving orders from DB');
				} else {
					res.send(getReturnObj(orders, page, PAGE_SIZE));
				}
			});
		}else if (fulfillmentFilter !== 'no-filter' && paymentFilter === 'no-filter'){
			Order.find({ 'customer.name': {$regex: searchValue, $options: "i"}, fulfillmentStatus: fulfillmentFilter }, (err: any, orders: any) => {
				if (err) {
					console.log(err);
					res.json('error retrieving orders from DB');
				} else {
					res.send(getReturnObj(orders, page, PAGE_SIZE));
				}
			});
		}else if (fulfillmentFilter === 'no-filter' && paymentFilter !== 'no-filter'){
			Order.find({ 'customer.name': {$regex: searchValue, $options: "i"}, 'billingInfo.status': paymentFilter }, (err: any, orders: any) => {
				if (err) {
					console.log(err);
					res.json('error retrieving orders from DB');
				} else {
					res.send(getReturnObj(orders, page, PAGE_SIZE));
				}
			});
		}else{
			Order.find({ 'customer.name': {$regex: searchValue, $options: "i"}, fulfillmentStatus: fulfillmentFilter , 'billingInfo.status': paymentFilter }, 
			(err: any, orders: any) => {
				if (err) {
					console.log(err);
					res.json('error retrieving orders from DB');
				} else {
					res.send(getReturnObj(orders, page, PAGE_SIZE));
				}
			});
		}
	}else if (searchMethod === 'Order ID'){
		Order.findOne({id: searchValue}, (err: any, order: any) => {
			if (err){
				console.log(err);
			}else{
				//{ length: orders.length, unfulfilledCount: unfulfilledCount, ordersToReturn: ordersToReturn };
				const unfulfilledCount = order.fulfillmentStatus === 'not-fulfilled' ? 1 : 0;
				const returnObj: { length: number, unfulfilledCount: number, ordersToReturn: any[] } = 
				{length: 1, unfulfilledCount: unfulfilledCount, ordersToReturn: [order]};
				res.send(returnObj);
			}
		})
	}else{ //searchMethod === item name
		Product.find({name: {$regex: searchValue, $options: "i"} }, async (err: any, products: any) => {
			if (err){
				console.log(err);
			}else{
				let filteredOrders: any[] = [];
				let i: number;
				for (i = 0; i < products.length; i++){
					if (fulfillmentFilter === 'no-filter' && paymentFilter === 'no-filter'){
						await Order.find({'items.id': products[i].id}, (err: any, orders: any) => {
							if (err){
								console.log(err);
							}else{
								orders.forEach((order: any) => {
									filteredOrders.push(order);
								});
							}
	
							if (i === products.length - 1){
								res.send(getReturnObj(filteredOrders, page, PAGE_SIZE));
							}
						});
					}else if (fulfillmentFilter !== 'no-filter' && paymentFilter === 'no-filter'){
						await Order.find({'items.id': products[i].id, fulfillmentStatus: fulfillmentFilter}, (err: any, orders: any) => {
							if (err){
								console.log(err);
							}else{
								orders.forEach((order: any) => {
									filteredOrders.push(order);
								});
							}
	
							if (i === products.length - 1){
								res.send(getReturnObj(filteredOrders, page, PAGE_SIZE));
							}
						});
					}else if (fulfillmentFilter === 'no-filter' && paymentFilter !== 'no-filter'){
						await Order.find({'items.id': products[i].id, 'billingInfo.status': paymentFilter}, (err: any, orders: any) => {
							if (err){
								console.log(err);
							}else{
								orders.forEach((order: any) => {
									filteredOrders.push(order);
								});
							}
	
							if (i === products.length - 1){
								res.send(getReturnObj(filteredOrders, page, PAGE_SIZE));
							}
						});
					}else{ // fullfillmentFilter !== no filter && paymentFilter !== no filter
						await Order.find({'items.id': products[i].id, fulfillmentStatus: fulfillmentFilter, 'billingInfo.status': paymentFilter}, 
						(err: any, orders: any) => {
							if (err){
								console.log(err);
							}else{
								orders.forEach((order: any) => {
									filteredOrders.push(order);
								});
							}
	
							if (i === products.length - 1){
								res.send(getReturnObj(filteredOrders, page, PAGE_SIZE));
							}
						});
					}
				}
			}
		});		
	}

}


