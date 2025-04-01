import "./TaskList.css";
import Task from "../Task/Task";

function TaskList({tasks}){

    return (
        <section className="container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Task ID</th>
                        <th>Date Created</th>
                        <th>Task</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead> 
                <tbody>
                    {
                        tasks.map((task) => {
                            return (
                                <Task
                                    key={task.id}
                                    id={task.id}
                                    createdOn={task.createdOn}
                                    task={task.task}
                                    status={task.status} 
                                /> 
                            );
                        })
                    }
                </tbody>
            </table>
        </section>
    );
}

export default TaskList;