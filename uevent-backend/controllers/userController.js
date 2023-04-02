const   USERS_TABLE = 'users',
        bcrypt = require('bcryptjs'),
        jwt = require('jsonwebtoken'),
        {secret_mails} = require('../config'),
        { v4: uuidv4 } = require('uuid'),
        Fs = require('fs'),
        User = require('../models/user'),
        Mailer = require('../middleware/mailer'),
        {CustomError, errorReplier} = require('../models/error');
//
const mailer = new Mailer();

class userController{
    async get(req,res){
        try{
            const user = new User(USERS_TABLE);
            const pawns = await user.getAll();
            res.json(pawns)
        } catch(e){
            e.addMessage = 'Get users';
            errorReplier(e, res);
        }
    }

    async getById(req,res){
        try{
            const user = new User(USERS_TABLE);
            const pawn = await user.getById(req.params.id);
            res.json(pawn)
        } catch(e){
            e.addMessage = 'Get user by id';
            errorReplier(e, res);
        }

    }

    async getAvatar(req, res) {
        try {
            if (!req.params || !req.params.avatarName)
                return res.status(400).json({message: `Crappy params`});
            const buffer = Fs.readFileSync('./public/profile_pics/' + req.params.avatarName)
            res.status(200).send(buffer);
        } catch (e) {
            e.addMessage = 'Get avatar';
            errorReplier(e, res);
        }
    }

    async edit(req, res) {
        try{
            if (!req.user) {
                return res.status(401).json({message: `User needs to login first`})
            }

            // should I destructure params to filter the unwanted data? theoretically useless
            const {login, password, email} = req.body;

            const user = new User(USERS_TABLE);

            const old_pawn = await user.getById(req.user.id);
            if (!old_pawn) return res.status(401).json({message: `User does not exists`})
            else if (old_pawn.login === login) return res.status(400).json({message: `User needs to chose a different login`})
            else if (old_pawn.email === email) return res.status(400).json({message: `User needs to chose a different email`})
            const pawn_by_new_data = await user.get(login, email);
            if(pawn_by_new_data){
                if(pawn_by_new_data.login === login)
                    throw new CustomError(1004);
                throw new CustomError(1005);
            }

            let hashedPassword;
            if (password) hashedPassword = bcrypt.hashSync(password,8)

            const new_pawn = await user.set({
                id: req.user.id, 
                login, 
                email: 'unconfirmed@@' + email, 
                password: hashedPassword
            })

            if (email) {
                mailer.sendConfirmEmail(email, jwt.sign({
                    email: email,
                    login: login,
                    id: new_pawn.id
                }, secret_mails, {expiresIn: '1h'}))
            }

            // Regenerate tokens or logout?
            res.status(200).clearCookie('refreshToken', {path: '/'}).json({message: "Success, log in again please"});
        } catch(e){
            e.addMessage = 'Edit user';
            errorReplier(e, res);
        }
    }

    async editAvatar(req, res) {
        try {
            if (!req.user){
                return res.status(401).json({message: `User needs to login first`});
            }
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({message: 'No files were uploaded.'});
            }
            
            const avatar_name = req.user.login + '_' + uuidv4() + '.png';
            const avatar_path = './public/profile_pics/';

            

            const user = new User(USERS_TABLE);
            const pawn = await user.getById(req.user.id);
            
            // input name on front should be like this VVV (avatar)
            const avatar = req.files.avatar;
            avatar.mv(avatar_path + avatar_name, function(err) {
                if (err) return res.status(500).send(err);
            });
            await user.set({id: pawn.id, profile_pic: avatar_name});

            if(pawn.profile_pic !== 'none.png') {
                Fs.unlinkSync(avatar_path + pawn.profile_pic)
            }
            
            res.send('Success File uploaded!');
        } catch (e) {
            e.addMessage = 'edit avatar';
            errorReplier(e, res);
        }
    }

    async delete(req,res){
        try{
            if (!req.user) {
                return res.status(401).json({message: `User needs to login first`})
            }
            const user = new User(USERS_TABLE);
            const pawn = await user.del({id: req.user.id});
            res.json(pawn)
        } catch(e){
            e.addMessage = 'Delete user by id';
            errorReplier(e, res);
        }
    }

}
module.exports = new userController()