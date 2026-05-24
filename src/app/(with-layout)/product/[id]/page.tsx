import SingleProductPage from "@/components/pages/website/product/single";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const productId = parseInt(id, 10);
  return <SingleProductPage productId={productId} />;
};

export default ProductPage;
