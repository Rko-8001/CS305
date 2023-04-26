import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
class JWT{
    constructor(){
        this.jwt = jwt;
    }

    createToken(email,handle,type){
        return this.jwt.sign({email,handle,type},process.env.SECRET_KEY, { expiresIn: '1h' });
    }

    verifyToken(token){
        
        return this.jwt.verify(token, process.env.SECRET_KEY);
    }
    
    decodeToken(token){
        return this.jwt.decode(token);
    }
}

export default JWT;