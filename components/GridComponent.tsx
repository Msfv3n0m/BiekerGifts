// components/GridComponent.tsx
"use client";

import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { db } from "../services/FirebaseService";
import { doc, getDoc, getDocs, query, collection, where } from "firebase/firestore";

ModuleRegistry.registerModules([AllCommunityModule]);


type CityRow = {
  id: string;
  city: string;
};

const GridComponent = () => {
  const [rowData, setRowData] = useState<any[]>([]);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "id", editable: true },
    { field: "city", editable: true },
  ]);

  useEffect(() => {
    async function loadData() {
      const q = query(collection(db, "cities"));
      const snapshot = await getDocs(q);
      const rows: CityRow[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        city: doc.data().name ?? "",
      }));
      setRowData(rows);
    }
    loadData();
  }, []);


  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
};

export default GridComponent;
