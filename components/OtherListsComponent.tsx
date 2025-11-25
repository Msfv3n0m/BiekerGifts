"use client";


import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { db } from "../services/FirebaseService";
import { doc, getDocs, updateDoc, query, collection, where, DocumentData } from "firebase/firestore";
import LinkRenderer from "./LinkRenderer";


ModuleRegistry.registerModules([AllCommunityModule]);

type WishRow = {
  id: string;
  Name: string;
  Note: string;
  Link: string;
  WantedBy: string;
  ClaimedBy: string;
};


  const handleCellUpdate = async (params: DocumentData) => {
    const updatedRow = params.data as WishRow;
    try {
      await updateDoc(doc(db, "Wishes", updatedRow.id), {
        WantedBy: updatedRow.WantedBy,
      });
    } catch (err) {
      console.error("Failed to update Firestore:", err);
    }
  };


const OtherListsComponent = () => {
  const [rowData, setRowData] = useState<WishRow[]>([]);


  const [columnDefs, setColumnDefs] = useState<object[]>([
    { field: "WantedBy" },
    { field: "Name" },
    { field: "Note" },
    { 
      field: "Link", 
      cellRenderer: LinkRenderer
    },
    {
      field: "ClaimedBy",
      editable: true
    }
  ]);


useEffect(() => {
  const fetchData = async () => {
    const q = query(collection(db, "Wishes"), where("WantedBy", "!=", "Jared"));
    const snapshot = await getDocs(q);
    const rows = snapshot.docs.map(doc => ({
      id: doc.id,
      ClaimedBy: doc.data().CreatedBy ?? "",
      Name: doc.data().Name ?? "",
      Note: doc.data().Note ?? "",
      Link: doc.data().Link ?? "",
      WantedBy: doc.data().WantedBy ?? "",
    }));
    setRowData(rows);
  };
  void fetchData();
}, []);


  return (
        <div style={{ width: "100%", height: "50vh" }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} onCellValueChanged={handleCellUpdate}/>
    </div>
  );
};

export default OtherListsComponent;