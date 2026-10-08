import React from "react";
import "@/app/(frontend)/globals.css"; // Ensure global styles are loaded in the builder

export const metadata = {
  title: "Visual Editor",
  description: "Drag and drop visual page builder",
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
