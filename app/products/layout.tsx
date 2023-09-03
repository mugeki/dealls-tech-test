import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products",
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
