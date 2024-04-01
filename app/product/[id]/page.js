"use client";
import { useEffect, useState } from "react";
import Bigview2 from "../../bigview2";
import { query, onSnapshot, collection, getDoc, doc } from "firebase/firestore";
import { db } from "@/app/config/firebase";
export default function Product({ params }) {
  const [product, setproduct] = useState({});
  const getProduct = async () => {
    try {
      const ptemp = await getDoc(doc(db, "products", params.id));
      const p = ptemp.data();
      setproduct({ ...p });
      console.log(p);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getProduct();
  }, []);
  return (
    <>
      <div>
        <Bigview2 product={product} />
      </div>
    </>
  );
}
