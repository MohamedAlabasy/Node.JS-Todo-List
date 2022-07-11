import { Router } from 'express';
import {
    login,
    register,
    getUserData,
    deleteUser,
    logout,
    activateUserEmail,
    checkUserEmailToRestPassword,
    resetPassword
} from '../../controllers/authController';
import { body, check } from 'express-validator';

import User from '../../models/userSchema';
import Email from '../../models/emailVerificationSchema';
import Reset from '../../models/resetPasswordSchema';
import checkTokens from '../../utilities/checkTokens';

const auth: Router = Router()

auth.route('')
    .get(checkTokens, checkID(), getUserData)
    .delete(checkTokens, checkID(), deleteUser)

auth.post('/login', checkExistEmail(), login);
auth.post('/register', checkExistEmail(), checkUserName(), checkUserPassword(), register);
auth.post('/logout', checkTokens, checkID(), logout);
auth.post('/activate', checkTokens, checkCode(), checkActivateUserEmail(), activateUserEmail);
auth.post('/checkEmail', checkTokens, checkExistEmail(), checkUserEmailToRestPassword);
auth.post('/resetPassword', checkTokens, checkCode(), checkUserPassword(), checkResetPasswordUserEmail(), resetPassword);

// #=======================================================================================#
// #			                         check function                                    #
// #=======================================================================================#

function checkID() {
    return [
        body("_id").exists().withMessage('you must enter _id').isInt().withMessage('invalid Comment _id')
    ]
}

function checkExistEmail() {
    return [
        check('email')
            .exists().withMessage('you must enter email')
            .isEmail().withMessage('invalid email')
            .custom((email) => {
                return User.findOne({ email })
                    .then((data) => {
                        if (data && data.email != email)
                            return Promise.reject('email already exit')
                    })
            }),
    ]
}
function checkUserName() {
    return [
        body('name').exists().withMessage('you must enter name').isString().withMessage('invalid name'),
    ]
}

function checkUserPassword() {
    return [
        body('password').exists().withMessage('you must enter password').isStrongPassword().withMessage('Password Must contain at least 1 characters(upper and lower),numbers,special characters'),
    ]
}

function checkCode() {
    return [
        check('code').exists().withMessage('you must enter code')
            .isInt().withMessage('code must be integer')
            .isLength({ min: 6, max: 6 }).withMessage('code must consist of 6 numbers'),]
}


function checkActivateUserEmail() {
    return [
        check('user')
            .exists().withMessage('you must enter user _id')
            .isInt().withMessage('invalid user _id')
            .custom((user) => {
                return Email.find({ user })
                    .then(userData => {
                        if (!userData) {
                            return Promise.reject('no user with this _id');
                        }
                    });
            })
    ]
}

function checkResetPasswordUserEmail() {
    return [
        check('user')
            .exists().withMessage('you must enter user _id')
            .isInt().withMessage('invalid user _id')
            .custom((user) => {
                return Reset.find({ user })
                    .then(userData => {
                        if (!userData) {
                            return Promise.reject('no user with this _id');
                        }
                    });
            })
    ]
}



export default auth;