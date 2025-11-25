
import React from "react";
import type { CustomCellRendererProps } from "ag-grid-react";

export default function LinkRenderer(params: CustomCellRendererProps) {
  if (!params.value) return null;

  let displayText: string;
  try {
    displayText = new URL(params.value).hostname;
  } catch {
    displayText = params.value; // fallback if URL is invalid
  }

  return (
    <a href={params.value} target="_blank" rel="noopener noreferrer">
      {displayText}
    </a>
  );
}
