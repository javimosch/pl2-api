import md5 from 'md5'

/**
 * @module user
 */
export default {
    /**
     * @module user/actions
     */
    actions: {
        /**
         * @function enableUser
         */
        async enableUser(_id) {
            return await this.req.model('user').update({
                _id
            }, {
                $set: {
                    enabled: true
                }
            })
        },
        /**
         * 
         */
        async registerAccount(data) {
            console.log(data)
            let result = await this.req.model('user').findOneAndUpdate({
                email: data.email
            }, {
                $set: {
                    email: data.email
                }
            }, {
                new: true,
                upsert: true,
                rawResult: true
            })

            if (result.ok && result.lastErrorObject && result.lastErrorObject.updatedExisting === false) {
                await this.req.action('email.sendAccountRegisteredNotification')(result.value)
            }
            return result
        },
        async createUser(data) {
            const model = (this.db || this.req.db).collection('user').model();

            await model.updateOne({
                email: data.email
            }, {
                $set: {
                    ... { email: data.email },
                    password: md5(data.password)
                }
            }, {
                upsert: true,
                setDefaultsOnInsert: true
            })
            let user = await model.findOne({
                email: data.email
            }).select("_id email")
            return user
        }
    },
    /**
     * 
     */
    async collection_create(req, res) {
        return res.json(await req.action('user.createUser')(req.body))
    },
    /**
     * 
     */
    async collection_read(req, res) {
        let filters = {}
        if (req.body.email) {
            filters.email = req.body.email
        }
        let json = await req.db.collection('user').model().find(filters)
        res.json(json)
    },
    /**
     * 
     */
    async read(req, res) {
        return await req.db.collection('user').model().findOne({
            _id: req.params.id
        })
    },
    /**
     * 
     */
    async update(req, res) {
        res.json({
            result: await req.db.collection('user').model().update({
                _id: req.params.id
            }, {
                $set: req.body
            })
        })
    },
    /**
     * 
     */
    async delete(req, res) {
        res.json({
            result: await req.db.collection('user').model().remove({
                _id: req.params.id
            })
        })
    }
}