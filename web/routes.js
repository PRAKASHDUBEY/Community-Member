const router = require("express").Router();

const userHandler = require("../handlers/user");
const communityHandler = require("../handlers/community");
const roleHandler = require("../handlers/role");
const memberHandler = require("../handlers/member");

const auth = require('../middleware/jwt');


class Routes{
    
    constructor(app){
        this.app = app;
        this.user = new userHandler();
        this.community = new communityHandler();
        this.role = new roleHandler();
        this.member = new memberHandler();
    }

    async appRoutes(){

        this.app.use("/v1", await this.roleRoutes());

        this.app.use("/v1", await this.userRoutes());

        this.app.use("/v1", await this.communityRoutes());

        this.app.use("/v1", await this.memberRoutes());

    }

    async roleRoutes(){

        router.post("/role", this.role.create);

        router.get("/role", this.role.getAll);
        
        return router;
    }

    async userRoutes(){

        router.post("/auth/signup", this.user.signUp);

        router.post("/auth/signin", this.user.signIn);

        router.get("/auth/me", auth, this.user.getMe);
        
        return router;
    }

    async communityRoutes(){

        router.post("/community/", auth, this.community.create);

        router.get("/community/", this.community.getAll);
        
        router.get("/community/:id/members", this.community.getAllMembers);

        router.get("/community/me/owner", auth, this.community.getMyOwnedCommunity);

        router.get("/community/me/member", auth, this.community.getMyJoinedCommunity);
        
        return router;
    }
    
    async memberRoutes(){

        router.post("/member/", auth, this.member.addMember);

        router.delete("/member/:id", auth, this.member.removeMember)
        
        return router;
    }
    
    routesConfig(){

		this.appRoutes();
	}
   
}
module.exports = Routes;