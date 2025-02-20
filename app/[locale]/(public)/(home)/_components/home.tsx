import { getPosts } from "@/actions/posts/queries";
import * as React from "react";
import { Link } from "@/navigation";
import Image from "next/image";
import BannerCarousel from "@/app/[locale]/(public)/(home)/_components/banner-carousel";
import ProductFeatures from "@/app/[locale]/(public)/(home)/_components/product-features";
import VideosCarousel from "@/components/public/section/videos-carousel";
import GallerySlides from "@/components/public/section/gallery-slides";
import PostsCarousel from "@/components/public/posts/posts-carousel";
import { useTranslations } from "next-intl";
import { getSettingBySlug } from "@/actions/settings/queries";
import {
  getProducts,
  getRandomPublishedProducts,
} from "@/actions/products/queries";
import ProductCarousel from "@/components/public/products/product-carousel";
import PostsCarousel2 from "@/components/public/posts/posts-carousel-2";
import CloudImage from "@/components/CloudImage";
import VideosGrid from "@/components/public/section/videos-grid";
import FollowFanpage from "@/components/public/follow-fanpage/FollowFanpage";
import BangGiaCom from "./bangia";

export default function Home(props: {
  postsPromise: ReturnType<typeof getPosts>;
  salePostsPromise: ReturnType<typeof getPosts>;
  productsPromise: ReturnType<typeof getProducts>;
  settingPromise: ReturnType<typeof getSettingBySlug>;
}) {
  const { data: posts } = React.use(props.postsPromise);
  const { data: salePosts } = React.use(props.salePostsPromise);
  const { data: setting } = React.use(props.settingPromise);
  const { data: products } = React.use(props.productsPromise);

  const t = useTranslations("HomePage");

  return (
    <>
      <div className={"-mt-7 lg:-mt-10 xl:-mt-12"}>
        <div className={"lg:-mt-16"}>
          <BannerCarousel data={setting} />
        </div>
      </div>
      <ProductFeatures data={setting} />
      {/* <VideosGrid data={setting}/> */}

      <div className={"container"}>
        <h2 className="text-center ~text-2xl/3xl text-cyan-900 uppercase font-bold m-0 mt-4 ~mb-6/10">
          {t("recent_products")}
          <div className="w-40 h-0.5 bg-red-700 mx-auto mt-2"></div>
        </h2>
        <ProductCarousel data={products || []} />
      </div>

      <div className={"container"}>
        <h2 className="text-center ~text-2xl/3xl text-cyan-900 uppercase font-bold m-0 mt-4 ~mb-6/10">
          Bảng giá thuê xe ô tô Đà Lạt 4 5 7 16 29 chỗ
          <div className="w-40 h-0.5 bg-red-700 mx-auto mt-2"></div>
        </h2>
        <BangGiaCom />
      </div>

      <GallerySlides data={setting} />

      <div className={"container"}>
        <h2 className="text-center ~text-2xl/3xl text-cyan-900 uppercase font-bold m-0 mt-4 ~mb-6/10">
          {t("news")}
          <div className="w-40 h-0.5 bg-red-700 mx-auto mt-2"></div>
        </h2>
        <PostsCarousel2 basis={3} data={posts || []} />
      </div>

      <div className={"-mb-7 lg:-mb-10 xl:-mb-12"}>
        <FollowFanpage data={setting} />
      </div>
    </>
  );
}
