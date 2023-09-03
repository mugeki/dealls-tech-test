import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { cartId: string } }
) {
  const { cartId } = params;
  const searchParams = new URL(request.url).searchParams;

  const size = +(searchParams.get("size") || 10);
  const currPage = +(searchParams.get("page") || 1);

  const resCart = await fetch(`https://dummyjson.com/carts/${cartId}`);
  const dataCart = await resCart.json();
  const totalPage = Math.ceil(dataCart.products.length / size);

  // Function to fetch product details
  async function fetchProductDetails(productId: number) {
    const resProduct = await fetch(
      `https://dummyjson.com/products/${productId}`
    );
    return await resProduct.json();
  }

  // Fetch details for all products in the cart
  const productDetailsPromises = dataCart.products.map((pr) =>
    fetchProductDetails(pr.id)
  );
  const productDetails = await Promise.all(productDetailsPromises);

  dataCart.products.forEach((pr, i: number) => {
    pr.detail = { ...pr, ...productDetails[i] };
  });

  // Split products data into chunks (pages) based on size
  const productChunks = [];
  for (let i = 0; i < dataCart.products.length; i += size) {
    const chunk = dataCart.products.slice(i, i + size);
    productChunks.push(chunk);
  }

  const userId = dataCart.userId;
  const resUser = await fetch(`https://dummyjson.com/users/${userId}`);
  const dataUser = await resUser.json();

  const transformed = {
    ...dataCart,
    products: productChunks[currPage - 1],
    createdAt: "2023-09-01T14:48:00.000Z", // Hardcoded, not provided in API
    userName: [dataUser.firstName, dataUser.lastName].join(" "),
    totalPage,
  };

  return NextResponse.json({ ...transformed });
}
