import ProductListPage from "@/components/pages/website/product/list";
import { Suspense } from "react";

const ProductPage = () => {
  return (
    <Suspense>
      <ProductListPage />
    </Suspense>
  );
};

export default ProductPage;
