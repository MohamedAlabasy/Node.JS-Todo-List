import { Router } from 'express';
import {
    createTodoList,
    getAllTodoLists,
    getAllTodoInProgress,
    getAllTodoUnderReview,
    getAllTodoRework,
    getAllTodoCompleted,
    getTodoListByID,
    updateTodoList,
    deleteTodoList
} from '../../controllers/todoListController';
import { body, check } from 'express-validator';

import TodoList from '../../models/todoListSchema';
import User from '../../models/userSchema';
import checkTokens from '../../utilities/checkTokens';

const todoList: Router = Router()

todoList.route('')
    .post(checkCourseData(), createTodoList)
    .get(checkTokens, checkID(), getTodoListByID)
    .patch(checkID(), checkCourseData(), updateTodoList)
    .delete(checkTokens, checkID(), deleteTodoList)

todoList.get('/all', checkTokens, getAllTodoLists);
todoList.get('/inProgress', checkTokens, getAllTodoInProgress);
todoList.get('/underReview', checkTokens, getAllTodoUnderReview);
todoList.get('/rework', checkTokens, getAllTodoRework);
todoList.get('/completed', checkTokens, getAllTodoCompleted);
// #=======================================================================================#
// #			                         check function                                    #
// #=======================================================================================#

function checkID() {
    return [
        body("_id").isInt().withMessage('invalid chapter ID')
    ]
}

function checkCourseData() {
    return [
        check('title')
            .isString().withMessage('invalid title')
            .custom(title => {
                return TodoList.findOne({ title })
                    .then(titleData => {
                        if (titleData) {
                            return Promise.reject('title already exit');
                        }
                    });
            }),

        body('description').isString().withMessage('invalid description')
            .isLength({ min: 20 }).withMessage('description less than 20 character'),
        body('priority').isAlpha().withMessage('invalid priority')
            .isIn(['high', 'medium', 'low']).withMessage('priority must be in high or medium or low'),
        body('status').isString().withMessage('invalid status')
            .isIn(['in_progress', 'under_review', 'rework', 'completed']).withMessage('status must be in in_progress or under_review or rework or completed'),
        body('start_date').isDate({ format: 'YYYY-MM-DD' }).withMessage('invalid birth date you must enter it in form of YYYY-MM-DD'),
        body('end_date').isDate({ format: 'YYYY-MM-DD' }).withMessage('invalid birth date you must enter it in form of YYYY-MM-DD'),

        check('user')
            .isInt().withMessage('invalid user ID')
            .custom((userID) => {
                return User.findById(userID)
                    .then(userData => {
                        if (!userData) {
                            return Promise.reject('no user with this id');
                        }
                    });
            }),
    ]
}

export default todoList;