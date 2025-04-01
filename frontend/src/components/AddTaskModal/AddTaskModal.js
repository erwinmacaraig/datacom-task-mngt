import './AddTaskModal.css';
import { useState, useRef } from "react";

function AddTaskModal({onClickAddTaskFxn}){
    const [newTask, setNewTask] = useState('');
    const dialogRef = useRef(null);

    const handleShowTaskDialogForm = (e) => { 

        if(e.target.value == 'show') {
            dialogRef.current.showModal();
        } else {  
            setNewTask('');          
            dialogRef.current.close();            
        }
        
    }
    const handleNewTask = () => {
        
        onClickAddTaskFxn(newTask);
        setNewTask('');        
        dialogRef.current.close();
    }
    return (
        <div>
            <dialog id="addTaskDialog" ref={dialogRef}>
                <form method="dialog">
                    <p>
                        <label>
                            Create New Task:                        
                        </label>
                    </p>
                    <div>
                        <textarea name="myNewTask"
                                rows={5}
                                cols={50}
                                value={newTask}
                                onChange={(e) => {setNewTask(e.target.value)}}>                        
                        </textarea>                       
                    </div>
                    <div className="btn-addtask-modal">
                        <button value="close" onClick={handleShowTaskDialogForm}>Cancel</button>
                        <button onClick={handleNewTask}>Submit</button>
                    </div>
                </form>
            </dialog>
            <div className="add-task-btn-container">
            <button className="addTaskBtn" value="show" onClick={handleShowTaskDialogForm}>Add New Task</button>
            </div>
            
        </div>
    );
}

export default AddTaskModal;