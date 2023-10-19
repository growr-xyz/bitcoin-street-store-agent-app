"use client";

import PageWrapper from "@/components/PageWrapper";
import Header from "@/components/Header";
import { useMerchantById } from "@/lib/services";
import EditMerchant from "../../EditMerchant";

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
        title={merchant ? `Edit ${merchant.username}` : "Edit merchant"}
        backLink={true}
        backLinkHref={`/merchants/${merchant?._id}`}
      />
      <EditMerchant merchantId={params.merchantId} />
    </PageWrapper>
  );
};

export default MerchantDetailsPage;
