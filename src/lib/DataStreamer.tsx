export type Order = {
  price: number;
  size: number;
};

export type ServerRespond = {
  stock: string;
  top_bid: Order;
  top_ask: Order;
  timestamp: Date;
};

export default class DataStreamer {
  static API_URL: string = "http://localhost:80380/query?id=1";

  static getData(callback: (data: ServerRespond[]) => void): void {
    const request = new XMLHttpRequest();
    request.open("GET", DataStreamer.API_URL, false);

    request.onload = () => {
      if (request.status === 200) {
        callback(JSON.parse(request.responseText));
      } else {
        alert("Request failed");
      }
    };

    request.send();
  }
}
