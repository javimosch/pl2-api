import mongoose from 'mongoose'
import session from 'express-session'
import ConnectMongo from 'connect-mongo'

const MongoStore = ConnectMongo(session)

const mongoURI = process.env.MONGO_URI || 'mongodb://root:example@localhost:27017/pl2?authSource=admin';
mongoose.connect(mongoURI, { useNewUrlParser: true });

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
var User = mongoose.model('user', userSchema);

var kittySchema = new mongoose.Schema({
    name: String
});
var Kitten = mongoose.model('Kitten', kittySchema);

export default {
    
}

const singleton = {
    collection(name){
        return {
            async create(payload){
                return await mongoose.model(name).create(payload)
            },
            async read(){
                return await mongoose.model(name).find({}).lean(true)
            }
        }
    }
}

export function dbMiddleware(){
    return function(req,res,next){
        req.db = singleton
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