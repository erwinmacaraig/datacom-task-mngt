import './App.css';
import { useEffect, useState } from "react";
import TaskList from "./components/TaskList/TaskList";
import AddTaskModal from "./components/AddTaskModal/AddTaskModal";
import { AppContext } from "./AppContext";
function App() {
  const [tasks, setTasks] = useState([]);
  const [taskCount, setTaskCount] = useState(0) 
  const [updateStamp, setUpdateStamp] = useState(Math.round(new Date().getTime() / 1000));
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
  }, [taskCount, updateStamp]);






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

  const handleDeleteTask = (id) => {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => {
      return new Promise((resolve, reject) => {
        response.json().then((data) => resolve({
          statusCode: response.status,
          data
        }))
      })
    })
    .then(({statusCode, data}) => {
      if (statusCode == 200) {
        setTaskCount(taskCount => taskCount - 1);
      } else if (statusCode >= 400) {
        console.log("THERE WAS AN ERROR DELETING TASK");
        alert("THERE WAS AN ERROR DELETING TASK");
      }

    })
  }

  const handleTaskUpdate = (id, updatedTask) => {
    const params = {
      text: updatedTask
    }
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    .then((response) => {
      return new Promise((resolve, reject) => {
        response.json().then((data) => resolve({
          statusCode: response.status,
          data
        }))
      });
    })
    .then(({statusCode, data}) => {
      if (statusCode == 200) {
        setUpdateStamp(Math.round(new Date().getTime() / 1000));
      }
    })
    ;
  }

  return (
    <>
    <AppContext.Provider value={{handleDeleteTask, handleTaskUpdate}}>
      <AddTaskModal onClickAddTaskFxn={handleNewTask}/>
      <TaskList tasks={tasks} />
    </AppContext.Provider>
    </>
  );
}

export default App;
