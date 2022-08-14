import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

import { createLogger } from '../utils/logger'

const logger = createLogger('todosDataAccess')

const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const s3: AWS.S3 = new AWS.S3({ signatureVersion: 'v4' })
const urlExpiration: Number = Number(process.env.SIGNED_URL_EXPIRATION)

export const getTodos = async (userId: string): Promise<TodoItem[]> => {
  logger.info('Getting all todos')

  const result = await docClient
    .query({
      TableName: todosTable,
      KeyConditionExpression: '#userId =:i',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':i': userId
      }
    })
    .promise()

  const items = result.Items

  return items as TodoItem[]
}

export const createTodo = async (todo: TodoItem): Promise<TodoItem> => {
  logger.info(`Creating a todo`, {
    todoId: todo.todoId
  })

  await docClient
    .put({
      TableName: todosTable,
      Item: todo
    })
    .promise()

  return todo
}

export const deleteTodo = async (todoId: string, userId: string) => {
  logger.info(`Deleting a todo`, {
    todoId: todoId,
    userId: userId
  })

  await docClient
    .delete({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    })
    .promise()
}

export const updateTodo = async (
  todo: TodoUpdate,
  todoId: string,
  userId: string
): Promise<TodoItem> => {
  logger.info(`Updating a todo`, {
    todoId: todoId,
    userId: userId
  })

  const params = {
    TableName: todosTable,
    Key: {
      userId: userId,
      todoId: todoId
    },
    ExpressionAttributeNames: {
      '#todo_name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': todo.name,
      ':dueDate': todo.dueDate,
      ':done': todo.done
    },
    UpdateExpression:
      'SET #todo_name = :name, dueDate = :dueDate, done = :done',
    ReturnValues: 'ALL_NEW'
  }

  const result = await docClient.update(params).promise()

  logger.info(`Update statement has completed without error`, {
    result: result
  })

  return result.Attributes as TodoItem
}

export const getUrl = async (
  todoId: string,
  userId: string
): Promise<string> => {
  // Get pre-signed URL from filestore
  const url = await s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })

  logger.info('url', { url: url })

  // Write final url to datastore
  await updateTodoUrl(todoId, userId)
  return url
}

export const updateTodoUrl = async (todoId: string, userId: string) => {
  logger.info(`Updating a todo's URL for item:`, {
    todoId: todoId,
    userId: userId
  })

  const url = `https://${bucketName}.s3.amazonaws.com/${todoId}`

  const params = {
    TableName: todosTable,
    Key: {
      userId: userId,
      todoId: todoId
    },
    ExpressionAttributeNames: {
      '#todo_attachmentUrl': 'attachmentUrl'
    },
    ExpressionAttributeValues: {
      ':attachmentUrl': url
    },
    UpdateExpression: 'SET #todo_attachmentUrl = :attachmentUrl',
    ReturnValues: 'ALL_NEW'
  }

  const result = await docClient.update(params).promise()

  logger.info(`Update statement has completed without error`, {
    result: result
  })

  return result.Attributes as TodoItem
}