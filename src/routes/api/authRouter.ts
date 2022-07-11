import { Router } from 'express';
import { login, register, getUserData, deleteUser, logout } from '../../controllers/authController';
import { body, check } from 'express-validator';

import User from '../../models/userSchema';
import checkTokens from '../../utilities/checkTokens';

const auth: Router = Router()

auth.route('')
    .get(checkTokens, checkID(), getUserData)
    .delete(checkTokens, checkID(), deleteUser)

auth.post('/login', checkEmail(), login);
auth.post('/register', checkUserData(), register);
auth.post('/logout', checkTokens, checkID(), logout);

// #=======================================================================================#
// #			                         check function                                    #
// #=======================================================================================#

function checkID() {
    return [
        body("_id").isInt().withMessage('invalid Comment ID')
    ]
}

function checkEmail() {
    return [
        body('email').isEmail().withMessage('invalid email')
    ]
}

function checkUserData() {
    return [
        body('name').isString().withMessage('invalid name'),
        check('email')
            .isEmail().withMessage('invalid email')
            .custom((userEmail: String) => {
                return User.findOne({ email: userEmail })
                    .then((data) => {
                        if (data && data.email != userEmail)
                            return Promise.reject('Email already exit')
                    })
            }),
        body('password').isStrongPassword().withMessage('Password Must contain at least 1 characters(upper and lower),numbers,special characters'),
    ]
}

export default auth;