"use client";

import { Render, type Data } from "@puckeditor/core";
import { builderConfig } from "@/lib/builder/config";

export function PuckRenderer({ data }: { data: Data }) {
  return <Render config={builderConfig} data={data} />;
}
