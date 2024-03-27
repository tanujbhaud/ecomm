"use client";
import { useState } from "react";
import Navbar from "./navbar";
import Cart from "./cart";
import Footer from "./footer";
export default function Fixedset({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Navbar ocart={open} setocart={setOpen} />
      <Cart open={open} setOpen={setOpen} />
      {children}
      <Footer />
    </>
  );
}
