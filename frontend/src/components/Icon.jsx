import React from "react";

const icons = {
  arrowLeft: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.75 6.75L8.25 11.25 12.75 15.75" />
      <path d="M9 11.25h7.5" />
    </svg>
  ),
  logout: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 7.5V6.75A1.5 1.5 0 0013.5 5.25h-6A1.5 1.5 0 006 6.75v10.5A1.5 1.5 0 007.5 18.75h6a1.5 1.5 0 001.5-1.5V16.5" />
      <path d="M12.75 12H20.25" />
      <path d="M18 9.75L20.25 12 18 14.25" />
    </svg>
  ),
  home: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 10.5l7.5-6 7.5 6" />
      <path d="M7.5 9.75v7.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5v-7.5" />
    </svg>
  ),
  users: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.25 14.25a3.75 3.75 0 117.5 0" />
      <path d="M5.25 18a3 3 0 013-3h7.5a3 3 0 013 3" />
      <path d="M9.75 7.5a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z" fill="currentColor" fillOpacity="0.12" />
    </svg>
  ),
  table: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4.5" y="8.25" width="15" height="4.5" rx="1.5" />
      <path d="M7.5 12.75V18" />
      <path d="M16.5 12.75V18" />
      <path d="M9.75 8.25v-2a1.5 1.5 0 011.5-1.5h1.5a1.5 1.5 0 011.5 1.5v2" />
    </svg>
  ),
  menu: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5h15" />
      <path d="M6.75 16.5L8.25 6.75h7.5l1.5 9.75" />
      <path d="M6.75 11.25h10.5" />
    </svg>
  ),
  orders: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.5 4.5h9a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 18V6a1.5 1.5 0 011.5-1.5z" />
      <path d="M9 7.5h6" />
      <path d="M9 10.5h6" />
      <path d="M9 13.5h3.75" />
    </svg>
  ),
  cover: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 6.75a4.5 4.5 0 00-4.5 4.5h9a4.5 4.5 0 00-4.5-4.5z" />
      <path d="M5.25 11.25h13.5" />
      <path d="M7.5 11.25v5.25h9V11.25" />
    </svg>
  ),
  analytics: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.25 18.75V12.75" />
      <path d="M10.5 18.75V9.75" />
      <path d="M15.75 18.75V6.75" />
      <path d="M4.5 18.75h15" />
    </svg>
  )
};

export default function Icon({ name, size = 20, className }) {
  const icon = icons[name];

  if (!icon) {
    return null;
  }

  return React.cloneElement(icon, {
    className,
    width: size,
    height: size,
    focusable: "false",
    "aria-hidden": true
  });
}
