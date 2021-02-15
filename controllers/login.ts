export const handleLogin = (req: any, res: any, bcrypt: any, Employee: any) => {

    const { username, password } = req.body;

    Employee.findOne({username: username}, (err: any, employee: any) =>{
        if (err){
            console.log(err);
            res.json("error retreiving employee from DB")
        }else{
            if (employee === null){
                res.json('wrong-username');
            }else if (!bcrypt.compareSync(password, employee.password)){
                res.json('wrong-password');
            }else{
                const infoToSend = { username: username, name: employee.name, fulfilledCount: employee.fulfilledCount };
                res.status(200).json(infoToSend);
            }
        }
    });
}



