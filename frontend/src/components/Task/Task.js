import "./Task.css";
import TaskStatus from "../TaskStatus/TaskStatus";
import DeleteIcon from "../icons/DeleteIcon";
import DeleteConfirmationModal from "../DeleteConfiormationModal/DeleteConfirmationModal";
import UpdateTaskModal from "../UpdateTaskModal/UpdateTaskModal";
import EditIcon from "../icons/EditIcon"; 
import { AppContext } from "../../AppContext";
import { useContext, useRef } from "react";

function Task({ id, createdOn, task, status }){
    const { handleDeleteTask } = useContext(AppContext);
    const dRef = useRef(null);
    const updateRef= useRef(null);
    const handleDeleteDecisionClickFxn = (decision) => {        
        if (decision == 'yes') {
            handleDeleteTask(id);            
        } 
        console.log(decision);
        dRef.current.close();
        
    }
   
    return (
        <>  
            <tr className="row">
                <td>{id}</td>
                <td>{createdOn}</td>
                <td className="tdbreak">{task}</td>
                <td>
                    <TaskStatus id={id} status={status} />
                </td>
                <td>
                    <span className="icon-ops" onClick={() => {updateRef.current.showModal()}}>
                        <EditIcon />
                        <UpdateTaskModal ref={updateRef} task={task} id={id} />
                    </span>                
                    <span className="icon-ops" onClick={() => {dRef.current.showModal();}}>
                        <DeleteIcon />
                        <DeleteConfirmationModal ref={dRef} handleDeleteDecisionClick={handleDeleteDecisionClickFxn}  />
                    </span>
                </td>
            </tr>
        </>        
    );
}

export default Task;


