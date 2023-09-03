import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carts",
  description: "Manage your carts",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
