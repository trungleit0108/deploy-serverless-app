import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const AWSXRay = require('aws-xray-sdk')

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('todosDataAccess')

const XAWS = AWSXRay.captureAWS(AWS)
const documentClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.ATTACHMENT_S3_BUCKET

export const createTodo = async (todo: TodoItem): Promise<TodoItem> => {
  logger.info(`Creating a todo`, {
    todoId: todo.todoId
  })

  await documentClient
    .put({
      TableName: todosTable,
      Item: todo
    })
    .promise()

  return todo
}

export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
  logger.info('Getting all todos')

  const result = await documentClient
    .query({
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    .promise()

  return result.Items as TodoItem[]
}

export const updateStatusTodo = async (
  userId: string,
  todoId: string,
  todo: TodoUpdate
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

  const result = await documentClient.update(params).promise()

  logger.info(`Update statement has completed without error`, {
    result: result
  })

  return result.Attributes as TodoItem
}

export const updateAttachmentTodo = async (userId: string, todoId: string) => {
  try {
    await documentClient
      .update({
        TableName: todosTable,
        Key: { todoId, userId },
        UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
        ExpressionAttributeNames: { '#attachmentUrl': 'attachmentUrl' },
        ExpressionAttributeValues: {
          ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()
  } catch (error) {
    logger.error(error)
  }
}

export const deleteTodo = async ({ userId, todoId }) => {
  logger.info(`Deleting a todo`, {
    userId: userId,
    todoId: todoId
  })

  await documentClient
    .delete({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    })
    .promise()
}
