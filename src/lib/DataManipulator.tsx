import { type ServerRespond } from "./DataStreamer";

export type Row = {
  price_abc: number;
  price_def: number;
  ratio: number;
  timestamp: Date;
  lower_bound: number;
  upper_bound: number;
  trigger_alert: number | undefined;
};

export default class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    const priceABC =
      (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF =
      (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const timestamp =
      serverResponds[0].timestamp > serverResponds[1].timestamp
        ? serverResponds[0].timestamp
        : serverResponds[1].timestamp;
    const lowerBound = 1 - 0.05;
    const upperBound = 1 + 0.05;
    const triggerAlert =
      ratio > upperBound || ratio < lowerBound ? ratio : undefined;

    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp,
      lower_bound: lowerBound,
      upper_bound: upperBound,
      trigger_alert: triggerAlert,
    };
  }
}
