export const handleGetItem = (req: any, res: any, Product: any) => {
    const itemId = <string>(req.params.itemId);
	
	Product.findOne({id: itemId},(err: any, product: any) => {
		if(err){
			console.log(err);
			res.json("error retreiving product from DB")
		}else{
			res.send({
				id: itemId,
				name: product.name,
				price: product.price,
				image: product.image,
			});
		}	
	});
  }
  