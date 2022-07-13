import { Request, Response, NextFunction } from 'express';

import validateRequest from '../utilities/validateRequest';
import TodoList from '../models/todoListSchema';

const unreturnedData = "-createdAt -updatedAt -__v";

// #=======================================================================================#
// #			                                Create                                     #
// #=======================================================================================#
export const createTodoList = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request);
    let todoList = new TodoList({
        title: request.body.title,
        description: request.body.description,
        priority: request.body.priority,
        status: request.body.status,
        start_date: request.body.start_date,
        end_date: request.body.end_date,
        user: request.body.user,
    })
    todoList.save()
        .then((data: any) => {
            response.status(200).json({
                status: 1,
                data: {
                    _id: data._id,
                    title: data.title,
                    description: data.description,
                    priority: data.priority,
                    status: data.status,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    user: data.user,
                },
            })
        })
        .catch((error: any) => {
            next(error);
        })
}
// #=======================================================================================#
// #			                        get todo by ID                                     #
// #=======================================================================================#
export const getTodoListByID = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request);

    TodoList.findById(request.params._id).populate({ path: 'user', select: unreturnedData }).select(unreturnedData)
        .then(data => {
            if (data === null) {
                throw new Error(`No todo with this _id = ${request.params._id}`)
            } else {
                response.status(200).json({
                    status: 1,
                    data: data
                });
            }
        })
        .catch((error) => {
            next(error);
        })
}
// #=======================================================================================#
// #			                            update                                         #
// #=======================================================================================#
export const updateTodoList = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request)

    TodoList.findById(request.body._id).populate({ path: 'user', select: unreturnedData }).select(`${unreturnedData} -book`)
        .then(todoListData => {
            if (todoListData === null) {
                throw new Error('Todo not found');
            }
            todoListData.title = request.body.title
            todoListData.description = request.body.description
            todoListData.priority = request.body.priority
            todoListData.status = request.body.status
            todoListData.start_date = request.body.start_date
            todoListData.end_date = request.body.end_date

            return todoListData.save()
        }).then(saveData => {
            response.status(200).json({
                status: 1,
                data: saveData,
            })
        })
        .catch(error => {
            next(error)
        })

}
// #=======================================================================================#
// #			                            delete                                         #
// #=======================================================================================#
export const deleteTodoList = (request: Request, response: Response, next: NextFunction) => {
    validateRequest(request)

    TodoList.findByIdAndDelete(request.params._id)
        .then((data) => {
            if (data == null) {
                throw new Error(`No Todo with this id = ${request.params._id}`)
            } else {
                response.status(200).json({
                    status: 1,
                    message: 'deleted successfully',
                });
            }
        })
        .catch((error) => {
            next(error);
        })
}
// #=======================================================================================#
// #			                  get All data depend on status                            #
// #=======================================================================================#
export const getAllTodoLists = (request: Request, response: Response, next: NextFunction) => {
    getAll(request, response, next, '')
}

export const getAllTodoInProgress = (request: Request, response: Response, next: NextFunction) => {
    getAll(request, response, next, 'in_progress')
}

export const getAllTodoUnderReview = (request: Request, response: Response, next: NextFunction) => {
    getAll(request, response, next, 'under_review')
}

export const getAllTodoRework = (request: Request, response: Response, next: NextFunction) => {
    getAll(request, response, next, 'rework')
}

export const getAllTodoCompleted = (request: Request, response: Response, next: NextFunction) => {
    getAll(request, response, next, 'completed')
}



function getAll(request: Request, response: Response, next: NextFunction, status: string) {
    validateRequest(request)

    TodoList.find(status ? { status, user: request.params.user } : { user: request.params.user }).populate({ path: 'user', select: unreturnedData }).select(`${unreturnedData}`)
        .then((data) => {
            if (data.length === 0) {
                throw new Error(`No ${status} todo list to show`)
            } else {
                response.status(200).json({
                    status: 1,
                    count: data.length,
                    data: data
                });
            }
        })
        .catch((error) => {
            next(error);
        })
}