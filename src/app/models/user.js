const mongoose = require('../../database');
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    sector: {
        type: String,
        lowercase: true,
        required: true
    },
    accessCredential: {
        type: String,
        default: 'basic',
        lowercase: true,
        required: true,
    },
    access: {
        type: Boolean,
        default: false
    },
    statusEmail: {
        type: String,
        select: false,
        default: 'unconfirmed',
    },
    emailConfirmToken: {
        type: String,
        select: false,
        unique: true,
    },
    emailConfirmExpires: {
        type: Date,
        default: Date.now,
        select: false,
        unique: true,
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

    next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;