import Hero from "./hero";
import Trending from "./trending";
import Features from "./features";
import Sidebar from "./sidebar";
import Catpreview from "./catpreview";
import Bigview from "./bigview";
import Plist from "./plist";
import Bigview2 from "./bigview2";
export default function Home() {
  return (
    <>
      <Hero />
      <Plist />
      {/* <Trending /> */}
      {/* <Features /> */}
      {/* <Sidebar /> */}
      <Catpreview />
    </>
  );
}
