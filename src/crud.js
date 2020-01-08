import express from 'express'
import sander from 'sander'
import path from 'path'
import usersApi from './routes/user.js';
import pluralize from 'pluralize'

export default function (app) {
    const defaultFormat = 'json'
    sander.readdir(path.join('src/routes')).then(dirs => {
        dirs.forEach(async dir => {
            let singularName = dir.split('.')[0]
            let pluralName = pluralize(singularName)

            console.log('Resource', `/${pluralName}`, 'loaded')


            let router = express.Router()

            let module = await import(`./routes/${dir}`)

            //[POST or Create](To the *collection*)
            router.post('/', async (req, res) => {
                try {
                    await module.default.collection_create(req, res)
                } catch (err) {
                    console.error(err.stack)
                    res.status(500).json()
                }
            })

            //[POST or Create](To the *collection*)
            router.post('/:id/:field_name', async (req, res) => {
                try {
                    let data = req.body
                    req.body = {
                        item: await module.default.read(req, res),
                        data
                    }
                    let methodName = `sub_create_${req.params.field_name}`
                    await module.default[methodName](req, res)
                } catch (err) {
                    console.error(err.stack)
                    res.status(500).json()
                }
            })

            //[GET or Read](of *one* thing)
            router.get('/:id', (req, res, next) => {
                if (req.params.id.indexOf('.') !== -1) {
                    let format = req.params.id.split('.')[1]
                    req.params.id = req.params.id.split('.')[0]
                    req.body = {
                        ...req.query || {},
                        ...req.params || {}
                    };
                    res.json(module.default.read(req, res))
                } else {
                    next(); //skip
                }
            })

            //[PUT or Update](of *one* thing)
            router.put('/:id', module.default.update)
            router.post('/:id/update', module.default.update)

            //[DELETE](of *one* thing)
            router.delete('/:id', module.default.delete)
            router.post('/:id/delete', module.default.delete)

            //[GET or Search](of a *collection*, FRIENDLY URL)
            //[GET or Search](of a *collection*, Normal URL)
            router.get('/*', (req, res, next) => {
                let data = req.query;
                let format = data._format || defaultFormat;
                data = Object.keys(data).filter(k => k.charAt(0) !== '_').reduce((a, k) => {
                    a[k] = data[k]
                    return a;
                }, {})
                let split = req.url.split('/').filter(w => !!w)
                for (var index = 0; index < split.length; index = index + 2) {
                    let word = split[index]
                    if (split.length > index + 1) {
                        data[word] = split[index + 1].split('?')[0]
                    }
                }
                req.body = data
                module.default.collection_read(req, res)
            })

            app.use(`/${pluralName}`, router)
            app.use(`/${pluralName}.:format`, (req, res) => {
                let q = Object.keys(req.query).map(k => `${k}=${req.query[k]}`).join('&')
                res.redirect(`/${pluralName}?_format=${req.params.format}&${q}`)
            })

        })
    })
}