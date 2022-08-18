import { v4 as uuidv4 } from 'uuid'

import {
  getTodosForUser,
  createTodo as createTodoAccess,
  deleteTodo as deleteTodoAccess,
  updateStatusTodo as updateStatusTodoAccess,
  updateAttachmentTodo as updateAttachmentTodoAccess
} from './todosAccess'
import { getPresignedUploadURL as getPresignedUploadURLAccess } from './attachmentUtils'

import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { CreateSignedURLRequest } from '../requests/CreateSignedURLRequest'

// TODO: Implement businessLogic
export const createTodo = async (
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> => {
  const id = uuidv4()

  return await createTodoAccess({
    todoId: id,
    userId,
    name: createTodoRequest.name,
    done: false,
    createdAt: new Date().toISOString(),
    dueDate: createTodoRequest.dueDate
  })
}

export const getTodos = async (userId: string): Promise<TodoItem[]> => {
  return await getTodosForUser(userId)
}

export const updateStatusTodo = async (
  userId: string,
  todoId: string,
  payload: UpdateTodoRequest
): Promise<TodoItem> => {
  return await updateStatusTodoAccess(userId, todoId, payload)
}

export const getPresignedUploadURL = async (
  createSignedURLRequest: CreateSignedURLRequest
): Promise<string> => {
  return await getPresignedUploadURLAccess(createSignedURLRequest)
}

export const updateAttachmentTodo = async (
  userId: string,
  todoId: string
): Promise<void> => {
  return await updateAttachmentTodoAccess(userId, todoId)
}

export const deleteTodo = async (
  userId: string,
  todoId: string
): Promise<void> => {
  return await deleteTodoAccess({ userId, todoId })
}
