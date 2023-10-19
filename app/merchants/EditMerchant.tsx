"use client";

import { useContext, useEffect } from "react";
import { useFormik } from "formik";
import { useEditMerchant, useMerchantById } from "@/lib/services";
import { MerchantSchema } from "@/types/schemas";
import { toFormikValidationSchema } from "@/lib/zodFormikValidation";
import FormField from "@/components/FormField";
import { ToastContext } from "@/context/toast-context";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { UserContext } from "@/context/user-context";
import { Merchant, Merchants } from "@/types";
import Loader from "@/components/Loader";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { isAxiosError } from "axios";

interface EditMerchantProps {
  merchantId?: string;
}

const EditMerchant: React.FC<EditMerchantProps> = ({ merchantId }) => {
  const { createToast } = useContext(ToastContext);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { keys } = useContext(UserContext);

  const { data: merchant, isLoading: isMerchantLoading } = useMerchantById(
    merchantId || ""
  );

  let initialValues: Merchant = {
    _id: "",
    phoneNumber: "",
    username: "",
    walletAddress: "",
    name: "",
    about: "",
    picture: "",
    banner: "",
    website: "",
    status: "Invited",
    createdBy: keys.publicKey,
  };

  const editMutation = useEditMerchant();

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      editMutation.mutate(values, {
        onSuccess: (updatedMerchant) => {
          if (!values._id) {
            queryClient.setQueryData(
              ["merchants"],
              (oldMerchants: Merchants | undefined) =>
                // Don't update if oldMerchants is undefined
                oldMerchants &&
                oldMerchants.rows && {
                  ...oldMerchants,
                  // TODO: I'm not sure how clever is to update the paging attributes
                  total: oldMerchants.total + 1,
                  totalPages:
                    oldMerchants.total + 1 >
                    oldMerchants.totalPages * oldMerchants.pageSize
                      ? oldMerchants.totalPages + 1
                      : oldMerchants.totalPages,
                  rows: [updatedMerchant, ...oldMerchants.rows],
                }
            );
            createToast({
              message: `Merchant ${formik.values.username} invited successfully`,
              type: "success",
            });
            router.push(`/merchants/`, { scroll: false });
          } else {
            queryClient.setQueryData(
              ["merchants"],
              (oldMerchants: Merchants | undefined) =>
                oldMerchants &&
                oldMerchants.rows && {
                  ...oldMerchants,
                  rows: oldMerchants.rows.map((merchant) =>
                    merchant._id === updatedMerchant._id
                      ? updatedMerchant
                      : merchant
                  ),
                }
            );
            createToast({
              message: `Merchant ${formik.values.username} updated successfully`,
              type: "success",
            });
            router.push(`/merchants/${values._id}`, { scroll: false });
          }
        },
        onError: (e) => {
          console.error("editMutation error", e);
          let errorMessage: string = "";
          if (isAxiosError(e)) errorMessage = e.response?.data.message;
          createToast({
            message:
              `Error ${!values._id ? "inviting" : "updating"} merchant` +
              (errorMessage ? ` (${errorMessage})` : ""),
            type: "error",
          });
        },
      });
    },
    validationSchema: toFormikValidationSchema(MerchantSchema),
  });

  useEffect(() => {
    if (merchant) {
      formik.setValues({ ...initialValues, ...merchant });
    }
  }, [merchant]);

  return merchantId && isMerchantLoading ? (
    <Container className="items-center">
      <Loader />
    </Container>
  ) : (
    formik && (
      <form onSubmit={formik.handleSubmit}>
        <Container
          bottomMargin
          className="p-4 sm:p-6 max-w-xl mx-auto gap-3 items-stretch"
        >
          <FormField
            inputProps={formik.getFieldProps("phoneNumber")}
            meta={formik.getFieldMeta("phoneNumber")}
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
          <FormField
            inputProps={formik.getFieldProps("picture")}
            meta={formik.getFieldMeta("picture")}
            label="Picture URL"
          />
          <FormField
            inputProps={formik.getFieldProps("banner")}
            meta={formik.getFieldMeta("banner")}
            label="Banner URL"
          />
          <FormField
            inputProps={formik.getFieldProps("website")}
            meta={formik.getFieldMeta("website")}
            label="Website URL"
          />

          <Container alignBottom className="items-center">
            <Button type="submit">{merchantId ? "Save" : "Send invite"}</Button>
          </Container>
        </Container>
      </form>
    )
  );
};

export default EditMerchant;
