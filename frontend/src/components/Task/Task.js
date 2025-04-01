import "./Task.css";
import TaskStatus from "../TaskStatus/TaskStatus";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon"; 

function Task({ id, createdOn, task, status }){
    return (
        <tr className="row">
            <td>{id}</td>
            <td>{createdOn}</td>
            <td>{task}</td>
            <td>
                <TaskStatus id={id} status={status} />
            </td>
            <td>
                <span className="icon-ops">
                    <EditIcon />
                </span>
                
                <span className="icon-ops">
                    <DeleteIcon />
                </span>  
                
            </td>
        </tr>
    );
}

export default Task;


