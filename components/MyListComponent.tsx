
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ReactTabulator, ColumnDefinition } from "react-tabulator";
import "react-tabulator/lib/styles.css"; // react-tabulator helpers
import "tabulator-tables/dist/css/tabulator.min.css"; // core Tabulator styles

import { BsFillTrash3Fill, BsPencilSquare } from "react-icons/bs";

import { db } from "../services/FirebaseService";
import {
  doc,
  deleteDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  collection,
} from "firebase/firestore";

type WishRow = {
  id: string;
  Name: string;
  Note: string;
  Link: string;
};

const MyListComponent: React.FC = () => {
  const [rowData, setRowData] = useState<WishRow[]>([]);

  async function loadData() {
    const q = query(collection(db, "Wishes"));
    const snapshot = await getDocs(q);
    const rows: WishRow[] = snapshot.docs.map((d) => ({
      id: d.id,
      Name: (d.data().Name as string) ?? "",
      Note: (d.data().Note as string) ?? "",
      Link: (d.data().Link as string) ?? "",
    }));
    setRowData(rows);
  }

  useEffect(() => {
    void loadData();
  }, []);

  const handleCreate = async () => {
    await addDoc(collection(db, "Wishes"), {
      Name: "",
      Note: "",
      Link: "",
      WantedBy: "Jared",
      ClaimedBy: "",
    });
    await loadData(); // refresh after creating
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Wishes", id));
      // Optimistic local update
      setRowData((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
      // Fallback to full refresh if needed
      await loadData();
    }
  };

  // Inline edit handler for Tabulator
  const onCellEdited = async (cell: any) => {
    const field = cell.getColumn().getField() as keyof WishRow;
    if (!["Name", "Note", "Link"].includes(field)) return;

    const row: WishRow = cell.getRow().getData();
    const newValue = cell.getValue();
    const oldValue = cell.getOldValue();

    if (newValue === oldValue) return;

    try {
      await updateDoc(doc(db, "Wishes", row.id), {
        [field]: String(newValue ?? ""),
      });
    } catch (err) {
      console.error("Failed to update Firestore:", err);
    }
  };

  // Column definitions for ReactTabulator
  const columns: ColumnDefinition[] = useMemo(
    () => [
      { title: "Name", field: "Name", editor: "input", headerFilter: "input" },
      { title: "Note", field: "Note", editor: "input", headerFilter: "input" },
      {
        title: "Link",
        field: "Link",
        editor: "input",
        headerFilter: "input",
        sorter: "string",
        formatter: 'link',
    formatterParams: {
      labelField: "Link",        // text shown in the anchor
      urlField: "Link",          // URL the anchor points to
      target: "_blank",          // open in new tab
      // Optional: customize classes or aria-label
      // className: "my-link",
    },

      },
      {
        title: "Actions",
        field: "actions",
        hozAlign: "center",
        headerSort: false,
        formatter: () =>
          `
          <button
            class="tabulator-delete-btn"
            title="Delete"
            style="
              color:white;
              background:red;
              border:none;
              padding:6px;
              border-radius:4px;
              cursor:pointer;
              display:flex;
              align-items:center;
              justify-content:center;
              gap:4px;
            "
          >
            🗑
          </button>
        `,
        cellClick: (_e, cell) => {
          const row = cell.getRow().getData() as WishRow;
          void handleDelete(row.id);
        },
      },
    ],
    []
  );

  const options = {
    layout: "fitColumns",
    reactiveData: true,
  };

  return (
    <div style={{ width: "100%", height: "50vh" }}>
      <div style={{ marginBottom: 8 }}>
        <button
          onClick={handleCreate}
          style={{
            color: "white",
            background: "green",
            border: "none",
            padding: "6px 10px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
          aria-label="Create new wish"
        >
          <BsPencilSquare />
          New Item
        </button>
      </div>

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

export default MyListComponent;
