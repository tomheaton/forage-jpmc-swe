import { useState } from "react";
import Graph from "./Graph";

export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [showGraph, setShowGraph] = useState<boolean>(false);

  const handleGetData = async () => {
    console.log("getting data...");
    setShowGraph(true);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="font-bold text-4xl">forage-jpmc-sw</h1>
      <button onClick={handleGetData}>Get Data</button>
      {showGraph && <Graph data={data} />}
    </div>
  );
}
