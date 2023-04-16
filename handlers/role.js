const Role = require('../models/role');

class roleHandler {

    async create(req, res) {
        try {

            if (req.body.name.length < 2) {
                return res.status(403).json({
                    status: false,
                    msg: 'Name should be of more than one character'
                });
            }

            let role_exist = await Role.findOne(req.body);
            if (role_exist) {
                return res.status(409).json({
                    status: false,
                    msg: 'This role is already exiting'
                });
            }

            let role = new Role();
            role.name = req.body.name;
            await role.save();

            res.status(200).json({
                status: true,
                content: {
                    data: role
                }
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                msg: `Server Error: ${err}`
            })
        }
    }

    async getAll(req, res) {
        try {
            
            let page = req.query.page ? req.query.page : 1 ;
            let perPage = req.query.perPage ? req.query.perPage : 10 ;
            let offset = page > 1 ? ( ( page - 1 ) * perPage ) : 0
            
            let total = await Role.find().count();
            
            let pages = 1 + Math.floor(total/perPage);

            let role = await Role.find().skip( offset ).limit( perPage );

            res.status(200).json({
                status: true,
                content: {
                    meta: {
                        total: total,
                        pages: pages,
                        page: Number(page)
                    },
                    data: role
                }
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                msg: `Server Error: ${err}`
            })
        }
    }

}

module.exports = roleHandler;