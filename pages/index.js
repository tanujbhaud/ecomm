// pages/index.js
import { useUser } from "@auth0/nextjs-auth0/client";
import Header from "@/components/header";
export default function Home() {
  const { user, error, isLoading } = useUser();

  return (
    <>
      <Header isLoading={isLoading} error={error} user={user} />
      why is header not
    </>
  );
}
