import { type Table, type TableData } from "@finos/perspective";
import { Component, createElement } from "react";
import DataManipulator from "../lib/DataManipulator";
import { type ServerResponse } from "../lib/DataStreamer";
import schema from "../lib/schema";

type PerspectiveViewerElement = HTMLElement & {
  load: (table: Table) => void;
};

type Props = {
  data: ServerResponse[];
};

export default class Graph extends Component<Props> {
  table: Table | undefined;

  componentDidMount() {
    const elem = document.getElementsByTagName(
      "perspective-viewer",
    )[0] as unknown as PerspectiveViewerElement;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (window.perspective && window.perspective.worker()) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.table = window.perspective.worker().table(schema);
    }

    if (!this.table) {
      return;
    }

    elem.load(this.table);
    elem.setAttribute("view", "y_line");
    elem.setAttribute("row-pivots", JSON.stringify(["timestamp"]));
    elem.setAttribute(
      "columns",
      JSON.stringify(["ratio", "lower_bound", "upper_bound", "trigger_alert"]),
    );
    elem.setAttribute(
      "aggregates",
      JSON.stringify({
        price_abc: "avg",
        price_def: "avg",
        ratio: "avg",
        timestamp: "distinct count",
        lower_bound: "avg",
        upper_bound: "avg",
        trigger_alert: "avg",
      }),
    );
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ] as unknown as TableData);
    }
  }

  render() {
    return createElement("perspective-viewer");
  }
}
