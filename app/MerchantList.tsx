"use client";

import Loader from "@/components/Loader";
import { useMerchants } from "@/lib/services";
import Card from "@/components/Card";
import Container from "@/components/Container";
import Button from "@/components/Button";

const MerchantList: React.FC = () => {
  const { data: merchants, isLoading } = useMerchants();

  return (
    <Container fullHeight className="p-4 sm:p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold py-4">Your merchants</h2>
      {isLoading ? (
        <Container className="items-center">
          <Loader />
        </Container>
      ) : merchants?.rows.length === 0 ? (
        <div>You still do not have any merchants.</div>
      ) : (
        <div className="flex flex-col space-y-4 w-full">
          {merchants?.rows.map((merchant) => (
            <Card
              key={merchant._id}
              title={merchant.username}
              href={`/merchants/${merchant._id}`}
              pillLabel={merchant.status}
              pillColor={
                merchant.status === "Invited"
                  ? "bg-stone-500"
                  : merchant.status === "Confirmed"
                  ? "bg-yellow-500"
                  : merchant.status === "Active"
                  ? "bg-green-500"
                  : "bg-stone-300"
              }
              subtitle={
                <>
                  {merchant.phoneNumber} &bull; {merchant.walletAddress}
                </>
              }
            />
          ))}
        </div>
      )}
      <Container alignBottom className="items-center">
        <Button href="/merchants/invite">Invite a merchant</Button>
      </Container>
    </Container>
  );
};

export default MerchantList;
