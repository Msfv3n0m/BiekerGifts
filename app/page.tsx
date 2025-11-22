import { db } from "../services/FirebaseService";
import { doc, getDoc, getDocs, query, collection, where } from "firebase/firestore";
import { ActiveTable } from 'active-table-react';

// export default async function Home() {
// //   // const q = query(collection(db, "cities"));
// //   // const querySnapshot = await getDocs(q);
// //   // querySnapshot.forEach((doc) => {
// //   //   console.log(`${doc.id} => ${doc.data().name}`);
// //   // });
// }

// export default function Home() {
//   const data = [
//     ['Planet', 'Diameter'],
//     ['Earth', '12756'],
//   ];

//   return <ActiveTable data={data} />;
// }

import EditableTableAT from '../components/EditableTableAT';

export default async function Page() {
  const q = query(collection(db, "cities"));
  const querySnapshot = await getDocs(q);
  var arr: any[] = [['doc id', 'city']];
  querySnapshot.forEach((doc) => {
    arr.push([doc.id, doc.data().name])
    console.log(arr);
    // console.log(`${doc.id} => ${doc.data().name}`);
  });
  const initialData = [
    ['Planet', 'Diameter'],
    ['Earth', 12756],
    ['Mars', 6779],
  ];
  console.log(initialData);
  return <EditableTableAT initialData={arr} />;
}
