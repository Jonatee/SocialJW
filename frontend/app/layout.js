import "./globals.css";
import Providers from "@/providers";
import { BRAND_NAME, LINKED_LOGO_URL } from "@/lib/brand";

export const metadata = {
  title: BRAND_NAME,
  description: "A calm, faith-centered discussion community for respectful encouragement and spiritual conversation.",
  icons: {
    icon: LINKED_LOGO_URL,
    shortcut: LINKED_LOGO_URL,
    apple: LINKED_LOGO_URL
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
