"use client";
import { redirect } from "next/navigation";
import * as React from "react";

export default function Home() {
  React.useEffect(() => {
    redirect("/products");
  }, []);

  return null;
}
