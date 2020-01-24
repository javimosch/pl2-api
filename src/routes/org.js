const modelName = 'org'

/**
 * Organization
 * @module org
 */
export default {
    /**
     * @module org/actions
     */
    actions: {},
    /**
     * ASD
     * @param req {object}
     * @param res {object}
     */
    async sub_create_users(req, res) {
        req.body.item.users.addToSet({
            ...req.body.data,
            org: req.body.item._id
        })
        req.body.item.markModified('users');
        res.json(await req.body.item.save())
    },
    /**
     */
    async collection_create(req, res) {
        res.json(await req.db.collection(modelName).model().create({
            ...req.body
        }))
    },
    /**
     */
    async collection_read(req, res) {
        let filters = {}
        if (req.body.email) {
            filters.email = req.body.email
        }
        let json = await req.db.collection(modelName).model().find(filters).populate("users.user")
        res.json(json)
    },
    /**
     */
    async read(req, res) {
        return await req.db.collection(modelName).model().findOne({
            _id: req.params.id
        })
    },
    /**
     */
    async update(req, res) {
        res.json({
            result: await req.db.collection(modelName).model().update({
                _id: req.params.id
            }, {
                $set: req.body
            })
        })
    },
    /**
     */
    async delete(req, res) {
        res.json({
            result: await req.db.collection(modelName).model().remove({
                _id: req.params.id
            })
        })
    }
}