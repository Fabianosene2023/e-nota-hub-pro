
import React from "react";
import { CteTable } from "./CteTable";

export default function CtePage() {
  return (
    <div className="max-w-4xl mx-auto mt-6 bg-background rounded shadow">
      <h1 className="text-2xl font-bold p-4">Gestão de CT-e</h1>
      <CteTable />
    </div>
  );
}
