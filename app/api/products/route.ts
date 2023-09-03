import { NextResponse } from "next/server";

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

const maxPrice = 2000;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const size = +(params.get("size") || 10);
  const currPage = +(params.get("page") || 1);
  const productName = params.get("search");
  const categoryName = params.get("category");
  const brandName = params.get("brand");
  const priceStart = +(params.get("price-start") || 0);
  const priceEnd = +(params.get("price-end") || maxPrice);

  const res = await fetch(`https://dummyjson.com/products?limit=100`);
  const data = await res.json();
  const products = [...data.products];

  // Map data for Chart
  const stocks: number[] = [];
  const labels: string[] = products.map((pr) => {
    stocks.push(pr.stock);
    return pr.title;
  });

  // Get brand names to be used as items in select dropdown UI
  const brands: string[] = Array.from(new Set(products.map((pr) => pr.brand)));

  // Filter data based on params
  let filteredProducts = [...products];

  if (productName) {
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(productName.toLowerCase())
    );
  }
  if (categoryName) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category.toLowerCase() === categoryName.toLowerCase()
    );
  }
  if (brandName) {
    filteredProducts = filteredProducts.filter(
      (product) => product.brand.toLowerCase() === brandName.toLowerCase()
    );
  }
  if (!isNaN(priceStart)) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= priceStart
    );
  }
  if (!isNaN(priceEnd) && priceEnd > 0) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= priceEnd
    );
  }

  const totalPage = Math.ceil(filteredProducts.length / size);

  // Split data into chunks (pages) based on size
  const chunks = [];
  for (let i = 0; i < filteredProducts.length; i += size) {
    const chunk = filteredProducts.slice(i, i + size);
    chunks.push(chunk);
  }

  const transformed = {
    brands: brands,
    products: chunks[currPage - 1] || [],
    productsChart: {
      labels: labels,
      data: stocks,
    },
    totalPage,
  };

  return NextResponse.json({ ...transformed });
}
