import { type Table, type TableData } from "@finos/perspective";
import "@finos/perspective-viewer";
import { useEffect, useRef } from "react";
import DataManipulator from "../lib/DataManipulator";
import { type ServerRespond } from "../lib/DataStreamer";

const SCHEMA = {
  price_abc: "float",
  price_def: "float",
  ratio: "float",
  timestamp: "date",
  lower_bound: "float",
  upper_bound: "float",
  trigger_alert: "float",
};

type PerspectiveViewerElement = HTMLElement & {
  load: (table: Table) => void;
};

type Props = {
  data: ServerRespond[];
};

export default function Graph({ data }: Props) {
  const tableRef = useRef<Table | undefined>(undefined);

  useEffect(() => {
    const elem = document.getElementsByTagName(
      "perspective-viewer",
      // )[0] as HTMLPerspectiveViewerPluginElement;
    )[0] as PerspectiveViewerElement;

    // @ts-ignore
    if (window.perspective && window.perspective.worker()) {
      // @ts-ignore
      tableRef.current = window.perspective.worker().table(SCHEMA);
    }

    if (!tableRef.current) {
      return;
    }

    elem.load(tableRef.current);
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
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.update([
        DataManipulator.generateRow(data),
      ] as unknown as TableData);
    }
  }, [data]);

  return <perspective-viewer />;
}
