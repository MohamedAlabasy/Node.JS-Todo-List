import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import validateRequest from '../utilities/validateRequest';
import emailVerification from '../utilities/emailVerification';
import User from '../models/userSchema';
import Email from '../models/emailVerificationSchema';
import Reset from '../models/resetPasswordSchema';

const unreturnedData = "-createdAt -updatedAt -__v";
const expireCodeTime = 3600000;
// #=======================================================================================#
// #			                            login                                          #
// #=======================================================================================#
export const login = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request);

    User.findOne({ email: request.body.email }).select(`+password ${unreturnedData}`)
        .then((userData) => {
            if (userData === null) {
                throw new Error(`No user with this email = ${request.body.email}`)
            } else {
                let passwordIsValid = bcrypt.compareSync(request.body.password, userData.password);
                if (!passwordIsValid) {
                    throw new Error(`invalid password`)
                } else {
                    // to add token to router
                    const accessToken = jwt.sign({ id: userData._id, email: userData.email, isVerification: userData.is_verification, }, process.env.ACCESS_TOKEN_SECRET as string, {
                        expiresIn: 86400 //for 24 hour
                    });
                    // add token to db
                    User.findByIdAndUpdate(userData._id, { token: `Bearer ${accessToken}` })
                        .then(_ => {
                            User.findById(userData._id).select('+token')
                                .then((data) => {
                                    response.status(200).json({
                                        status: 1,
                                        token: data?.token,
                                        data: {
                                            id: data?._id,
                                            name: data?.name,
                                            email: data?.email,
                                            is_verification: data?.is_verification,
                                        }
                                    })
                                })
                        }).catch(error => {
                            next(error);
                        })
                }
            }
        })
        .catch((error) => {
            next(error);
        })
}
// #=======================================================================================#
// #			                            Register                                       #
// #=======================================================================================#
export const register = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request)
    const registerCode = code()
    let user = new User({
        name: request.body.name,
        email: request.body.email,
        password: hashPassword(request.body.password),
        is_verification: false,
    })
    user.save()
        .then((newUserData: any) => {
            let emailVerificationCode = new Email({
                code: registerCode,
                created_at: Date.now(),
                expire_at: Date.now() + expireCodeTime,
                user: newUserData._id,
            })
            emailVerificationCode.save()
                .then(_ => {
                    emailVerification(request, registerCode);
                    response.status(200).json({
                        status: 1,
                        data: {
                            _id: newUserData._id,
                            name: newUserData.name,
                            email: newUserData.email,
                            is_verification: newUserData.is_verification,
                            msg: `The code has been sent to your email 👉 ${newUserData.email}`
                        },
                    })
                })
                .catch((error: any) => {
                    next(error);
                })
        })
        .catch((error: Error) => {
            next(error)
        })
}
// #=======================================================================================#
// #			                      activate User email                                  #
// #=======================================================================================#
export const activateUserEmail = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request);
    Email.findOne({ user: request.body.user })
        .then(resetData => {
            console.log(resetData);
            if (resetData === null) {
                throw new Error('code not found');
            } else if (new Date() >= resetData.expire_at) {
                throw new Error('This code has expired');
            }
            User.findByIdAndUpdate(resetData.user, { is_verification: true },
                function (error, docs) {
                    if (error) {
                        next(error)
                    }
                    else {
                        response.status(200).json({
                            status: 1,
                            data: 'activate email successful',
                        })
                    }
                })
        })
        .catch(error => {
            next(error)
        })
}
// #=======================================================================================#
// #                         check User email to rest password                             #
// #=======================================================================================#
export const checkUserEmailToRestPassword = (request: Request, response: Response, next: NextFunction) => {
    const resetCode = code();
    validateRequest(request);
    Email.findOne({ email: request.body.email })
        .then(emailData => {
            if (emailData === null) {
                throw new Error('this email doesn\'t exist');
            }
            let resetPasswordCode = new Reset({
                code: resetCode,
                created_at: Date.now(),
                expire_at: Date.now() + expireCodeTime,
                user: emailData._id,
            })
            resetPasswordCode.save()
                .then(_ => {
                    emailVerification(request, resetCode, true);
                    response.status(200).json({
                        status: 1,
                        data: `The code has been sent to your email 👉 ${request.body.email}`
                    })
                })
        })
        .catch(error => {
            next(error)
        })
}
// #=======================================================================================#
// #                                  reset User password                                  #
// #=======================================================================================#
export const resetPassword = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request);
    Reset.findOne({ user: request.body.user })
        .then(resetData => {
            if (resetData === null) {
                throw new Error('code not found');

            } else if (new Date() >= resetData.expire_at) {
                throw new Error('This code has expired');
            }

            User.findByIdAndUpdate(resetData.user, { password: hashPassword(request.body.password) },
                function (error, docs) {
                    if (error) {
                        next(error)
                    }
                    else {
                        response.status(200).json({
                            status: 1,
                            data: 'password updated successful',
                        })
                    }
                })
        })
        .catch(error => {
            next(error)
        })
}


// #=======================================================================================#
// #			                       get User by id                                      #
// #=======================================================================================#
export const getUserData = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request)
    User.findById(request.params._id).select(unreturnedData)
        .then((data) => {
            if (data === null) {
                throw new Error(`No user with this id = ${request.params._id}`)
            } else {
                response.status(200).json({
                    status: 1,
                    data: data,
                });
            }
        })
        .catch((error) => {
            next(error);
        })
}


// #=======================================================================================#
// #			                            logout                                         #
// #=======================================================================================#
export const logout = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request);
    User.findByIdAndUpdate(request.params._id, { token: null })
        .then(userData => {
            if (userData === null) {
                throw new Error(`No user with this _id = ${request.params._id}`)
            }
            response.status(200).json({
                status: 1,
                data: 'logout successful',
            })
        })
        .catch(error => {
            next(error)
        })
}


// #=======================================================================================#
// #                            delete User for testing only                               #
// #=======================================================================================#
export const deleteUser = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request);
    User.findByIdAndDelete(request.params._id)
        .then((data) => {
            if (data === null) {
                throw new Error(`No user with this _id = ${request.params._id}`)
            } else {
                data.deleteOne()
                response.status(200).json({
                    status: 1,
                    message: 'User deleted successfully',
                });
            }
        })
        .catch((error) => {
            next(error);
        })
}

// #=======================================================================================#
// #			                          general fun                                      #
// #=======================================================================================#
function code(): number {
    return Math.floor(100000 + Math.random() * 900000);
}
function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
}
