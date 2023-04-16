const Member = require('../models/member');
const Community = require('../models/community');
const Role = require('../models/role');
const User = require('../models/user');

class memberHandler {
    
    async addMember(req, res){
        try {
            const { community, user, role } = req.body;

            if (!community) {
                return res.status(403).json({
                    status: false,
                    msg: 'Community Id id required'
                });
            }
            if (!user) {
                return res.status(403).json({
                    status: false,
                    msg: 'User Id id required'
                });
            }
            if (!role) {
                return res.status(403).json({
                    status: false,
                    msg: 'Role Id id required'
                });
            }
            
            let community_check = await Community.findById(community);
            if(community_check.owner!=req.user.id){
                return res.status(405).json({
                    status: false,
                    msg: 'NOT_ALLOWED_ACCESS'
                });
            }
            let role_check = await Role.findById(role);
            if(role_check.name=="Community Admin"){
                return res.status(405).json({
                    status: false,
                    msg: 'NOT_ALLOWED_ACCESS'
                });
            }
            if(user==req.user.id){
                return res.status(405).json({
                    status: false,
                    msg: 'NOT_ALLOWED_ACCESS'
                });
            }

            let member = new Member();
            member.community = community;
            member.user = user;
            member.role = role;

            await member.save();

            res.status(200).json({
                status: true,
                content: {
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
    
    async removeMember(req, res){
        try {
            
            const id = req.params.id;
            let member = await Member.findById(id);

            let role = await Role.find({$or:[{name:'Community Admin'},{name:'Community Moderator'}]});
            
            let auth = await Member.findOne({community:member.community, user:req.user.id, $or:[{role:role[0]._id},{role:role[1]._id}]});
            
            if(!auth){
                return res.status(405).json({
                    status: false,
                    msg: 'NOT_ALLOWED_ACCESS'
                });
            }
            await Member.findByIdAndDelete(id);
            res.status(200).json({
                status: true
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                msg: `Server Error: ${err}`
            })
        }
    }
    
}

module.exports = memberHandler;