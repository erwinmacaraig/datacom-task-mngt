const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const _ = require('lodash');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { dynamo, checkRequestBody } = require('./utils');
const { Task } = require('./Task');
const PORT = 3000;

const app = express();

const swaggerOpts = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'Task Management APIs documentation'
        },
        servers: [
            { url: "http://localhost:3000" }
        ],
    },
    apis: ['./server.js']
};

const allowedDomain = {
    origin: [`http://datacom_react`]    
};
const swaggerDocs = swaggerJsDoc(swaggerOpts);

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * paths:
 *   /tasks:
 *     post:
 *       summary: Create a new task
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *                   description: The task and task details to create
 *                   example: Create roles for users
 *       responses:
 *         200:
 *           description: Create a mew task  
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: Task saved!    
 */
app.post('/tasks', checkRequestBody, async (req, res) => {    
    let taskDescription;
    if ( ('text' in req.body && req.body.text.trim().length === 0) || 
            !('text' in req.body)
    ){
            return res.status(400).json(
                {
                    "message": "Please specify a task description"
                }
            );
    } 
    taskDescription = req.body.text; 
    let taskId = Math.round((new Date().getTime() / 1000)).toString();
    let dateCreatedOn = new Date().toISOString().split('T')[0];
    const defaultTaskStatus = 'To Do';
    let task = new Task(
        taskId,
        taskDescription,
        defaultTaskStatus,
        dateCreatedOn        
    );
    try {
        await task.save();        
        res.json({
            "status": "Task saved!"
        });
    } catch(e) {
        return res.json({
            "error": "There was an error saving the task"
        })
    }
    

});

/**
 * @swagger
 * paths:
 *  /tasks:
 *    get:
 *      summary: Get a list of all tasks
 *      responses:
 *        200:
 *          description: A list of all tasks  
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties: 
 *                    id: 
 *                      type: string
 *                      example: 145523678
 *                    task:
 *                      type: string
 *                      example: Create responsibility matrix
 *                    status:
 *                      type: string
 *                      example: To Do
 *                    createdOn:
 *                      type: string
 *                      example: 2025-04-01
 *                    completed:
 *                      type: string
 *                      example: false
 *                    completedAt:
 *                      type: string
 *                      example: 2025-04-02      
 */
app.get('/tasks', async (req, res) => {    
    let task = new Task();
    try {
        let resultSet = await task.listAll();
        console.log(resultSet);
        let taskList = [];
        resultSet.Items.forEach((item) => {
            taskList.push({
                id: Number(item.id.S),
                task: item.task.S,
                status: item.status.S,
                createdOn: item.createdOn.S,
                completed: item.completed.S,
                completedAt: item.completedAt.S 
            });
        });
        taskList.sort(function(a, b) {
           if (a.id < b.id) { return -1; }
           if (a.id > b.id) { return 1; }
        })
        res.status(200).json(taskList);
        
    } catch(error) {
        return res.json({
            "error": error.code
        });
    }
});

/**
 * @swagger
 * paths:
 *   /tasks/{id}:
 *     get: 
 *       summary: Retrieve a task given the task id
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *             example: 1743430630
 *           required: true
 *           description: Unique identifier of the task
 *       responses:
 *         200:
 *           description: Retrieved task by id
 *           content:
 *             application/json:
 *               schema:
 *                 type: object                 
 *                 properties: 
 *                    id: 
 *                      type: string
 *                      example: 145523678
 *                    task:
 *                      type: string
 *                      example: Create responsibility matrix
 *                    status:
 *                      type: string
 *                      example: In Progress
 *                    createdOn:
 *                      type: string
 *                      example: 2025-04-01
 *                    completed:
 *                      type: string
 *                      example: false
 *                    completedAt:
 *                      type: string
 *                      example: 2025-04-02        
 *
 */
