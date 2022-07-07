import { Router } from 'express';
import { createTodoList, getAllTodoLists, getTodoListByID, updateTodoList, deleteTodoList } from '../../controllers/todoListController';
import { body, check } from 'express-validator';

import TodoList from '../../models/todoListSchema';
import User from '../../models/userSchema';
import checkTokens from '../../utilities/checkTokens';

const todoList: Router = Router()

// start_date
// end_date

todoList.route('')
    .post(checkCourseData(), createTodoList)
    .get(checkTokens, checkID(), getTodoListByID)
    .patch(checkID(), checkCourseData(), updateTodoList)
    .delete(checkTokens, checkID(), deleteTodoList)

todoList.get('/all', checkTokens, getAllTodoLists);
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
                return TodoList.findOne({ title: title })
                    .then(titleData => {
                        if (titleData && titleData.title != title) {
                            return Promise.reject('title already exit');
                        }
                    });
            }),
        body('description').isString().withMessage('invalid description'),
        body('priority').isAlpha().withMessage('invalid priority').isIn(['high', 'medium', 'low']).withMessage('priority must be in high or medium or low'),
        body('status').isString().withMessage('invalid status').isIn(['in_progress', 'under_review', 'rework', 'completed']).withMessage('status must be in in_progress or under_review or rework or completed'),

        check('user')
            .isInt().withMessage('invalid user ID')
            .custom(userID => {
                return User.findById(userID)
                    .then(userData => {
                        if (!userData) {
                            return Promise.reject('user ID Not Found');
                        }
                    });
            }),
    ]
}

export default todoList;