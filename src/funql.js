import funql from "funql-api";
import sander from "sander";
import path from "path";

export default async function(app) {
    app.use((req, res, next) => {
        req.action = (path = "") => {
            if (!path) {
                throw new Error("path required");
            } else {
                let root = app.api;
                path.split(".").forEach(k => {
                    if (!!root[k]) root = root[k];
                    else return false;
                });
                if (typeof root === "function") {
                    return function() {
                        return root.apply({
                                req
                            },
                            arguments
                        );
                    };
                } else {
                    throw new Error("ACTION_NOT_FOUND=" + path);
                }
            }
        };
        next();
    });

    //Normal usage: call the middleware
    funql.middleware(app, {
        /*defaults*/
        getMiddlewares: [],
        postMiddlewares: [],
        allowGet: true,
        allowOverwrite: true,
        attachToExpress: true,
        allowCORS: true,
        bodyParser: true, //required for http post
        api: {
            //default actions
        }
    });

    sander.readdir(path.join("src/routes")).then(dirs => {
        dirs.forEach(async dir => {
            let module = await
            import (`./routes/${dir}`);
            let singularName = dir.split(".")[0];
            module = module.default;
            if (module.actions) {
                Object.keys(module.actions).forEach(key => {
                    app.api[singularName] = app.api[singularName] || {};
                    app.api[singularName][key] = module.actions[key];
                });
            }
        });
    });

    /*
    await funql.loadFunctionsFromFolder({
        path: (await
            import ('path')).join(process.cwd(), 'src/helpers')
    })*/

    sander.readdir(path.join('src/routes')).then(dirs => {
        dirs.forEach(async dir => {
            let module = await
            import (`./routes/${dir}`)
            let singularName = dir.split('.')[0]
            module = module.default
            if (module.actions) {
                Object.keys(module.actions).forEach(key => {
                    app.api[singularName] = app.api[singularName] || {}
                    app.api[singularName][key] = module.actions[key]
                })
            }
        })
    })

}