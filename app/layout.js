import "./globals.css";
import Providers from "./Providers";

export const metadata = {
  title: "TaskApp",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Providers>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
