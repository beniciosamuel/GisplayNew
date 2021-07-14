const express = require('express');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const authMiddleware = require('../middlewares/auth');

const User = require('../models/user');

const router = express.Router();

router.use(authMiddleware);

router.get('/maps', function(req, res){
    res.sendFile(process.cwd() + '/src/pages/maps.html');
});

/* Use this route to upgrade level of the your user.
A JSON object containing email of the admin and of the employee must be send for this route. */
router.put('/upgrade/', async (req, res) => {
    const { email, userUpdate } = req.body;

    try {
        const admin = await User.findOne({ email });
        const slayer = await User.findOne({ "email": userUpdate });

        if (!admin) {
            return res.status(400).send({ error: 'Admin not found' });
        }

        if (admin.sector != "projetos") {
            return res.status(401).send({ error: 'The sector dont have permission to upgrade a User for this level' });
        }

        if (!slayer) {
            return res.status(400).send({ error: 'User to upgrade not found' });
        }

        await User.findByIdAndUpdate(slayer.id, {
            '$set': {
                accessCredential: "premium",
            }
        });

        return res.send({ ok: true })
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Cannot upgrade the user, an error has occurred" })
    }
});

/* Admins can send a email to reset a password for the your employee, use this route for this.
A JSON object containing email of the admin and of the employee must be send for this route. */
router.post('/forgot_password', async (req, res) => {
    const { email, userResetPass } = req.body;

    try {
        const admin = await User.findOne({ "email": email });
        const slayer = await User.findOne({ "email": userResetPass });

        if (!admin) {
            return res.status(403).send({ error: 'Admin not found' });
        }
        
        if (admin.accessCredential != "premium") {
            return res.status(403).send({ error: 'User is not admin' });
        }

        if (!slayer) {
            return res.status(404).send({ error: 'User to reset pass not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(slayer.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: userResetPass,
            from: 'samuelmultiplay@gmail.com',
            template: 'auth/forgot_password',
            context: { token }
        }, (err) => {
            if(err) {
                return res.status(400).send({ error: 'Cannot send forgot password email'});
            }                
            
            return res.send();
        })
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Cannot send email for reset password" })
    }
})

/* Use this route to resend email to confirm account of the your user.
A JSON object containing email of the admin and of the employee must be send for this route. */
router.post('/reset_confirm', async (req, res) => {
    const { email, userToConfirm } = req.body;

    try {
        const admin = await User.findOne({ "email": email });
        const slayer = await User.findOne({ "email": userToConfirm });

        if (!admin) {
            return res.status(403).send({ error: 'Admin not found' });
        }
        
        if (admin.accessCredential != "premium") {
            return res.status(403).send({ error: 'User is not admin' });
        }

        if (!slayer) {
            return res.status(404).send({ error: 'User to confirm email not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(slayer.id, {
            '$set': {
                emailConfirmToken: token,
                emailConfirmExpires: now
            }
        });

        mailer.sendMail({
            to: userToConfirm,
            from: 'samuelmultiplay@gmail.com',
            template: 'auth/confirm_email',
            context: { token }
        }, (err) => {
            if(err) {
                return res.status(400).send({ error: 'Cannot send confirm email'});
            }
                
            return res.send();
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Cannot send confirm email to the user" })
    }
})

/* Project sector admins can manage all users and make anyone an administrator.
A JSON object containing email of the admin and of the employee must be send for this route. */
router.put('/', async (req, res) => {
    const { email, userUpdate } = req.body;

    try {
        const admin = await User.findOne({ email });
        const slayer = await User.findOne({ "email": userUpdate });

        if (!admin) {
            return res.status(404).send({ error: 'Admin not found' });
        }

        if (!slayer) {
            return res.status(404).send({ error: 'User to upgrade not found' });
        }

        await User.findByIdAndUpdate(slayer.id, {
            '$set': {
                access: true,
            }
        });

        return res.send({ ok: true })
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Cannot upgrade the user, an error has occurred" })
    }
});

/* Admins can exclude anyone from their sector, be careful when managing.
A JSON object containing email of the admin and of the employee must be send for this route. */
router.delete('/', async (req, res) => {
    const { email, userRemove } = req.body;

    try {
        const userUp = await User.findOne({ email });
        const userDel = await User.findOne({ "email": userRemove });

        if (!userUp) {
            return res.status(404).send({ error: 'User not found' })
        }

        if (!userDel) {
            return res.status(404).send({ error: 'User for removal not found' })
        }

        if (userUp.accessCredential != 'premium') {
            console.log(userUp.accessCredential);
            return res.status(403).send({ error: 'User dont have permission for this request' });
        }

        userDel.remove(() => {
            res.send();
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: 'Cannot remove the User'});
    };
});

module.exports = app => app.use('/projects', router);