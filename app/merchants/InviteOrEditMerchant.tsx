"use client";

import { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import { useInviteOrEditMerchant, useMerchantById } from "@/lib/services";
import { MerchantSchema } from "@/types/schemas";
import { toFormikValidationSchema } from "@/lib/zodFormikValidation";
import FormField from "@/components/FormField";
import { ToastContext } from "@/context/toast-context";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { UserContext } from "@/context/user-context";
import { Merchant } from "@/types";
import Loader from "@/components/Loader";

interface InviteOrEditMerchantProps {
  merchantId?: string;
}

const InviteOrEditMerchant: React.FC<InviteOrEditMerchantProps> = ({
  merchantId,
}) => {
  const { createToast } = useContext(ToastContext);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { keys } = useContext(UserContext);

  const { data: merchant, isLoading: isMerchantLoading } =
    useMerchantById(merchantId);

  let initialValues: Merchant = {
    mobileNumber: "",
    username: "",
    walletAddress: "",
    name: "",
    about: "",
    status: "Invited",
    createdBy: keys.publicKey,
  };

  const inviteMutation = useInviteOrEditMerchant();

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      inviteMutation.mutate(values, {
        onSuccess: () => {
          createToast({
            message: `Merchant ${formik.values.name} invited successfully`,
            type: "success",
          });
          queryClient.invalidateQueries(["merchants"]);
          router.push("/");
        },
        onError: (e) => {
          console.error("inviteMutation error", e);
          createToast({ message: "Error inviting merchant", type: "error" });
        },
      });
    },
    validationSchema: toFormikValidationSchema(MerchantSchema),
  });

  useEffect(() => {
    if (merchant) {
      formik.setValues(merchant);
    }
  }, [merchant]);

  return merchantId && isMerchantLoading ? (
    <div className="w-full flex justify-center items-center">
      <Loader />
    </div>
  ) : (
    formik && (
      <form onSubmit={formik.handleSubmit}>
        <div className="p-6 max-w-xl mx-auto min-h-[calc(100dvh-3rem)] sm:min-h-[calc(100dvh-6rem)] gap-3 flex flex-col justify-between">
          {/* <h2 className="text-2xl font-bold py-4">Your merchants</h2> */}

          <FormField
            inputProps={formik.getFieldProps("mobileNumber")}
            meta={formik.getFieldMeta("mobileNumber")}
            label="Mobile Number*"
          />
          <FormField
            inputProps={formik.getFieldProps("username")}
            meta={formik.getFieldMeta("username")}
            label="User Name*"
          />
          <FormField
            inputProps={formik.getFieldProps("walletAddress")}
            meta={formik.getFieldMeta("walletAddress")}
            label="Wallet Address*"
          />
          <FormField
            inputProps={formik.getFieldProps("name")}
            meta={formik.getFieldMeta("name")}
            label="Name"
          />
          <FormField
            inputProps={formik.getFieldProps("about")}
            meta={formik.getFieldMeta("about")}
            label="About"
          />

          <div className="mt-auto my-8 flex justify-center items-center">
            <button
              className="rounded px-6 py-2 bg-orange-600 text-white text-lg"
              type="submit"
            >
              {merchantId ? "Save" : "Send invite"}
            </button>
          </div>
        </div>
      </form>
    )
  );
};

export default InviteOrEditMerchant;
