"use client";


import { BsFillTrash3Fill, BsPencilSquare } from "react-icons/bs";
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { db } from "../services/FirebaseService";
import { doc, getDoc, deleteDoc, getDocs, addDoc, updateDoc, query, collection, where, DocumentData } from "firebase/firestore";
import LinkRenderer from "./LinkRenderer";


ModuleRegistry.registerModules([AllCommunityModule]);

type WishRow = {
  id: string;
  Name: string;
  Note: string;
  Link: string;
};


  const handleCellUpdate = async (params: DocumentData) => {
    const updatedRow = params.data as WishRow;
    try {
      await updateDoc(doc(db, "Wishes", updatedRow.id), {
        Name: updatedRow.Name,
        Note: updatedRow.Note,
        Link: updatedRow.Link,
      });
    } catch (err) {
      console.error("Failed to update Firestore:", err);
    }
  };


const GridComponent = () => {
  const [rowData, setRowData] = useState<WishRow[]>([]);


const handleDelete = async (id: string) => {
  try {
    await deleteDoc(doc(db, "Wishes", id)); // Remove from Firestore
    console.log(`Deleted row with ID: ${id}`);
  } catch (err) {
    console.error("Failed to delete:", err);
  }
  await loadData(); // refresh once after creating the doc
};


  const [columnDefs, setColumnDefs] = useState<object[]>([
    { field: "Name", editable: true },
    { field: "Note", editable: true },
    { 
      field: "Link", 
      editable: true,
      cellRenderer: LinkRenderer
    },
    {
      headerName: "Actions",
      cellRenderer: (params: DocumentData) => {
        return (
          <button
            onClick={() => handleDelete(params.data.id)}
            style={{
              color: "white",
              background: "red",
              border: "none",
              padding: "6px",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
          <BsFillTrash3Fill />
          </button>
        );
      },
    }


  ]);

  async function loadData() {
    const q = query(collection(db, "Wishes"));
    const snapshot = await getDocs(q);
    const rows: WishRow[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      Name: doc.data().Name ?? "",
      Note: doc.data().Note ?? "",
      Link: doc.data().Link ?? "",
    }));
    setRowData(rows);
  }

  useEffect(() => {
    void loadData();
  }, []);


  const handleCreate = async () => {
    await addDoc(collection(db, "Wishes"), { Name: "", Note: "", Link: "" });
    await loadData(); // refresh once after creating the doc
  };


  return (
    <div style={{ width: "100%", height: "50vh" }}>
            <button
            onClick={() => handleCreate()}
            style={{
              color: "white",
              background: "Green",
              border: "none",
              padding: "6px",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
          <BsPencilSquare />
          </button>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} onCellValueChanged={handleCellUpdate}/>

    </div>
  );
};

export default GridComponent;