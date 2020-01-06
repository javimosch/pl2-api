import md5 from 'md5'

export default {
    async create(req,res){
        res.json(await req.db.collection('user').create({
            ...req.body,
            password: md5(req.body.password)
        }))
    },
    async read(req,res){
        let json = await req.db.collection('user').read()
        res.json(json)
    }
}