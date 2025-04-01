import { useState, useRef } from "react";

function AddTaskModal({onClickAddTaskFxn}){
    const [newTask, setNewTask] = useState('');
    const dialogRef = useRef(null);

    const handleShowTaskDialogForm = () => {
        dialogRef.current.showModal();
    }
    const handleNewTask = () => {
        dialogRef.current.close();
        onClickAddTaskFxn(newTask);        
    }
    return (
        <>
        <dialog id="addTaskDialog" ref={dialogRef}>
            <form method="dialog">
                <p>
                    <label>
                        Create New Task:
                        <input type="text" required value={newTask} onChange={(e) => {
                            setNewTask(e.target.value)
                        }}/>
                    </label>
                </p>
                <div>
                    <button onClick={handleNewTask}>Submit</button>
                </div>
            </form>
        </dialog>
        <button className="showAddTaskDialogForm" onClick={handleShowTaskDialogForm}>Add New Task</button>
        </>
    );
}

export default AddTaskModal;