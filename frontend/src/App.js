import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("http://localhost:3000/", {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => { console.log(data); })
    .catch((error) => { console.log(error);})
  }, []);
  return (
    <div>
      <h1>Happy Coding in React Everyone.</h1>
    </div>
  );
}

export default App;
