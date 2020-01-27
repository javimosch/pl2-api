const modelName = 'email'

const MAILJET_TEMPLATES = {
    ACCOUNT_REGISTERED: 1168281
}

/**
 * @module email
 */
export default {
    /**
     * @module email/actions
     */
    actions: {
        /**
         * @function create
         * @argument data {object}
         */
        async create(data) {
            return await this.req.db.collection(modelName).model().create({
                ...data
            })
        },
        /**
         * @function sendAccountRegisteredNotification
         * @argument user object
         */
        async sendAccountRegisteredNotification(user) {

            let email = await this.req.action('email.create')({
                type: "ACCOUNT_REGISTERED",
                owner: user._id
            })

            let MailJet = (await
                import ('node-mailjet')).default
            console.log('AUTH', process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY)
            var mailjet = MailJet.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY, {
                version: 'v3.1'
            });
            const mailjet_request = {
                Messages: [{
                    From: {
                        Email: process.env.APP_WEBMASTER || "webmaster@misitioba.com",
                        Name: process.env.APP_NAME || "MisitioBA"
                    },
                    To: [{
                        Email: user.email,
                        Name: user.name
                    }],
                    TemplateID: MAILJET_TEMPLATES.ACCOUNT_REGISTERED,
                    TemplateLanguage: true,
                    Variables: user,
                }]
            }
            let mailjet_response = {
                response: {
                    text: {
                        test: true
                    }
                }
            }
            if (process.env.NODE_ENV === 'production') {
                mailjet_response = await mailjet
                    .post("send")
                    .request(mailjet_request)
            }



            email.events.addToSet({
                type: "MAILJET_RESPONSE",
                metadata: {
                    request: JSON.stringify(mailjet_request),
                    response: mailjet_response.response.text
                }
            })
            email.markModified('events');
            return await email.save()

        }
    },
    /**
     * 
     */
    async collection_create(req, res) {
        res.json(await req.db.collection(modelName).model().create({
            ...req.body
        }))
    },
    /**
     * 
     */
    async collection_read(req, res) {
        let filters = {}
        if (req.body.email) {
            filters.email = req.body.email
        }
        let json = await req.db.collection(modelName).model().find(filters).populate('owner', 'email').exec()
        res.json(json)
    },
    /**
     * 
     */
    async read(req, res) {
        return await req.db.collection(modelName).model().findOne({
            _id: req.params.id
        })
    },
    /**
     * 
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
     * 
     */
    async delete(req, res) {
        res.json({
            result: await req.db.collection(modelName).model().remove({
                _id: req.params.id
            })
        })
    }
}