app.get('/tasks/:id', async (req, res) => {    
    id = req.params.id;
    if (Number(id) > 0 && Number(id) !== NaN) {            
        try {
            let task = new Task(id);
            let taskData;
            taskData = await task.load();
            
            return res.json(taskData)
        } catch(e) {
            return res.status(400).json({
                "message": JSON.stringify(e)
            });
        }
    } else {
        return res.status(400).json({
            "message": "Invalid parameter"
        });
    }
    

});

/**
 * @swagger
 * paths:
 *   /tasks/{id}:
 *     put:
 *       summary: Update a task by task id
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *             example: 1743430630
 *           required: true
 *           description: Unique task identifier
 *       requestBody:
 *         description: Field(s) to be updated
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 145523678
 *                 text:
 *                   type: string
 *                   example: AWS Signup
 *                 createdOn:
 *                   type: string
 *                   example: 2025-04-02
 *                 completed:
 *                   type: string
 *                   example: true
 *                 completedAt:
 *                   type: string
 *                   example: 2025-04-02
 *       responses:
 *         200:
 *           description: Result of update operation
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Task updated!
 * 
 *
 */
app.put('/tasks/:id', checkRequestBody, async (req, res) => {
    let task;
    let id = req.params.id;
    if (Number(id) > 0 && Number(id) !== NaN) {            
        try {
            let taskData;
            task = new Task(id);
            taskData = await task.load();
            
            if (_.isEmpty(taskData)) {
                return res.status(400).json({
                    "message": "No such record exists"
                });    
            }

            
        } catch(e) {
            return res.status(400).json({
                "message": JSON.stringify(e)
            });
        }
    } else {
        return res.status(400).json({
            "message": "Invalid parameter"
        });
    }
    
    if ('text' in req.body) {
        task.set('text', req.body.text);
    }
    if ('status' in req.body) {
        task.set('status', req.body.status)
    }
    if ('createdOn' in req.body) {
        task.set('createdOn', req.body.createdOn)
    }
    if ('completed' in req.body) {
        task.set('completed', req.body.completed)
    }
    if ('completedAt' in req.body) {
        task.set('completedAt', req.body.completedAt)
    }
    try {
        await task.save();
        res.json({
            "message": "Task updated!"
        })
    } catch(e) {
        console.log(e);
        res.status(400).json({
            "message": JSON.stringify(e)
        })
    }

});

/**
 * @swagger
 * paths:
 *   /tasks/{id}:
 *     delete:
 *       sumary: Delete task record
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: Unique task identifier
 *       responses:
 *         200:
 *           description: Result of delete operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Task deleted!
 */
app.delete('/tasks/:id', async (req, res) => {    
    let task;
    let id = req.params.id;
    
    if (Number(id) > 0 && Number(id) !== NaN) {            
        try {
            task = new Task(id);
            await task.deleteTask();
            return res.json({
                "message": "Task deleted!"
            })
        } catch(e) {
            return res.status(400).json(
                {
                    "taskId": id,
                    "code": e.code,
                    "message": e.message
                }
            );
        }
    } else {
        return res.status(400).json({
            "message": "Invalid parameter"
        });
    }
});

app.get('/delete/:tablename', (req, res) => {
    
    const params = {
        TableName: req.params.tablename
    }
    dynamo.deleteTable(params, (error, data) => {
        if (error && error.code === 'ResourceNotFound') {
            return res.json({
                "message": "Table not found"
            })
        } else if (error && error.code === "ResourceInUseException") {
            console.log("Error: Table in use");
        } else if (error) {
            return res.json({
                error: JSON.stringify(error)
            });
        } 
        else {
            return res.json({
                "message": "Table Deleted",
                "data": data
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Waiting for incomming requests at ${PORT}`);
    
    const params = {
        AttributeDefinitions: [
          {
            AttributeName: "id",
            AttributeType: "S",
          }          
        ],
        KeySchema: [
          {
            AttributeName: "id",
            KeyType: "HASH",
          }           
        ],
        
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
        TableName: "Tasks",
        StreamSpecification: {
          StreamEnabled: false,
        },
    };
    dynamo.createTable(params, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            console.log("DynamoDB table created successfully");
        }
    });
});
