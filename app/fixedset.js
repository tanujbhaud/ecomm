"use client";
import { useState } from "react";
import Navbar from "./navbar";
import Cart from "./cart";
import Footer from "./footer";
import { store } from "./redux/store";
import { Provider } from "react-redux";
export default function Fixedset({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Provider store={store}>
        <Navbar ocart={open} setocart={setOpen} />
        <Cart open={open} setOpen={setOpen} />
        {children}
        <Footer />
      </Provider>
    </>
  );
}
