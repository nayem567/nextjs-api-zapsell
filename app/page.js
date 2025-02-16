"use client";
import Cars from "./cars/page";
import { Suspense } from "react";


export default function Home() {
  return (
    <main>
      <Suspense>
        <Cars />
      </Suspense>
    </main>
  );
}
