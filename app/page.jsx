// "use client";
// import { db } from "../services/FirebaseService";
// import { doc, getDoc, getDocs, query, collection, where } from "firebase/firestore";
// import Spreadsheet from "react-spreadsheet";

// function dataChanged(){
//   console.log("Data changed");
// }

// function addRow(arr: Array<Object>){
//     arr.push([{value: ''}, {value: ''}])
// }

// function deleteRow(arr: Array<Object>){
//     arr.pop()
// }

// export default function Home() {
//   const q = query(collection(db, "cities"));
//   const querySnapshot = getDocs(q);
//   const arr = [[{value: "doc id"}, {value: "name"}]];
//   // querySnapshot.forEach((doc) => {
//   // querySnapshot.then((input) =>
//   //   input.forEach((doc) => {
//   //   arr.push([{value: doc.id}, {value: doc.data().name}])
//   //   console.log(`${doc.id} => ${doc.data().name}`);
//   // }));
//   return (
//     <Spreadsheet 
//       data={arr} 
//       onChange={dataChanged}
//     />
//   );
// }

// app/page.tsx
import GridComponent from "../components/GridComponent";

export default function Home() {
  return (
    <div >
      <GridComponent />
    </div>
  );
}
