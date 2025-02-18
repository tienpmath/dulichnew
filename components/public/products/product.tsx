import {
  parseProductImages,
  TProductWithRelation,
} from "@/actions/products/validations";

import { Button } from "@/components/ui/button";
import { PhoneCallIcon } from "lucide-react";
import { Link } from "@/navigation";
import DisplayProse from "@/components/public/products/display-prose";
import ProductSlideImages from "@/components/public/products/product-slides-images";
import { Badge } from "@/components/ui/badge";
import ProductTags from "@/components/public/products/product-tags";
import * as React from "react";
import RelatedProductsPromise from "@/components/public/products/related-products-promise";
import RelatedPostsPromise from "@/components/public/posts/related-posts-promise";
import BreadCrumb from "@/components/public/breadcrumb/breadcrumb";
import _ from "lodash";
import { getLocale, getTranslations } from "next-intl/server";
import ShareProductButtons from "@/components/public/products/share-product-buttons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductReviews from "@/components/public/products/product-reviews/product-reviews";
import CloudImage from "@/components/CloudImage";

export default function Product({
  product,
}: {
  product: TProductWithRelation;
  // productsPromise: ReturnType<typeof getProducts>
}) {
  const hasDiscount =
    typeof product.price === "number" && Number(product.fakePrice) > 0;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.fakePrice! - product.price!) / product.fakePrice!) * 100
      )
    : 0;
  const locale = React.use(getLocale());
  const t = React.use(getTranslations());
  const engVer = locale === "en";

  const productCat =
    product.categories.length > 0 ? product.categories[0] : undefined;
  if (engVer) {
    product.title = (product.langEn as any)?.title || product.title;
    product.description =
      (product.langEn as any)?.description || product.description;
    product.body = (product.langEn as any)?.body || product.body;
    product.extraBody = (product.langEn as any)?.extraBody || product.extraBody;
    product.extraBody1 =
      (product.langEn as any)?.extraBody1 || product.extraBody1;
    product.extraBody2 =
      (product.langEn as any)?.extraBody2 || product.extraBody2;

    if (productCat) {
      productCat.name = (productCat.langEn as any)?.name || productCat.name;
      if (productCat?.parentCategory) {
        productCat.parentCategory.name =
          (productCat?.parentCategory?.langEn as any)?.name ||
          productCat?.parentCategory?.name;
      }
    }
  }

  const catSlug = `${
    productCat?.parentCategory
      ? productCat?.parentCategory?.slug
      : productCat?.slug
  }`;

  return (
    <>
      <div className="container">
        <BreadCrumb
          data={[
            Boolean(productCat && productCat?.parentCategory)
              ? {
                  title: productCat?.parentCategory?.name,
                  href: `/${productCat?.parentCategory?.slug}`,
                }
              : {},
            Boolean(productCat)
              ? {
                  title: productCat?.name,
                  href: `${
                    productCat?.parentCategory
                      ? "/" + productCat?.parentCategory?.slug
                      : ""
                  }/${productCat?.slug}`,
                }
              : {},
            {
              title: product.title,
            },
          ].filter((i) => !_.isEmpty(i))}
        />
      </div>

      <div className={"product-detail container"}>
        <div className="justify-center items-start lg:flex gap-6">
          <div className={"flex-shrink-0 lg:sticky lg:top-28"}>
            <div className={"w-full sm:w-96 lg:w-[30rem] pb-4"}>
              <ProductSlideImages data={product} />
            </div>
          </div>

          <div className={"flex-grow mb-8"}>
            <div className={"w-full max-w-xl lg:px-5"}>
              <div className={"grid grid-cols-1 gap-3 lg:gap-5"}>
                <h1
                  className={
                    "text-2xl md:text-4xl font-bold leading-snug md:leading-snug"
                  }
                >
                  {product.title}
                </h1>
                {typeof product.price === "number" && (
                  <div className="flex flex-wrap w-fit gap-5 items-center">
                    <div className="text-2xl md:text-4xl font-bold text-red-600">
                      {Number(product.price).toLocaleString("vi-VN")} vnđ
                    </div>
                    {hasDiscount && (
                      <div className="line-through text-gray-600">
                        {Number(product.fakePrice).toLocaleString("vi-VN")} vnđ
                      </div>
                    )}
                    {hasDiscount && (
                      <Badge className={""} variant={"warning"}>
                        -{discountPercent}%
                      </Badge>
                    )}
                  </div>
                )}

                {product.extraBody && (
                  <DisplayProse
                    content={String(product.extraBody)}
                    className={"prose-p:my-2 prose-img:hidden"}
                  />
                )}

                <div className={"my-2"}>
                  <Button
                    asChild
                    className={
                      "motion-translate-y-loop-[15px] uppercase bg-red-600 hover:bg-red-700 text-white px-8 py-3 h-auto text-base font-medium flex w-fit shadow-lg transition-all duration-300"
                    }
                    variant={"primary"}
                  >
                    <Link href={"https://zalo.me/0918638068"}>
                      <PhoneCallIcon
                        className={
                          "motion-rotate-loop-[30deg] motion-duration-300 size-5 mr-2"
                        }
                      />{" "}
                      {t("menu.contact")}
                    </Link>
                  </Button>
                </div>

                <hr className={""} />

                <div className={"space-y-1"}>
                  {productCat && (
                    <p>
                      <span className="font-bold">Danh Mục: </span>
                      {Boolean(productCat?.parentCategory) && (
                        <Link
                          className={"text-indigo-600 hover:underline"}
                          href={`${productCat.parentCategory?.slug}`}
                        >
                          {productCat.parentCategory?.name},{" "}
                        </Link>
                      )}
                      <Link
                        className={"text-indigo-600 hover:underline"}
                        href={`${
                          productCat?.parentCategory
                            ? "/" + productCat?.parentCategory?.slug
                            : ""
                        }/${productCat?.slug}`}
                      >
                        {productCat.name}
                      </Link>
                    </p>
                  )}
                  <ShareProductButtons
                    href={`${process.env.NEXT_PUBLIC_APP_URL}/san-pham/${product.slug}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="description"
          className="mt-5 lg:mt-10 rounded-md bg-white p-5 lg:p-8"
        >
          <TabsList className="font-bold uppercase xl:text-lg bg-transparent mx-auto flex flex-wrap h-auto">
            <TabsTrigger
              className={
                "data-[state=active]:text-red-600 data-[state=active]:border-b-red-500 rounded-none bg-transparent uppercase border-b-2 p-4 py-3"
              }
              value="description"
            >
              {t("products.description")}
            </TabsTrigger>
            <TabsTrigger
              className={
                "data-[state=active]:text-red-600 data-[state=active]:border-b-red-500 rounded-none bg-transparent uppercase border-b-2 p-4 py-3"
              }
              value="images"
            >
              Images ({product.images.length})
            </TabsTrigger>
            {/* <TabsTrigger className={'data-[state=active]:text-red-600 data-[state=active]:border-b-red-500 rounded-none bg-transparent uppercase border-b-2 p-4 py-3'} value="specifications">{t("products.specifications")}</TabsTrigger>
						<TabsTrigger className={'data-[state=active]:text-red-600 data-[state=active]:border-b-red-500 rounded-none bg-transparent uppercase border-b-2 p-4 py-3'} value="identification">{t("products.identification")}</TabsTrigger>
						<TabsTrigger className={'data-[state=active]:text-red-600 data-[state=active]:border-b-red-500 rounded-none bg-transparent uppercase border-b-2 p-4 py-3'} value="accessory">{t("products.accessory")}</TabsTrigger> */}
            {/*<TabsTrigger className={'data-[state=active]:text-red-600 data-[state=active]:border-b-red-500 rounded-none bg-transparent uppercase border-b-2 p-4 py-3'} value="reviews">{t("products.reviews")}</TabsTrigger>*/}
          </TabsList>
          <TabsContent value="description">
            <DisplayProse content={String(product.body)} className={""} />
          </TabsContent>
          <TabsContent value="images">
            <div className={"my-7 space-y-5"}>
              {parseProductImages(product.images).map((img, index) => (
                <CloudImage
                  key={index}
                  src={img?.url || ""}
                  alt={`product-image-${index}`}
                  width={600}
                  height={500}
                  className={"mx-auto"}
                />
              ))}
            </div>
          </TabsContent>
          {/* <TabsContent value="specifications">
						<DisplayProse content={String(product.extraBody)} className={''}/>
					</TabsContent>
					<TabsContent value="identification">
						<DisplayProse content={String(product.extraBody1 || "")} className={''}/>
					</TabsContent>
					<TabsContent value="accessory">
						<DisplayProse content={String(product.extraBody2 || "")} className={''}/>
					</TabsContent>
					<TabsContent value="reviews">
						<ProductReviews product={product}/>
					</TabsContent> */}
        </Tabs>
      </div>

      <div className="container max-w-3xl mx-auto">
        <ProductTags data={product} />
      </div>

      <RelatedProductsPromise catSlug={catSlug} />
      <RelatedPostsPromise />
    </>
  );
}
