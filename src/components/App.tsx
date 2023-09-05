import { useState } from "react";
import DataStreamer, { type ServerResponse } from "../lib/DataStreamer";
// import Graph from "./Graph";
import Graph from "./GraphOld";

export default function App() {
  const [data, setData] = useState<ServerResponse[]>([]);
  const [showGraph, setShowGraph] = useState<boolean>(false);

  const handleGetData = async () => {
    console.log("getting data...");

    let count = 0;

    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerResponse[]) => {
        setData(serverResponds);
        setShowGraph(true);
      });

      count++;

      if (count > 1_000) {
        clearInterval(interval);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="font-bold text-4xl">forage-jpmc-sw</h1>
      <button onClick={handleGetData}>Get Data</button>
      {showGraph && <Graph data={data} />}
    </div>
  );
}
