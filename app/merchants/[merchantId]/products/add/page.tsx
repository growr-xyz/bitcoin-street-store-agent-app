"use client";
import PageWrapper from "@/components/PageWrapper";
import Header from "@/components/Header";
import EditProduct from "../EditProduct";
// import { useMerchantById } from "@/lib/services";

interface AddProductPageProps {
  params: {
    merchantId: string;
  };
}

const AddProductPage: React.FC<AddProductPageProps> = ({ params }) => {
  return (
    <PageWrapper>
      <Header
        title="Add a new product"
        backLink={true}
        backLinkHref={`/merchants/${params.merchantId}`}
      />
      <EditProduct merchantId={params.merchantId} />
    </PageWrapper>
  );
};

export default AddProductPage;
