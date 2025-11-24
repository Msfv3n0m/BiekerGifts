// components/GridComponent.tsx
"use client";

import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { db } from "../services/FirebaseService";
import { doc, getDoc, getDocs, query, collection, where } from "firebase/firestore";

ModuleRegistry.registerModules([AllCommunityModule]);

const GridComponent = () => {
  const q = query(collection(db, "cities"));
  const querySnapshot = getDocs(q);
  const arr = [[{value: "doc id"}, {value: "name"}]];
  querySnapshot.then((input) => input.forEach((doc) => {
  querySnapshot.then((input) =>
    input.forEach((doc) => {
    arr.push([{value: doc.id}, {value: doc.data().name}])
    console.log(`${doc.id} => ${doc.data().name}`);
  }))}));
  const [rowData, setRowData] = useState<any[]>([]);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", editable: true },
    { field: "age" },
    { field: "date" },
    { field: "country" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json") // Fetch data from server
      .then((result) => result.json()) // Convert to JSON
      .then((rowData) => setRowData(rowData)); // Update state of `rowData`
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
};

export default GridComponent;
