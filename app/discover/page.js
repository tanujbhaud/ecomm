import Sidebar from "../sidebar";
import { Suspense } from "react";
export default function Discover() {
  return (
    <>
      <Suspense>
        <Sidebar />
      </Suspense>
    </>
  );
}
