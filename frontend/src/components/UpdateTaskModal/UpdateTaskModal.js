import "./UpdateTaskModal.css";

import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";

function UpdateTaskModal({id, task, ref}){

    const [updatedTask, setStatusUpdated] = useState(task);
    const { handleTaskUpdate } = useContext(AppContext);

    // useEffect(() => {
    //     fetch(`http://localhost:3000/tasks/${id}`, {
    //         method: 'get',
    //         headers: { 'Content-Type': 'application/json'}            
    //     }).then((response) => {
    //         return new Promise((resolve, reject) => {
    //             response.json().then((data) => resolve({
    //                 statusCode: response.statusCode,
    //                 data
    //             }))
    //         })
    //     }).then(({statusCode, data}) => {
    //         if (statusCode == 200){
    //             console.log(data);
    //         }
    //     })
    // }, []);
    const handleCancelUpdate = () => {
        if (updatedTask.trim().length == 0) {
            setStatusUpdated(task)
        }
        ref.current.close();
    }
    const updateTask = () => {
        if (updatedTask.trim().length == 0) {
            setStatusUpdated(task)
        } else {
            handleTaskUpdate(id, updatedTask); 
        }
        ref.current.close();
    }
    return (
        <dialog id="updateTaskDialog" ref={ref}>
            <form method="dialog">
                <p>
                    <label>
                        Update Task:                        
                    </label>
                </p>
                <div>
                    <textarea name="updateThisTask"                            
                            rows={5}
                            cols={50}                            
                            value={updatedTask}
                            onChange={(e) => {setStatusUpdated(e.target.value)}}>                        
                    </textarea>                       
                </div>
                <div className="btn-addtask-modal">
                    <button value="close" onClick={handleCancelUpdate}>Cancel</button>    
                    <button onClick={updateTask}>Submit</button>
                </div>
            </form>
        </dialog>
    );
}
export default UpdateTaskModal;