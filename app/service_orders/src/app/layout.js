import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Testes com Websockets",
  description: "Websockets + Nextjs + Django + Authentication + Tickets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-Br">
      <body className={inter.className}>{children}
      </body>
    </html>
  );
}
