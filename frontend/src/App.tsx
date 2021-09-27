import "./App.css";
import { useState } from "react";
import axios from "axios";

const getPodNames = async (): Promise<string[]> => {
  var res = await axios.get("http://localhost:1234");
  return res.data;
};

function App() {
  const [podNames, setPodNames] = useState<String[]>([]);
  return (
    <div className="App">
      <h2> Welcome to K8S-Control-Server</h2>
      <button
        onClick={async () => {
          setPodNames(await getPodNames());
        }}
      >
        Click this to show running pods
      </button>
      <div>
        {podNames.map((pod) => {
          return <p>{pod}</p>;
        })}
      </div>
    </div>
  );
}

export default App;
