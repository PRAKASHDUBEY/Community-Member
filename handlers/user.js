const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");

class userHandler {

    async signUp(req, res) {
        try {

            const { name, email, password } = req.body;

            if (name.length < 2) {
                return res.status(403).json({
                    status: false,
                    msg: 'Name should be of more than one character'
                });
            }
            if (!email) {
                return res.status(403).json({
                    status: false,
                    msg: 'Email required for signup'
                });
            }
            if (password.length < 6) {
                return res.status(403).json({
                    status: false,
                    msg: 'Password should be of more than five character'
                });
            }
            let email_exist = await User.findOne({ email: email });
            if (email_exist) {
                return res.status(409).json({
                    status: false,
                    msg: 'Account already exits with this email'
                });
            }
            let user = new User();

            user.name = name;
            user.email = email;

            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(password, salt);

            await user.save();

            let userData = await User.findOne({ email: email }).select('-password');

            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, process.env.jwtUserSecret, {
                expiresIn: 30000
            }, (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    status: true,
                    content: {
                        data: userData,
                        meta: {
                            access_token: token
                        }
                    }
                });
            })
        } catch (err) {
            res.status(500).json({
                status: false,
                msg: `Server Error: ${err}`
            })
        }
    }

    async signIn(req, res) {
        try {
            const { email, password } = req.body;
            let user = await User.findOne({ email: email })

            if (!user) {
                res.status(404).json({
                    status: false,
                    msg: 'User does not exist, Signup to continue!'
                });
            }
            const isMatch = await bcryptjs.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    status: false,
                    msg: 'Inavalid Credentials'
                })
            }
            let userData = await User.findOne({ email: email }).select('-password');
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, process.env.jwtUserSecret, {
                expiresIn: 300000
            }, (err, token) => {
                if (err) throw err;

                res.status(200).json({
                    status: true,
                    content: {
                        data: userData,
                        meta: {
                            access_token: token
                        }
                    }
                });
            })

        } catch (err) {
            res.status(500).json({
                status: false,
                msg: `Server Error: ${err}`
            })
        }
    }

    async getMe(req, res) {
        try {
            let user = await User.findById(req.user.id).select("-password")
            res.status(200).json({
                status: true,
                content: {
                    data: user
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

module.exports = userHandler;