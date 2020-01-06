const secret = process.env.JWT_SECRET || 'secret'
const expiresIn = process.env.JWT_EXPIRES || '1m' //https://github.com/zeit/ms

import jwt from 'jsonwebtoken'

export default{
    sign
}

function sign(payload = {}){
    return new Promise((resolve,reject)=>{
        jwt.sign(payload, secret, { expiresIn: expiresIn },(err,token)=>{
            if(err) reject(err)
            resolve(token)
        });
    })
}