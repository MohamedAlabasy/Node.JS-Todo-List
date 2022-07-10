import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import validateRequest from '../utilities/validateRequest';
import User from '../models/userSchema';

const unreturnedData = "-createdAt -updatedAt -__v";

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
                    const accessToken = jwt.sign({ id: userData._id, email: userData.email }, process.env.ACCESS_TOKEN_SECRET as string, {
                        expiresIn: 86400 //for 24 hour
                    });
                    // add token to db
                    User.findOneAndUpdate({ token: accessToken }).select('+token')
                        .then((data) => {
                            response.status(200).json({
                                status: 1,
                                // token: data.token,
                                data: {
                                    id: data?._id,
                                    name: data?.name,
                                    email: data?.email,
                                }
                            });

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
    let hash = bcrypt.hashSync(request.body.password, 10);
    let user = new User({
        name: request.body.name,
        email: request.body.email,
        password: hash,
        is_verification: false,
    })
    user.save()
        .then((data: any) => {
            const output = `
                <p>You have a new contact request</p>
                <h3>Contact Details</h3>
                    <ul>  
                        <li>TODO Code</li>
                    </ul>
                <h3>Message</h3>
                <p>message</p>
                `;

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'mo7amed.el3basy@gmail.com', // generated ethereal user
                    pass: 'nfhmmdwzkcilrqkg'  // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"TODO List" <mo7amed.el3basy@gmail.com>', // sender address
                to: 'eng.mohamed.alabasy@gmail.com', // list of receivers
                subject: 'TODO Verification Request', // Subject line
                text: 'TODO List', // plain text body
                html: output // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                // res.render('contact', { msg: 'Email has been sent' });
                response.status(200).json({
                    status: 1,
                    data: {
                        _id: data._id,
                        name: data.name,
                        email: data.email
                    },
                })
            });
        })
        .catch((error: Error) => {
            next(error)
        })
}
// #=======================================================================================#
// #			                       get User by id                                      #
// #=======================================================================================#
export const getUserData = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request)
    User.findById(request.body._id).select(unreturnedData)
        .then((data) => {
            if (data === null) {
                throw new Error(`No user with this id = ${request.body._id}`)
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
// #			                          delete User                                      #
// #=======================================================================================#
export const deleteUser = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request);
    User.findByIdAndDelete(request.body._id)
        .then((data) => {
            if (data === null) {
                throw new Error(`No user with this _id = ${request.body.id}`)
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
// #			                            logout                                         #
// #=======================================================================================#
export const logout = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request);
    User.findOneAndUpdate({ token: null })
        .then(_ => {
            response.status(200).json({
                status: 1,
                data: 'logout successful',
            })
        }).catch(error => {
            next(error);
        })
}