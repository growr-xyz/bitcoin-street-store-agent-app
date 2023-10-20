"use client";
import PageWrapper from "@/components/PageWrapper";
import Header from "@/components/Header";
import MerchantDetails from "./MerchantDetails";
import { useMerchantById } from "@/lib/services";

interface MerchantDetailsPageProps {
  params: {
    merchantId: string;
  };
}

const MerchantDetailsPage: React.FC<MerchantDetailsPageProps> = ({
  params,
}) => {
  const { data: merchant } = useMerchantById(params.merchantId);

  return (
    <PageWrapper>
      <Header
        title={merchant ? `${merchant.username} details` : "Merchant details"}
        backLink={true}
        backLinkHref="/"
      />
      <MerchantDetails merchantId={params.merchantId} />
    </PageWrapper>
  );
};

export default MerchantDetailsPage;
