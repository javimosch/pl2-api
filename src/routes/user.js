import md5 from 'md5'

export default {
    actions: {
        async enableUser(_id){
            return await this.req.model('user').update({
                _id
            },{
                $set:{
                    enabled:true
                }
            })
        },
        async registerAccount(data) {
            let result =  await this.req.model('user').findOneAndUpdate({
                email: data.email
            }, {
                $set: data
            }, {
                new:true,
                upsert: true,
               rawResult:true
            })
            
            if(result.ok && result.lastErrorObject && result.lastErrorObject.updatedExisting===false){
                await this.req.action('email.sendAccountRegisteredNotification')(result.value)
            }
            return result
        }
    },
    async collection_create(req, res) {
        res.json(await req.db.collection('user').model().create({
            ...req.body,
            password: md5(req.body.password)
        }))
    },
    async collection_read(req, res) {
        let filters = {}
        if (req.body.email) {
            filters.email = req.body.email
        }
        let json = await req.db.collection('user').model().find(filters)
        res.json(json)
    },
    async read(req, res) {
        return await req.db.collection('user').model().findOne({
            _id: req.params.id
        })
    },
    async update(req, res) {
        res.json({
            result: await req.db.collection('user').model().update({
                _id: req.params.id
            }, {
                $set: req.body
            })
        })
    },
    async delete(req, res) {
        res.json({
            result: await req.db.collection('user').model().remove({
                _id: req.params.id
            })
        })
    }
}