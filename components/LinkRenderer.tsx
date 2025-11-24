import React from 'react';

import type { CustomCellRendererProps } from 'ag-grid-react';

export default (params: CustomCellRendererProps) => {
  params.value ? (
    <a href={params.value} target="_blank" rel="noopener noreferrer">
      {(() => {
        try {
          return new URL(params.value).hostname;
        } catch {
          return params.value; // fallback if URL is invalid
        }
      })()}
    </a>
  ) : null

};