const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth')

const User = require('../models/user');

function generateToken (params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

const router = express.Router();

/* Register the user with this route, to get access you must register the email an password.
A JSON object containing name, email, password and sector, must be send for this route. */
router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: 'User already exists' })
        }           

        const user = await User.create(req.body);

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                emailConfirmToken: token,
                emailConfirmExpires: now,
                accessCredential: 'basic',
                statusEmail: 'unconfirmed',
            }
        });

        user.password = undefined;

        mailer.sendMail({
            to: email,
            from: 'samuelmultiplay@gmail.com',
            template: 'auth/confirm_email',
            context: { token }
        }, (err) => {
            if(err) {
                return res.status(400).send({ error: 'Cannot send confirm email'});
            }
                
            return res.send({ ok: true });
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed' });
    }
})

/* Authenticate a user with this route, to get access you must have registered the email and password.
A JSON object containing email and password must be send for this route. */
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password statusEmail');

    if (!user) {
        return res.status(400).send({ error: 'User not found' })
    }

    if (!await bcrypt.compare(password, user.password)){
        return res.status(400).send({ error: 'Invalid password' })
    }

    if (user.statusEmail == 'unconfirmed') {
        return res.status(400).send({ error: 'User not confirm Email' })
    }

    user.password = undefined;    

    res.send({
        user, 
        token: generateToken({ id: user.id }),
    })
})

/* When a user is register, a email to confirm this account is sent, to confirm this user, use this route.
A JSON object containing email and token of email confirm of the user must be send for this route. */
router.post('/email_confirm', async (req, res) => {
    const { email, token } = req.body;

    try {
        const user = await User.findOne({ email })
         .select('+emailConfirmToken emailConfirmExpires');

        if(!user)
           return res.status(400).send({error: 'User not Found'}); 

        if (token !== user.emailConfirmToken)
            return res.status(400).send({ error: 'Token invalid' })
        
        const now = new Date()
        
        if (now > user.emailConfirmExpires){
            res.status(400).send({ error: 'Token expired, generate a new'});
        }
        
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                statusEmail: 'confirmed',
            }
        });

        res.send({
            user
        })
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Cannot confirm email, try again' })
    }
})

/* When a user is forgot your password, a email to reset your secret is sent, to send this email, use this route.
A JSON object containing email of the user must be send for this route. */
router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user)
            return res.status(400).send({error: 'User not Found'});
        
        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: email,
            from: 'samuelmultiplay@gmail.com',
            template: 'auth/forgot_password',
            context: { token }
        }, (err) => {
            if(err) {
                return res.status(400).send({ error: 'Cannot send forgot password email'});
            }                
            
            return res.send({ ok: true });
        })
    } catch (err) {
        console.log(err)
        res.status(400).send({ error: "Error on forgot password, try again"})
    }
})

/* When a user want reset your pass, a new token is generated, to confirm this token use this route.
A JSON object containing email, token of password confirm and new pass must be send for this route. */
router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email })
         .select('+passwordResetToken passwordResetExpires');

        if(!user)
           return res.status(400).send({error: 'User not Found'}); 

        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Token invalid' })
        
        const now = new Date()
        
        if (now > user.passwordResetExpires){
            res.status(400).send({ error: 'Token expired, generate a new'});
        }            
        
       user.password = password;

        await user.save();

        res.send();
    } catch (err) {
        return res.status(400).send({ error: 'Cannot reset password, try again' })
    }
})

module.exports = app => app.use('/auth', router);