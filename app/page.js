import Hero from "./hero";
import Trending from "./trending";
import Features from "./features";
import Sidebar from "./sidebar";
import Catpreview from "./catpreview";
import Bigview from "./bigview";

import Bigview2 from "./bigview2";
import Modal from "./modal";
export default function Home() {
  return (
    <>
      <Hero />
      <Trending />
      {/* <Features /> */}
      {/* <Sidebar /> */}
      <Catpreview />
      <Bigview />
      <Bigview2 />
      <Modal />
    </>
  );
}
