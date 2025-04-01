import { useEffect, useState } from "react";
import TaskList from "./components/TaskList/TaskList";
import AddTaskModal from "./components/AddTaskModal/AddTaskModal";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskCount, setTaskCount] = useState(0) 
  useEffect(() => {
    fetch("http://localhost:3000/tasks", {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => { 
      console.log(data);      
      setTasks(data);
      setTaskCount(tasks.length)
     })
    .catch((error) => { console.log(error);})
  }, [taskCount]);


  const handleNewTask = (newTask) => {
      // todo 
      console.log("this is your new task", newTask);
      fetch("http://localhost:3000/tasks", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: newTask
        })
      })
      .then((response) => response.json())
      .then((data) => {
        setTaskCount(taskCount => taskCount + 1);
        console.log(data);
      })
  }
  return (
    <>
    <AddTaskModal onClickAddTaskFxn={handleNewTask}/>
    <TaskList tasks={tasks} />
    </>
  );
}

export default App;
