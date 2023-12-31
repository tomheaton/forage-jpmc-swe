import { type Table, type TableData } from "@finos/perspective";
import { createElement, useEffect, useState } from "react";
import DataManipulator from "../lib/DataManipulator";
import { type ServerResponse } from "../lib/DataStreamer";
import schema from "../lib/schema";

type PerspectiveViewerElement = HTMLElement & {
  load: (table: Table) => void;
};

type Props = {
  data: ServerResponse[];
};

export default function Graph({ data }: Props) {
  const [table, setTable] = useState<Table | undefined>(undefined);

  useEffect(() => {
    const elem = document.getElementsByTagName(
      "perspective-viewer",
    )[0] as unknown as PerspectiveViewerElement;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (window.perspective && window.perspective.worker()) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setTable(window.perspective.worker().table(schema));
    }

    if (!table) {
      return;
    }

    elem.load(table);
    elem.setAttribute("view", "y_line");
    elem.setAttribute("row-pivots", '["timestamp"]');
    elem.setAttribute(
      "columns",
      '["ratio", "lower_bound", "upper_bound", "trigger_alert"]',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (table) {
      table.update([DataManipulator.generateRow(data)] as unknown as TableData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return createElement("perspective-viewer");
}
