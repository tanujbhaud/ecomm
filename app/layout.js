import "./globals.css";
export const metadata = {
  title: "E-commerce",
  description: "",
};
import Navbar from "./navbar";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
