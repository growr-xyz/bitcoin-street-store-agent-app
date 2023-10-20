"use client";

import { useContext, useEffect } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { useEditProduct, useProductById } from "@/lib/services";
import { ProductSchema } from "@/types/schemas";
import { toFormikValidationSchema } from "@/lib/zodFormikValidation";
import FormField from "@/components/FormField";
import { ToastContext } from "@/context/toast-context";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { UserContext } from "@/context/user-context";
import { Product, Products } from "@/types";
import Loader from "@/components/Loader";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { isAxiosError } from "axios";
import { Trash } from "@/icons";

interface EditProductProps {
  merchantId?: string;
  productId?: string;
}

const EditProduct: React.FC<EditProductProps> = ({ merchantId, productId }) => {
  const { createToast } = useContext(ToastContext);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { keys } = useContext(UserContext);

  const { data: product, isLoading: isProductLoading } = useProductById({
    merchantId: merchantId || "",
    productId: productId || "",
  });

  let initialValues: Product = {
    _id: "",
    merchantId: merchantId || "",
    name: "",
    description: "",
    images: [],
    currency: "SATS",
    price: 0,
    quantity: 0,
    specs: [],
    shipping: [],
    status: "Draft",
    createdBy: keys.publicKey,
  };

  const editMutation = useEditProduct();

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      editMutation.mutate(values, {
        onSuccess: (updatedProduct) => {
          if (!values._id) {
            queryClient.setQueryData(
              ["products", merchantId],
              (oldProducts: Products | undefined) =>
                // Don't update if oldProducts is undefined
                oldProducts && [updatedProduct, ...oldProducts]
            );
            createToast({
              message: `Product ${formik.values.name} created successfully`,
              type: "success",
            });
          } else {
            queryClient.setQueryData(
              ["products", merchantId],
              (oldProducts: Products | undefined) =>
                oldProducts &&
                oldProducts.map((product) =>
                  product._id === updatedProduct._id ? updatedProduct : product
                )
            );
            createToast({
              message: `Product ${formik.values.name} updated successfully`,
              type: "success",
            });
          }
          router.push(`/merchants/${merchantId}`, { scroll: false });
        },
        onError: (e) => {
          console.error("editMutation error", e);
          let errorMessage: string = "";
          if (isAxiosError(e)) errorMessage = e.response?.data.message;
          createToast({
            message:
              `Error ${!values._id ? "creating" : "updating"} product` +
              (errorMessage ? ` (${errorMessage})` : ""),
            type: "error",
          });
        },
      });
    },
    validationSchema: toFormikValidationSchema(ProductSchema),
  });

  useEffect(() => {
    if (product) {
      formik.setValues({ ...initialValues, ...product });
    }
  }, [product]);

  return productId && isProductLoading ? (
    <Container className="items-center justify-center p-4 sm:p-6">
      <Loader />
    </Container>
  ) : (
    formik && (
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Container
            bottomMargin
            className="p-4 sm:p-6 max-w-xl mx-auto gap-3 items-stretch"
          >
            <FormField
              inputProps={formik.getFieldProps("name")}
              meta={formik.getFieldMeta("name")}
              label="Name*"
            />
            <FormField
              inputProps={formik.getFieldProps("description")}
              meta={formik.getFieldMeta("description")}
              label="Description"
            />
            <FormField
              inputProps={{
                ...formik.getFieldProps("price"),
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const num = Number(e.target.value);
                  formik.setFieldValue("price", isNaN(num) ? "" : num);
                },
              }}
              meta={formik.getFieldMeta("price")}
              label="Price*"
              suffix={initialValues.currency}
            />
            <FormField
              inputProps={{
                ...formik.getFieldProps("quantity"),
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const num = Number(e.target.value);
                  formik.setFieldValue("quantity", isNaN(num) ? "" : num);
                },
              }}
              meta={formik.getFieldMeta("quantity")}
              label="Quantity*"
            />
            <FieldArray name="images">
              {({ push, remove }) => (
                <>
                  <div className="flex flex-row justify-between items-center">
                    <h2 className="text-lg font-bold py-4">Product images</h2>
                    <button
                      type="button"
                      className="text-orange-700"
                      onClick={() => push("")}
                    >
                      Add an image
                    </button>
                  </div>
                  {formik.values.images?.map((image, index) => (
                    <div
                      key={index}
                      className="flex flex-row gap-3 items-stretch"
                    >
                      <FormField
                        inputProps={formik.getFieldProps(`images.${index}`)}
                        meta={formik.getFieldMeta(`images.${index}`)}
                        label={`Image ${index + 1} URL`}
                        button={
                          <button type="button" onClick={() => remove(index)}>
                            <Trash />
                          </button>
                        }
                      />
                    </div>
                  ))}
                </>
              )}
            </FieldArray>
            {/* <FieldArray name="specs">
              {({ push, remove }) => (
                <>
                  <div className="flex flex-row justify-between items-center">
                    <h2 className="text-lg font-bold py-4">
                      Product specifications
                    </h2>
                    <button
                      type="button"
                      className="text-orange-700"
                      onClick={() => push("")}
                    >
                      Add a specification
                    </button>
                  </div>
                  {formik.values.specs?.map((spec, index) => (
                    <div
                      key={index}
                      className="flex flex-row gap-3 items-stretch"
                    >
                      <FormField
                        inputProps={formik.getFieldProps(`specs.${index}`)}
                        meta={formik.getFieldMeta(`specs.${index}`)}
                        label={`Product specification ${index + 1}`}
                        button={
                          <button type="button" onClick={() => remove(index)}>
                            <Trash />
                          </button>
                        }
                      />
                    </div>
                  ))}
                </>
              )}
            </FieldArray> */}

            <Container alignBottom className="items-center">
              <Button type="submit">{productId ? "Save" : "Create"}</Button>
            </Container>
          </Container>
        </form>
      </FormikProvider>
    )
  );
};

export default EditProduct;
