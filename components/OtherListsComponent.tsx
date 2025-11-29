
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ReactTabulator, ColumnDefinition } from "react-tabulator";
import "react-tabulator/lib/styles.css"; // react-tabulator helpers
import "tabulator-tables/dist/css/tabulator.min.css"; // core Tabulator styles

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

  // ---- Fetch Firestore data ----
  useEffect(() => {
    const fetchData = async () => {
      // "!=" requires orderBy on the same field
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

  // Helper to guard getDocs with a readable error
  async function getdocsSafe(q: any) {
    try {
      return await getDocs(q);
    } catch (e) {
      console.error("Failed to query Firestore. If you use '!=' make sure you have a composite index and orderBy the same field.", e);
      throw e;
    }
  }

  // Build a map of unique WantedBy values for the select filter
  const wantedByFilterValues = useMemo(() => {
    const set = new Set<string>();
    for (const r of rowData) {
      if (r.WantedBy && r.WantedBy.trim().length > 0) set.add(r.WantedBy);
    }
    // Tabulator expects either an array or an object map.
    // Using an object map preserves labels and values cleanly.
    const values: Record<string, string> = {};
    Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .forEach((v) => {
        values[v] = v;
      });
    // Optionally add an empty option that shows "All"
    // values[""] = "All";
    return values;
  }, [rowData]);

  // ---- Inline edit handler (only persist ClaimedBy) ----
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

  // ---- Column definitions ----
  const columns: ColumnDefinition[] = useMemo(
    () => [
      // Filter by unique values using select header filter (computed from rowData)
      {
        title: "Wanted By",
        field: "WantedBy",
        headerFilter: "select",
        headerFilterParams: {
          // Using computed unique values rather than `true`
          values: wantedByFilterValues,
          // Optionally include "All" prompt
          // clearable: true,
        },
        sorter: "string",
      },
      { title: "Name", field: "Name", headerFilter: "input", sorter: "string" },
      { title: "Note", field: "Note", headerFilter: "input", sorter: "string" },
      {
        title: "Link",
        field: "Link",
        sorter: "string",
        formatter: (cell) => {
          const url = String(cell.getValue() ?? "").trim();
          if (!url) {
            return "<span style='color:#888'>(none)</span>";
          }
          // Basic sanitization: allow only http/https to prevent javascript: URLs
          const safe =
            url.startsWith("http://") || url.startsWith("https://")
              ? url
              : `https://${url}`;
          const text = escapeHtml(url);
          return `${safe}${text}</a>`;
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

  // ---- Table options ----
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
        events={{
          cellEdited: onCellEdited,
        }}
        className="react-tabulator"
      />
    </div>
  );
};

// Utility to escape text for display in HTML
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default OtherListsComponent;
