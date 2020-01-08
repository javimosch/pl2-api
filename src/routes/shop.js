
const modelName = 'shop'
export default {
    async collection_create(req,res){
        res.json(await req.db.collection(modelName).model().create({
            ...req.body
        }))
    },
    async collection_read(req,res){
        let filters = {}
        if(req.body.email){
            filters.email = req.body.email
        }
        let json = await req.db.collection(modelName).model().find(filters)
        res.json(json)
    },
    async read(req,res){
        res.json(await req.db.collection(modelName).model().findOne({
            _id:req.params.id
        }))
    },
    async update(req,res){
        res.json({
            result: await req.db.collection(modelName).model().update({
                _id:req.params.id
            },{
                $set: req.body
            })
        })
    },
    async delete(req,res){
        res.json({
            result: await req.db.collection(modelName).model().remove({
                _id:req.params.id
            })
        })
    }
}