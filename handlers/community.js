const Community = require('../models/community');
const Member = require('../models/member');
const Role = require('../models/role');
const slug = require('../utils/slug');


class communityHandler {

    async create(req, res) {
        try {
            const { name } = req.body;

            if (name.length < 2) {
                return res.status(403).json({
                    status: false,
                    msg: 'Name should be of more than one character'
                });
            }

            let community = new Community();
            community.name = name;
            community.slug = slug(name, community.id);
            community.owner = req.user.id;

            await community.save();

            let role = await Role.findOne({ name: 'Community Admin' })
            let member = new Member();
            member.community = community.id;
            member.user = req.user.id;
            member.role = role.id;

            await member.save();
            res.status(200).json({
                status: true,
                content: {
                    data: community
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
            let page = req.query.page ? req.query.page : 1;
            let perPage = req.query.perPage ? req.query.perPage : 10;
            let offset = page > 1 ? ((page - 1) * perPage) : 0

            let total = await Community.find().count();
            let pages = 1 + Math.floor(total / perPage);

            let community = await Community.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, name: 1 } }],
                        as: "owner"
                    }
                },
                {
                    $set: {
                        owner: { $first: "$owner" }

                    }
                }
            ]).skip(offset).limit(perPage);

            res.status(200).json({
                status: true,
                content: {
                    meta: {
                        total: total,
                        pages: pages,
                        page: Number(page)
                    },
                    data: community
                }
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                msg: `Server Error: ${err}`
            })
        }
    }

    async getAllMembers(req, res) {
        try {
            let page = req.query.page ? req.query.page : 1;
            let perPage = req.query.perPage ? req.query.perPage : 10;
            let offset = page > 1 ? ((page - 1) * perPage) : 0

            let total = await Member.find().count();

            let pages = 1 + Math.floor(total / perPage);

            let member = await Member.aggregate([
                {
                    $lookup: {
                        from: "roles",
                        localField: "role",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, name: 1 } }],
                        as: "role"
                    }

                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, name: 1 } }],
                        as: "user"
                    }
                },
                {
                    $set: {
                        role: { $first: "$role" },
                        user: { $first: "$user" }

                    }
                }
            ]).skip(offset).limit(perPage);

            res.status(200).json({
                status: true,
                content: {
                    meta: {
                        total: total,
                        pages: pages,
                        page: Number(page)
                    },
                    data: member
                }
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                msg: `Server Error: ${err}`
            })
        }
    }

    async getMyOwnedCommunity(req, res) {
        try {
            let page = req.query.page ? req.query.page : 1;
            let perPage = req.query.perPage ? req.query.perPage : 10;
            let offset = page > 1 ? ((page - 1) * perPage) : 0

            let total = await Community.find().count();
            let pages = 1 + Math.floor(total / perPage);

            let community = await Community.find({ owner: req.user.id }).skip(offset).limit(perPage);
            res.status(200).json({
                status: true,
                content: {
                    meta: {
                        total: total,
                        pages: pages,
                        page: Number(page)
                    },
                    data: community
                }
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                msg: `Server Error: ${err}`
            })
        }
    }

    async getMyJoinedCommunity(req, res) {
        try {
            
            let member = await Member.find({user: req.user.id}).select({'_id':0,'community':1}).forEach(function(document) {output.push(document.community) })
            console.log(member);
            let community = await Community.aggregate([
                {
                    $match:{_id:member}
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        pipeline:[{$project:{_id:1,name:1 }}],
                        as: "owner"
                    }
                },
                {
                    $set: {
                        owner: { $first: "$owner" }

                    }
                }
            ])

            res.status(200).json({
                status: true,
                content: {
                    data: community
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

module.exports = communityHandler;