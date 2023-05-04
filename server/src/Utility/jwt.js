import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// JWT class
class JWT{
    // constructor
    constructor(){
        this.jwt = jwt;
    }
    // methods
    createToken(email,handle,type){
        return this.jwt.sign({email,handle,type},process.env.SECRET_KEY, { expiresIn: '1d' });
    }
    // verify token method
    verifyToken(token){
        
        return this.jwt.verify(token, process.env.SECRET_KEY);
    }
    // decode token method
    decodeToken(token){
        return this.jwt.decode(token);
    }
}

export default JWT;