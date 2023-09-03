import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart Detail",
  description: "Manage a cart",
};

export default function CartDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
