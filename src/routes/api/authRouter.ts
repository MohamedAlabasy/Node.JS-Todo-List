import { Router } from 'express';
import { login, register, getUserData, deleteUser, logout, activateUserEmail } from '../../controllers/authController';
import { body, check } from 'express-validator';

import User from '../../models/userSchema';
import Email from '../../models/emailVerificationSchema';
import checkTokens from '../../utilities/checkTokens';

const auth: Router = Router()

auth.route('')
    .get(checkTokens, checkID(), getUserData)
    .delete(checkTokens, checkID(), deleteUser)

auth.post('/login', checkEmail(), login);
auth.post('/register', checkUserData(), register);
auth.post('/logout', checkTokens, checkID(), logout);
auth.post('/activate', checkTokens, activateEmailData(), activateUserEmail);

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
            .custom((email) => {
                return User.findOne({ email })
                    .then((data) => {
                        if (data && data.email != email)
                            return Promise.reject('Email already exit')
                    })
            }),
        body('password').isStrongPassword().withMessage('Password Must contain at least 1 characters(upper and lower),numbers,special characters'),
    ]
}


function activateEmailData() {
    return [
        check('code').exists().withMessage('you must enter code')
            .isInt().withMessage('code must be integer')
            .isLength({ min: 6, max: 6 }).withMessage('code must consist of 6 numbers'),
        check('user')
            .exists().withMessage('you must enter exists')
            .isInt().withMessage('invalid user ID')
            .custom((user) => {
                return Email.find({ user })
                    .then(userData => {
                        if (!userData) {
                            return Promise.reject('no user with this id');
                        }
                    });
            })
    ]
}



export default auth;