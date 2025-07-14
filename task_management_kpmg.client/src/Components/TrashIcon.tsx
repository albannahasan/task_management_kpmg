import React from "react";

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    width={12}
    height={12}
    stroke="currentColor"
    strokeWidth={1.5}
    {...props}
  >
    <rect x="6" y="8" width="8" height="8" rx="1" fill="none" stroke="currentColor"/>
    <path d="M8 8V6a2 2 0 0 1 4 0v2" stroke="currentColor" strokeLinecap="round"/>
    <path d="M4 8h12" stroke="currentColor" strokeLinecap="round"/>
    <path d="M9 11v3" stroke="currentColor" strokeLinecap="round"/>
    <path d="M11 11v3" stroke="currentColor" strokeLinecap="round"/>
  </svg>
);

export default TrashIcon; 