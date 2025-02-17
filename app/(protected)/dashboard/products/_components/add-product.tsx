"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import React, { Fragment, useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageData, uploadFile } from "@/lib/image-data";

import { QuillConfig } from "@/styles/quill/quill-config";
import ReactQuill from "react-quill";
import "@/styles/quill/quill.css";
import { ACCEPTED_IMAGE_TYPES, getStatusText } from "@/enum/enums";
import slug from "slug";
import { isSlug } from "validator";
import DetailPageLayout from "@/components/dashboard/detail-page-layout";
import { ProductStatus } from "@prisma/client";
import PageHeading, {
  PageHeadingInside,
} from "@/components/dashboard/page-heading";
import {
  AddProductSchema,
  defaultValueProduct,
  parseProductImages,
  TAddProductSchema,
  TProduct,
  TProductWithRelation,
  UpdateProductSchema,
} from "@/actions/products/validations";
import { addProduct, updateProduct } from "@/actions/products/actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import MultiImageUpload from "@/components/multi-image-upload";
import { PostStatus } from ".prisma/client";
import Link from "next/link";
import { EyeIcon } from "lucide-react";

import { createLinkFromJson } from "@/actions/common/ralated-link-schema";
import _, { values } from "lodash";
import { SwitchLangInput } from "@/app/(protected)/dashboard/(dashboard)/_components/SwitchLangInput";
import { cn } from "@/lib/utils";
import { undefined } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import StarRatings from "react-star-ratings";
import { CalendarIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteProductComment } from "@/actions/products/rate/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const AddProduct = (props: {
  categories: any[];
  tags: any[];
  product?: TProductWithRelation | null;
}) => {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();

  const [previewVi, setPreviewVi] = useState("");
  const [previewEn, setPreviewEn] = useState("");

  const [cateVariants, setCatVariants] = useState(
    props.categories.find((i) => i.id === props.product?.categoryIDs[0])
      ?.variants ||
      props.categories.find((i) =>
        i.childrenCategory
          .map((i) => i.id)
          .includes(props.product?.categoryIDs[0])
      )?.variants ||
      []
  );
  const [langState, setLangState] = useState("vi");

  const langViData = AddProductSchema.safeParse(props.product);
  const langEnData = AddProductSchema.safeParse(props.product?.langEn);

  const formVi = useForm<TAddProductSchema>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: langViData.success
      ? {
          ...defaultValueProduct,
          ...langViData.data,
          categoryIDs:
            props.product?.categoryIDs || defaultValueProduct.categoryIDs,
          tagIDs: props.product?.tagIDs || defaultValueProduct.tagIDs,
          // images: langViData.success ? parseProductImages(langViData.data.images) : defaultValueProduct.images
        }
      : {
          ...defaultValueProduct,
          authorId: user?.id,
        },
  });
  const formEn = useForm<TAddProductSchema>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: langEnData.success
      ? {
          ...defaultValueProduct,
          ...langEnData.data,
          categoryIDs:
            langEnData.data.categoryIDs || defaultValueProduct.categoryIDs,
          tagIDs: langEnData.data.tagIDs || defaultValueProduct.tagIDs,
          // images: langEnData.success ? parseProductImages(langEnData.data.images) : defaultValueProduct.images
        }
      : {
          ...defaultValueProduct,
          authorId: user?.id,
        },
  });

  const onSubmit = async (input: TAddProductSchema) => {
    startTransition(async () => {
      let imageUrl = "";
      if (input.image && typeof input.image === "object") {
        const resImage = await uploadFile(input.image[0]);
        const data = await resImage?.json();
        imageUrl = data.secure_url;
      }

      if (props.product) {
        // @ts-ignore
        const { error } = await updateProduct(
          {
            ...UpdateProductSchema.parse(formVi.getValues()),
            image: imageUrl || input.image,
            langEn: UpdateProductSchema.parse(formEn.getValues()),
          },
          props.product.id!
        );

        if (error) {
          toast.error(error);
          return;
        }

        toast.success("Update thành công");
      } else {
        if (langState !== "en") {
          const { data, error } = await addProduct({
            ...AddProductSchema.parse(formVi.getValues()),
            image: imageUrl,
            langEn: AddProductSchema.parse(formEn.getValues()),
          });

          if (error) {
            toast.error(error);
            return;
          }
          toast.success("Tạo thành công");
          redirect(`/dashboard/products/${data?.id}`);
        } else {
          toast.error("Vui lòng tạo với tiếng việt trước");
        }
      }
    });
  };

  const [productComments, setProductComments] = useState(
    props?.product?.comments || []
  );

  return (
    <div className="container">
      {["vi", "en"].map((lang, index) => {
        const form = lang === "vi" ? formVi : formEn;

        return (
          <Form {...form} key={index}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn("", {
                hidden: langState !== lang,
              })}
            >
              <DetailPageLayout>
                <DetailPageLayout.Main>
                  <PageHeadingInside
                    title={<>Sản phẩm</>}
                    backUrl={"/dashboard/products"}
                  />
                  <Card className={"overflow-hidden-"}>
                    <CardHeader className={"px-0 mx-6 pb-4 mb-4 border-b"}>
                      <CardTitle>Thông tin</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="image"
                          render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem
                              className={"flex-col md:flex-row md:gap-5 hidden"}
                            >
                              <FormLabel
                                className={"flex-shrink-0 md:w-40 md:mt-4"}
                              >
                                Image
                              </FormLabel>
                              <div className={"space-y-2 flex-grow"}>
                                <Avatar className="w-24 h-24 rounded-none">
                                  <AvatarImage src={previewVi || ""} />
                                  <AvatarFallback>Avatar</AvatarFallback>
                                </Avatar>

                                <FormControl>
                                  <Input
                                    type="file"
                                    {...rest}
                                    onChange={(event) => {
                                      const { files, displayUrl } =
                                        getImageData(event);
                                      setPreviewVi(displayUrl);
                                      onChange(files);
                                    }}
                                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                    disabled={isPending}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Vui lòng chọn ảnh
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <div className={cn({ hidden: lang === "en" })}>
                          <MultiImageUpload
                            images={form.getValues("images")}
                            handleChange={(e) => form.setValue("images", e)}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem
                              className={"flex flex-col md:flex-row md:gap-5"}
                            >
                              <FormLabel
                                className={"flex-shrink-0 md:w-40 md:mt-4"}
                              >
                                Tiêu đề
                              </FormLabel>
                              <div className={"space-y-2 flex-grow"}>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={isPending}
                                    required
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem
                              className={"flex flex-col md:flex-row md:gap-5"}
                            >
                              <FormLabel
                                className={"flex-shrink-0 md:w-40 md:mt-4"}
                              >
                                Slug
                              </FormLabel>
                              <div className={"space-y-2 flex-grow"}>
                                <div className="flex items-center space-x-2">
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={isPending}
                                      required
                                    />
                                  </FormControl>
                                  <Button
                                    type={"button"}
                                    variant={"secondary"}
                                    onClick={() => {
                                      const sl = slug(form.getValues("title"));
                                      form.setValue("slug", sl);
                                    }}
                                  >
                                    Generate
                                  </Button>
                                </div>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <div
                          className={cn("space-y-4", { hidden: lang === "en" })}
                        >
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem
                                className={"flex flex-col md:flex-row md:gap-5"}
                              >
                                <FormLabel
                                  className={"flex-shrink-0 md:w-40 md:mt-4"}
                                >
                                  Giá
                                </FormLabel>
                                <div className={"space-y-2 flex-grow"}>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={isPending}
                                      type={"number"}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="fakePrice"
                            render={({ field }) => (
                              <FormItem
                                className={"flex flex-col md:flex-row md:gap-5"}
                              >
                                <FormLabel
                                  className={"flex-shrink-0 md:w-40 md:mt-4"}
                                >
                                  Giá ảo
                                </FormLabel>
                                <div className={"space-y-2 flex-grow"}>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={isPending}
                                      type={"number"}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem
                              className={"flex flex-col md:flex-row md:gap-5"}
                            >
                              <FormLabel
                                className={"flex-shrink-0 md:w-40 md:mt-4"}
                              >
                                Mô tả
                              </FormLabel>
                              <div className={"space-y-2 flex-grow"}>
                                <FormControl>
                                  <Textarea {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="metaDescription"
                          render={({ field }) => (
                            <FormItem
                              className={"flex flex-col md:flex-row md:gap-5"}
                            >
                              <FormLabel
                                className={"flex-shrink-0 md:w-40 md:mt-4"}
                              >
                                Mô tả SEO
                              </FormLabel>
                              <div className={"space-y-2 flex-grow"}>
                                <FormControl>
                                  <Textarea {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="extraBody"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thông số sản phẩm</FormLabel>
                              <div className={"space-y-2 flex-grow"}>
                                <FormControl>
                                  <ReactQuill
                                    className={"prose max-w-none"}
                                    theme="snow"
                                    disabled={isPending}
                                    modules={QuillConfig.modules}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="body"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mô tả</FormLabel>
                              <div className={"space-y-2 flex-grow"}>
                                <FormControl>
                                  <ReactQuill
                                    className={"prose max-w-none"}
                                    theme="snow"
                                    disabled={isPending}
                                    modules={QuillConfig.modules}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="extraBody1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thông tin nhận diện</FormLabel>
                              <div className={"space-y-2 flex-grow"}>
                                <FormControl>
                                  <ReactQuill
                                    className={"prose max-w-none"}
                                    theme="snow"
                                    disabled={isPending}
                                    modules={QuillConfig.modules}
                                    {...field}
                                    value={String(field.value || "")}
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="extraBody2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phụ kiện</FormLabel>
                              <div className={"space-y-2 flex-grow"}>
                                <FormControl>
                                  <ReactQuill
                                    className={"prose max-w-none"}
                                    theme="snow"
                                    disabled={isPending}
                                    modules={QuillConfig.modules}
                                    {...field}
                                    value={String(field.value || "")}
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {Boolean(productComments.length > 0) && (
                    <Card className={"overflow-hidden-"}>
                      <CardHeader className={"px-0 mx-6 pb-4 mb-4 border-b"}>
                        <CardTitle>Đánh giá</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className={"grid gap-6 my-7"}>
                            {productComments.map((cm, index) => (
                              <div key={cm.id} className={"flex gap-5"}>
                                <Avatar className={"size-14"}>
                                  <AvatarImage
                                    src="/avatar-default.png"
                                    alt={String(cm.name)}
                                  />
                                </Avatar>
                                <div className={"space-y-1"}>
                                  <div>
                                    <StarRatings
                                      rating={Number(cm.rate)}
                                      starRatedColor={"#d26e4b"}
                                      starDimension={"18px"}
                                      starSpacing={"0"}
                                    />
                                  </div>
                                  <div>
                                    <span className="font-bold">{cm.name}</span>{" "}
                                    -{" "}
                                    <span className="">
                                      {new Date(
                                        cm.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p>{cm.comment}</p>
                                </div>
                                <div className={"flex-grow justify-end"}>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        type={"button"}
                                        size={"sm"}
                                        className={"flex ml-auto"}
                                        variant={"secondary"}
                                      >
                                        <TrashIcon className={"size-4 mr-1"} />{" "}
                                        Xóa
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Bạn chắc chắn xóa đánh giá này??
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Hành động này không thể được hoàn tác.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Hủy
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={async () => {
                                            const { error } =
                                              await deleteProductComment(cm.id);

                                            if (error) {
                                              toast.error(error);
                                              return;
                                            }
                                            toast.success("Xóa thành công");

                                            const temp = [...productComments];
                                            const cmIdx = temp.findIndex(
                                              (e) => e.id === cm.id
                                            );
                                            temp.splice(cmIdx, 1);

                                            setProductComments(temp);
                                          }}
                                        >
                                          Tiếp tục
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </DetailPageLayout.Main>
                <DetailPageLayout.Right>
                  <div className={"h-20 flex gap-3 items-end justify-end"}>
                    <SwitchLangInput
                      checked={langState === "en"}
                      onClick={() =>
                        langState === "en"
                          ? setLangState("vi")
                          : setLangState("en")
                      }
                    />

                    {Boolean(
                      props.product?.status === ProductStatus.PUBLISHED
                    ) && (
                      <Button asChild variant={"outline"}>
                        <Link
                          href={`${process.env.NEXT_PUBLIC_APP_URL}/san-pham/${props.product?.slug}`}
                          target={"_blank"}
                        >
                          <EyeIcon className={"size-4 mr-2"} /> View
                        </Link>
                      </Button>
                    )}
                    <Button type={"submit"} disabled={isPending}>
                      {props.product ? "Cập nhật" : "Tạo Sản phẩm"}
                    </Button>
                  </div>

                  <div
                    className={
                      "space-y-4 lg:space-y-8 w-full lg:h-[calc(100vh-8rem)] overflow-auto"
                    }
                  >
                    <Card className={"p-6 flex flex-col gap-3 w-full"}>
                      <FormField
                        control={form.control}
                        name="keywords"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Từ Khóa</FormLabel>
                            <div className={"space-y-2 flex-grow"}>
                              <FormControl>
                                <Input {...field} disabled={isPending} />
                              </FormControl>
                              <FormDescription>
                                Ngăn cách bởi dấu phẩy{" "}
                              </FormDescription>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <div
                        className={cn("flex flex-col gap-3", {
                          hidden: lang === "en",
                        })}
                      >
                        <FormField
                          control={form.control}
                          name={"status"}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tình trạng</FormLabel>
                              <Select
                                value={field.value}
                                disabled={isPending}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger className="">
                                    <SelectValue placeholder="Tình trạng" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={ProductStatus.PUBLISHED}>
                                    {getStatusText(ProductStatus.PUBLISHED)}
                                  </SelectItem>
                                  <SelectItem value={ProductStatus.DRAFT}>
                                    {getStatusText(ProductStatus.DRAFT)}
                                  </SelectItem>
                                  <SelectItem
                                    value={ProductStatus.OUT_OF_STOCK}
                                  >
                                    {getStatusText(ProductStatus.OUT_OF_STOCK)}
                                  </SelectItem>
                                </SelectContent>
                                <FormMessage />
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={"createdAt"}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[280px] justify-start text-left font-normal gap-1.5",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon />
                                    {field.value ? (
                                      format(field.value, "dd LLL, y", {
                                        locale: vi,
                                      })
                                    ) : (
                                      <span>Chọn ngày</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={"categoryIDs"}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Danh mục</FormLabel>
                              <Select
                                value={field.value[0]}
                                disabled={isPending}
                                onValueChange={(v) => {
                                  setCatVariants(
                                    props.categories.find((i) => i.id === v)
                                      ?.variants ||
                                      props.categories.find((i) =>
                                        i.childrenCategory
                                          .map((i) => i.id)
                                          .includes(v)
                                      )?.variants ||
                                      []
                                  );
                                  form.setValue("categoryIDs", [v]);
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger className="">
                                    <SelectValue placeholder="Danh mục" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {props.categories.map((c) => (
                                    <Fragment key={c.slug}>
                                      <SelectItem key={c.slug} value={c.id}>
                                        {c.name}
                                      </SelectItem>
                                      {c.childrenCategory.map((x) => (
                                        <SelectItem
                                          className={"pl-6"}
                                          key={x.slug}
                                          value={x.id}
                                        >
                                          {x.name}
                                        </SelectItem>
                                      ))}
                                    </Fragment>
                                  ))}
                                </SelectContent>
                                <FormMessage />
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tagIDs"
                          render={({ field: { ...field } }) => (
                            <FormItem>
                              <FormLabel>Tag</FormLabel>
                              <div className={"space-y-2 flex-grow"}>
                                <MultiSelect
                                  selected={field.value}
                                  options={props.tags.map((e) => ({
                                    value: String(e.id),
                                    label: String(e.name),
                                  }))}
                                  {...field}
                                />
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>

                    {cateVariants.length > 0 && (
                      <Card
                        className={cn("p-6 flex flex-col gap-3 w-full", {
                          hidden: lang === "en",
                        })}
                      >
                        <p>Phân loại</p>
                        {cateVariants
                          .filter((v) => !Boolean(v.hidden))
                          .map((variant, index) => (
                            <Fragment key={index}>
                              <FormLabel>{variant.name}</FormLabel>
                              {Boolean(variant.type === "options") ? (
                                <div className="space-y-0">
                                  {variant.value.map((c) => (
                                    <div key={c} className={"space-x-2"}>
                                      <Checkbox
                                        defaultChecked={Boolean(
                                          _.find(form.getValues("variants"), {
                                            slug: variant.slug,
                                            value: c,
                                          })
                                        )}
                                        onCheckedChange={(v) => {
                                          const prodVariants = [
                                            ...form.getValues("variants"),
                                          ];
                                          const index = _.findIndex(
                                            form.getValues("variants"),
                                            { slug: variant.slug, value: c }
                                          );

                                          if (v) {
                                            prodVariants.push({
                                              slug: variant.slug,
                                              value: c,
                                            });
                                          } else {
                                            prodVariants.splice(index, 1);
                                          }
                                          form.setValue(
                                            "variants",
                                            prodVariants
                                          );
                                        }}
                                        id={index + slug(c)}
                                        value={c}
                                      />
                                      <FormLabel
                                        className={"text-black"}
                                        htmlFor={index + slug(c)}
                                      >
                                        {c}
                                      </FormLabel>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <Select
                                  disabled={isPending}
                                  defaultValue={
                                    _.find(form.getValues("variants"), {
                                      slug: variant.slug,
                                    })?.value || ""
                                  }
                                  onValueChange={(v) => {
                                    const prodVariants = [
                                      ...form.getValues("variants"),
                                    ];
                                    const index = _.findIndex(
                                      form.getValues("variants"),
                                      { slug: variant.slug }
                                    );
                                    if (index >= 0) {
                                      prodVariants.splice(index, 1, {
                                        slug: variant.slug,
                                        value: v,
                                      });
                                    } else {
                                      prodVariants.push({
                                        slug: variant.slug,
                                        value: v,
                                      });
                                    }
                                    form.setValue("variants", prodVariants);
                                  }}
                                >
                                  <SelectTrigger className="">
                                    <SelectValue placeholder={"Lựa chọn"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {variant.value.map((c) => (
                                      <SelectItem key={c} value={c}>
                                        {c}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </Fragment>
                          ))}
                      </Card>
                    )}
                  </div>
                </DetailPageLayout.Right>
              </DetailPageLayout>
            </form>
          </Form>
        );
      })}
    </div>
  );
};

export default AddProduct;
