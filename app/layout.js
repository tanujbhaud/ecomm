import "./globals.css";
import { Toaster } from "react-hot-toast";
export const metadata = {
  title: "E-commerce",
  description: "",
};
import Fixedset from "./fixedset";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Fixedset>
          <Toaster />
          {children}
        </Fixedset>
      </body>
    </html>
  );
}
