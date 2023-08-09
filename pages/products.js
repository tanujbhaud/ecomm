import { useUser } from "@auth0/nextjs-auth0/client";
import Header from "@/components/header";
import { useEffect } from "react";
import axios from "axios";
export default function Products() {
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    axios
      .post("https://awstest.sperentes.com/get-product-list", {
        api_key: process.env.api_key,
      })
      .then(function (response) {
        console.log("this is the res", response.data);
      });
  }, []);
  return (
    <>
      <Header isLoading={isLoading} error={error} user={user} />
      show products
    </>
  );
}
