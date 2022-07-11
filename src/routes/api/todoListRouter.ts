import { Router } from 'express';
import { body, check } from 'express-validator';

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

import TodoList from '../../models/todoListSchema';
import User from '../../models/userSchema';
import checkTokens from '../../utilities/checkTokens';

const todoList: Router = Router()

todoList.route('')
    .post(checkTokens, checkExistTitle(), checkTodoData(), checkUserID(), createTodoList)
    .get(checkTokens, checkTodoID(), getTodoListByID)
    .put(checkTokens, checkTodoID(), checkUpdateTitle(), checkTodoData(), updateTodoList)
    .delete(checkTokens, checkTodoID(), deleteTodoList)

todoList.get('/all', checkTokens, getAllTodoLists);
todoList.get('/inProgress', checkTokens, getAllTodoInProgress);
todoList.get('/underReview', checkTokens, getAllTodoUnderReview);
todoList.get('/rework', checkTokens, getAllTodoRework);
todoList.get('/completed', checkTokens, getAllTodoCompleted);
// #=======================================================================================#
// #			                         check function                                    #
// #=======================================================================================#

function checkTodoID() {
    return [
        body("_id").exists().withMessage('you must enter _id').isInt().withMessage('invalid todo ID')
    ]
}

function checkExistTitle() {
    return [
        check('title')
            .exists().withMessage('you must enter title')
            .isString().withMessage('invalid title')
            .custom((title) => {
                return TodoList.findOne({ title })
                    .then(titleData => {
                        if (titleData)
                            return Promise.reject('title already exit');
                    });
            }),
    ]
}
function checkUpdateTitle() {
    let currentID: number;
    return [
        body("_id").custom(todoID => {
            return currentID = todoID;
        }).withMessage('invalid todo ID'),
        check('title')
            .exists().withMessage('you must enter title')
            .isString().withMessage('invalid title')
            .custom(title => {
                return TodoList.findOne({ title }).then(currentTitleData => {
                    if (currentTitleData) {
                        return TodoList.findOne({ _id: currentID }).then(oldTitleData => {
                            console.log(oldTitleData?.title);
                            console.log(currentTitleData.title);
                            if (oldTitleData?.title != currentTitleData.title) {
                                return Promise.reject('title already exit');
                            }
                        });
                    }
                })
            })
    ]
}


function checkTodoData() {
    return [
        body('description').exists().withMessage('you must enter description').isString().withMessage('invalid description')
            .isLength({ min: 20 }).withMessage('description less than 20 character'),
        body('priority').exists().withMessage('you must enter priority').isAlpha().withMessage('invalid priority')
            .isIn(['high', 'medium', 'low']).withMessage('priority must be in high or medium or low'),
        body('status').exists().withMessage('you must enter status').isString().withMessage('invalid status')
            .isIn(['in_progress', 'under_review', 'rework', 'completed']).withMessage('status must be in in_progress or under_review or rework or completed'),
        body('start_date').exists().withMessage('you must enter start_date').isDate({ format: 'YYYY-MM-DD' }).withMessage('invalid birth date you must enter it in form of YYYY-MM-DD'),
        body('end_date').exists().withMessage('you must enter end_date').isDate({ format: 'YYYY-MM-DD' }).withMessage('invalid birth date you must enter it in form of YYYY-MM-DD'),
    ]
}
function checkUserID() {
    return [
        check('user')
            .exists().withMessage('you must enter exists')
            .isInt().withMessage('invalid user ID')
            .custom((userID) => {
                return User.findById(userID)
                    .then(userData => {
                        if (!userData) {
                            return Promise.reject('no user with this id');
                        }
                    });
            })
    ]
}
export default todoList;