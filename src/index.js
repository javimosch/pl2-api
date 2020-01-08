import dotenv from 'dotenv'
dotenv.config({silent:true})
import express from 'express'
import {default as db, sessionMiddleware, dbMiddleware} from './db.js'
import jwt  from './jwt.js';
import { createRequire } from 'module';


const app = express()
const port = 3000

app.use(express.json({
    limit:"100mb"
}))

app.use(dbMiddleware())
app.use(sessionMiddleware())

import('./crud.js').then(module=>module.default(app))
import('./funql.js').then(module=>module.default(app))


/*
app.get('/', async (req, res) => {
    
    req.session.jwt_token = await jwt.sign({
        name: req.query.name
    })
    res.send('Hello World!')
})

app.use('/users', (()=>{
    
    let users = express.Router()
    users.post('/', usersApi.create)
    users.get('/', usersApi.read)
    return users;

})())

app.get('/jwt/token', async (req, res) => {
    res.json(req.session.jwt_token)
})

app.post('/post', async (req, res) => {
    console.log(req.body)
    res.send('Hello World! '+JSON.stringify(req.body))
})*/

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
