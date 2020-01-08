import mongoose from 'mongoose'

//EMAIL
var emailSchema = new mongoose.Schema({
    type: String,
    sended: {
        type:Boolean,
        default:false
    },
    events:[new mongoose.Schema({
        type:String,
        metadata: Object
    })],
    sended_date: Date,
    metadata: Object,
    owner: { type: 'ObjectId', ref: 'user', required:false },
    org: { type: 'ObjectId', ref: 'org', required:false },
},{
    timestamps:true
});
var EmailModel = mongoose.model('email', emailSchema);

//USER ROLES
var userRoleSchema = new mongoose.Schema({
    code:{
        type:String,
        unique:true,
        required:true
    },
    description: String,
    org: { type: 'ObjectId', ref: 'org', required:true },
},{
    timestamps:false
});
var UserRoleModel = mongoose.model('user_role', userRoleSchema);

//USER
var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    bornDate: Date,
    password: String,
    enabled:{
        type: Boolean,
        default:false
    }
},{
    timestamps:true
});
var UserModel = mongoose.model('user', userSchema);

//SHOP
var shopSchema = new mongoose.Schema({
    name: String
},{
    timestamps:true
});
var shopModel = mongoose.model('shop', shopSchema);

//ORGANIZATION USER
var orgUserSchema = new mongoose.Schema({
    user: { type: 'ObjectId', ref: 'user', required:true },
    role: { type: 'ObjectId', ref: 'user_role', required:true}
});
var OrgUserModel = mongoose.model('org_user', orgUserSchema);

//ORGANIZATION
var orgSchema = new mongoose.Schema({
    name: String,
    users: [orgUserSchema],
    child_orgs: [{ type: 'ObjectId', ref: 'organization' }],
    federated_by: { type: 'ObjectId', ref: 'federation' }
},{
    timestamps:true
});
var OrgModel = mongoose.model('org', orgSchema);

