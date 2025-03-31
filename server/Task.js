
const { dynamo, docClient } = require('./utils');

class Task {
    constructor(id="", text="", status="", createdOn="", completed=false, completedAt="0000-00-00") {
        this.id = id;
        this.text = text;
        this.status = status;
        this.createdOn = createdOn;
        this.completed = completed;
        this.completedAt = completedAt;
        
    }

    set(field, value) {
        switch(field) {
            case 'id': 
                this.id = value;
            break;
            case 'text':
                this.text = value;
            break;
            case 'status':
                this.status = value;
            break;
            case 'createdOn':
            this.createdOn = value;
            break;
            case 'completed':
                this.completed = value;                
            break;
            case 'completedAt':
                this.completedAt = value;
            break;
        }
    }
    load() {
        const params = {
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': {'S': this.id }
            },
            TableName: 'Tasks'
        };

        return new Promise((resolve, reject) => {
            dynamo.query(params, (error, data) => {
                if (error) {
                    reject(error)
                    return;
                }
                let taskDetails = {};
                data.Items.forEach((item) => {
                    taskDetails = {
                        id: item.id.S,
                        task: item.task.S,
                        status: item.status.S,
                        createdOn: item.createdOn.S,
                        completed: item.completed.S,
                        completedAt: item.completedAt.S
                    };
                    this.text = item.task.S;
                    this.status = item.status.S;
                    this.createdOn = item.createdOn.S;
                    this.completed = item.completed.S;
                    this.completedAt = item.completedAt.S;
                })
                resolve(taskDetails);
            });
        });
    }
    
    listAll() {
        const params = {
            TableName: "Tasks"
        };        
        return new Promise((resolve, reject) => {
            dynamo.scan(params, (error, data) => {
                    if (error) {
                        console.log(error);                
                        reject(error)
                        return;
                    }                    
                    resolve(data);
                    console.log(data);
                    return;
                });
        });

    }

    getTaskData() {
        return {
            id: this.id,
            task: this.text,
            status: this.status,
            createdOn: this.createdOn,
            completed: this.completed,
            completedAt: this.completedAt
        };
    }
    save() {
        const params = {
            TableName: "Tasks",
            Item: {
                id: { S: this.id },
                task: { S: this.text },
                status: { S: this.status },
                createdOn: { S: this.createdOn },
                completed: { S: this.completed.toString() },
                completedAt: { S: this.completedAt }

            }
        };
        return new Promise((resolve, reject) => {
            dynamo.putItem(params, (error, data) => {
                if (error) {                                    
                    reject(error);                    
                } else {
                    resolve(data);                    
                }
                return;
                
            });
        });
        

    }

    deleteTask() {
        const params = {
            TableName: "Tasks",
            Key: {
                id: this.id 
            }
        };
        return new Promise((resolve, reject) => {
            docClient.delete(params, (error, data) => {
                if (error) {                    
                    reject(error)
                    return;
                }
                resolve(data);
            });
        })

    }
}

module.exports = { Task };

