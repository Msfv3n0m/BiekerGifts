
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ReactTabulator, ColumnDefinition } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import "tabulator-tables/dist/css/tabulator.min.css";

import { db } from "../services/FirebaseService";
import {
  doc,
  getDocs,
  updateDoc,
  query,
  collection,
  where,
  orderBy,
} from "firebase/firestore";

type WishRow = {
  id: string;
  Name: string;
  Note: string;
  Link: string;
  WantedBy: string;
  ClaimedBy: string;
};

const OtherListsComponent: React.FC = () => {
  const [rowData, setRowData] = useState<WishRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "Wishes"),
        where("WantedBy", "!=", "Jared"),
        orderBy("WantedBy")
      );
      const snapshot = await getdocsSafe(q);

      const rows: WishRow[] = snapshot.docs.map((d) => {
        const data = d.data() as Partial<WishRow>;
        return {
          id: d.id,
          ClaimedBy: data.ClaimedBy ?? "",
          Name: data.Name ?? "",
          Note: data.Note ?? "",
          Link: data.Link ?? "",
          WantedBy: data.WantedBy ?? "",
        };
      });

      setRowData(rows);
    };

    void fetchData();
  }, []);

  async function getdocsSafe(q: any) {
    try {
      return await getDocs(q);
    } catch (e) {
      console.error(
        "Failed to query Firestore. If you use '!=' make sure you have a composite index and orderBy the same field.",
        e
      );
      throw e;
    }
  }

  // Unique WantedBy -> values map for select filter (with "All")
  const wantedByFilterValues = useMemo(() => {
    const set = new Set<string>();
    for (const r of rowData) {
      if (r.WantedBy && r.WantedBy.trim().length > 0) set.add(r.WantedBy);
    }
    const values: Record<string, string> = { "": "All (everyone)" };
    Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .forEach((v) => {
        values[v] = v;
      });
    return values;
  }, [rowData]);

  const onCellEdited = async (cell: any) => {
    const field: keyof WishRow = cell.getColumn().getField();
    if (field !== "ClaimedBy") return;

    const row: WishRow = cell.getRow().getData();
    const newValue = cell.getValue();
    const oldValue = cell.getOldValue();

    if (newValue === oldValue) return;

    try {
      await updateDoc(doc(db, "Wishes", row.id), {
        ClaimedBy: String(newValue ?? ""),
      });
    } catch (err) {
      console.error("Failed to update Firestore:", err);
    }
  };

  const columns: ColumnDefinition[] = useMemo(
    () => [
      {
        title: "Wanted By",
        field: "WantedBy",

        // 1) Helper caption in the header to signal filtering
        headerFormatter: () =>
          `
            <div style="display:flex; flex-direction:column; line-height:1.15">
              <span style="font-weight:600;">Wanted By</span>
              <small style="color:#6b7280;">Filter who wants an item</small>
            </div>
          `,

        // 2) The actual filter box (select dropdown) under the header
        headerFilter: "select",
        headerFilterParams: {
          values: wantedByFilterValues, // includes "All (everyone)" as empty value
          clearable: true,              // shows a clear control for the filter
        },
        // Optional: treat empty selection as show-all
        headerFilterFunc: (headerValue: string, rowValue: string) => {
          if (!headerValue) return true; // "All" -> no filtering
          return rowValue === headerValue;
        },
        sorter: "string",
      },
      { title: "Name", field: "Name", headerFilter: "input", sorter: "string" },
      { title: "Note", field: "Note", headerFilter: "input", sorter: "string" },
      {
        title: "Link",
        field: "Link",
        sorter: "string",
        formatter: "link",
        formatterParams: {
          labelField: "Link",
          urlField: "Link",
          target: "_blank",
        },
      },
      {
        title: "Claimed By",
        field: "ClaimedBy",
        headerFilter: "input",
        editor: "input",
        sorter: "string",
      },
    ],
    [wantedByFilterValues]
  );

  const options = {
    layout: "fitColumns",
    reactiveData: true,
  };

  return (
    <div style={{ width: "100%", height: "50vh" }}>
      <ReactTabulator
        data={rowData}
        columns={columns}
        options={options}
        events={{ cellEdited: onCellEdited }}
        className="react-tabulator"
      />
    </div>
  );
};

export default OtherListsComponent;
