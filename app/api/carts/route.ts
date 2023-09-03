import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const size = +(params.get("size") || 10);
  const currPage = +(params.get("page") || 1);

  const res = await fetch(
    `https://dummyjson.com/carts?limit=${size}&skip=${(currPage - 1) * 10}`
  );
  const data = await res.json();

  const totalPage = Math.ceil(data.total / size);

  const transformed = {
    carts: data.carts,
    totalPage,
  };

  return NextResponse.json({ ...transformed });
}
