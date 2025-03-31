const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const _ = require('lodash');
const { dynamo, checkRequestBody } = require('./utils');

const { Task } = require('./Task');

const PORT = 3000;

const app = express();

const allowedDomain = {
    origin: [`http://datacom_react`]    
};

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json());

app.get('/tasks', async (req, res) => {    
    let task = new Task();
    try {
        let resultSet = await task.listAll();
        let taskList = [];
        resultSet.Items.forEach((item) => {
            taskList.push({
                id: item.id.S,
                task: item.task.S,
                createdOn: item.createdOn.S,
                completed: item.completed.S,
                completedAt: item.completedAt.S 
            });
        });
        res.status(200).json(taskList);
        
    } catch(error) {
        return res.json({
            "error": error.code
        });
    }
});


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
    let task = new Task(
        taskId,
        taskDescription,
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

app.delete('/tasks/:id', async (req, res) => {
    //todo: delete a task
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
