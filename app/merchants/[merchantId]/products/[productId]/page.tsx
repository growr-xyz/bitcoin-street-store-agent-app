"use client";

import PageWrapper from "@/components/PageWrapper";
import Header from "@/components/Header";
import { useProductById } from "@/lib/services";
import EditProduct from "../EditProduct";

interface ProductDetailsPageProps {
  params: {
    merchantId: string;
    productId: string;
  };
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ params }) => {
  const { data: product } = useProductById({
    merchantId: params.merchantId,
    productId: params.productId,
  });

  return (
    <PageWrapper>
      <Header
        title={product ? `Edit ${product.name}` : "Edit product"}
        backLink={true}
        backLinkHref="/"
      />
      <EditProduct
        merchantId={params.merchantId}
        productId={params.productId}
      />
    </PageWrapper>
  );
};

export default ProductDetailsPage;
