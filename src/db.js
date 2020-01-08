import mongoose from 'mongoose'
import session from 'express-session'
import ConnectMongo from 'connect-mongo'
import sander from 'sander'
import path from 'path'

sander.readdir(path.join('src/schemas')).then(dirs=>{
    dirs.forEach(dir=>{
        //require(`./schemas/${dir}`)
        import(`./schemas/${dir}`)
    })
})

const MongoStore = ConnectMongo(session)
const mongoURI = process.env.MONGO_URI || 'mongodb://root:example@localhost:27017/pl2?authSource=admin';
mongoose.connect(mongoURI, { useNewUrlParser: true });

export default {
    
}

const singleton = {
    collection(name){
        return {
            model(){
                return mongoose.model(name)
            }
        }
    }
}

export function dbMiddleware(){
    return function(req,res,next){
        req.db = singleton
        req.model = name => mongoose.model(name)
        next();
    }
}

export function sessionMiddleware() {
    
    const mongoStoreOptions = {
        url: mongoURI,
        //mongoOptions: advancedOptions // See below for details
    }
    return session({
        saveUninitialized: false,
        resave: false, //don't save session if unmodified
        secret: 'secret',
        store: new MongoStore(mongoStoreOptions)
    });
}