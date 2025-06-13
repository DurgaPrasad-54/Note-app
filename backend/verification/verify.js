const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config({path: './backend/.env'});
const Token = process.env.TOKEN


function verify(req,res,next){
    const auth = req.headers['authorization'];
    if(!auth){
        return res.send({message:"Header is missing"})
    }
    const token = auth.split(' ')[1]

    if(!token){
        return res.send({message:'token is missing'})
    }
    else{
        jwt.verify(token,Token,(error,decode)=>{
            if(error){
                return res.status(501).send({message:'invalid token'})

            }
            req.user=decode
            next()


    })
    }


    
}

module.exports = verify