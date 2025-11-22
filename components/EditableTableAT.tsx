'use client';

import { ActiveTable } from 'active-table-react';
import { useState } from 'react';

type Cell = string | number;

export default function EditableTableAT({ initialData }: { initialData: Cell[][] }) {
  const [data, setData] = useState<Cell[][]>(initialData);

  return (
    <ActiveTable
      data={data}
      onDataChange={(newData) => {
        setData(newData);
      }}
      columnsSettings={{
        1: { type: 'number' },
      }}
    />
  );
}
