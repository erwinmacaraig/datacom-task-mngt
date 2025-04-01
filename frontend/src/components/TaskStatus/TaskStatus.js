import "./TaskStatus.css";
import { useState } from "react";

function TaskStatus({id, status}) {
    const [statusState, setStatusState] = useState(status);
    const [statusUpdated, setStatusUpdated] = useState(false);
    const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
    const [statusText, setStatusText] = useState("");
    let statuses = [
        "To Do",
        "In Progress",
        "Completed"
    ];
    let attr = {};
    const handleStatusChange = (e) => {  
        let newStat = e.target.value;      
        const params = { 
            status: newStat,
            completed: false,
            completedAt: '0000-00-00'
        };

        if (newStat == 'Completed') {            
            params['completed'] = true;
            params['completedAt'] = new Date().toISOString().split('T')[0];
        }
        fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then(response => {
            return new Promise((resolve, reject) => {
                response.json()
                .then((data) => resolve({
                    statusCode: response.status,
                    data
                }))
            })
        })
        .then(({statusCode, data}) => {
            setStatusUpdated(true);
            setStatusState(newStat);
            if (statusCode == 200) {                
                setStatusUpdateSuccess(true);
                setStatusText('Status has been updated.');
                setTimeout(() => {
                    setStatusState(status => status);
                    setStatusUpdated(false);
                }, 5000)
            } else if (statusCode >= 400) {
                setStatusUpdateSuccess(false);
                setStatusText('Status update failed.');
            }
            
            console.log(data);
            

        }).catch((e) => {
            console.log(e);
            setStatusUpdateSuccess(false);
            setStatusText('Status update failed.');
        }) 
        

            // setStatusUpdated(true);
            // setStatusText('Status update failed.');
            // setTimeout(() => {
            //     console.log();
            //     setStatusUpdated(false);
            // }, 5000)
    }
    return (
        <div className="datacom-select">
            <select className={`${statusUpdated ? "task-status": "" }`}  defaultValue={statusState} id={id} onChange={handleStatusChange}>
                { 
                  statuses.map((stat) => {
                        return <option value={stat}>{stat}</option>
                    })
                }
            </select>            
            <span className={`status-text ${statusUpdated ? "show-status-text" : ""} ${statusUpdateSuccess ? "status-text-success" : "status-text-failed"}`}> {statusText} </span>
        </div>
    );
}

export default TaskStatus;