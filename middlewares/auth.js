const jwt = require ('jsonwebtoken');
require('dotenv').config(); //mengkoneksikan 

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET belum di set di .env');

module.exports = function auth(req,res, next){
    try {
        // Ambil header Autorization: Bearer <token>
        const authHeader = req.headers['authorization'];
        if(!authHeader) return res.status(401).json({message: 'No token provided'});

        const parts = authHeader.split(' ');
        if(parts.length !== 2 || parts[0] !== 'Bearer'){
            return res.status(401).json({message: 'Invalid Authorization header format'})
        }
        const token = parts[1];

        // Verifikasi token
        jwt.verify(token,jwtSecret, (err, decode)=>{
            if(err) return res.status(401).json({message: 'Invalid Token'});

            //els kalau valid
            //Simpan payload user pada req,user untuk controller
            req.user = {id:decode.id, email:decode.email};
            next();
        })
    } catch (err) {
        next(err) 
    }
}