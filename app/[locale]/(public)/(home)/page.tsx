import Home from "@/app/[locale]/(public)/(home)/_components/home";
import {getPosts} from "@/actions/posts/queries";
import {PostStatus, ProductStatus} from ".prisma/client";
import {getSettingBySlug} from "@/actions/settings/queries";
import {getProducts, getRandomPublishedProducts} from "@/actions/products/queries";
import {PRODUCT_PAGINATION} from "@/enum/enums";

export default function Page() {
  const postsPromise = getPosts({
    page: 1,
    per_page: 8,
    status: PostStatus.PUBLISHED,
    enabledRelated: true,
    image: "http~contains"
  })
  const salePostsPromise = getPosts({
    page: 1,
    per_page: 8,
    status: PostStatus.PUBLISHED,
    // enabledRelated: true,
    image: "http~contains",
    category_slug: 'best-sale'
  })
  const productsPromise = getProducts({
    page: 1,
    per_page: 8,
    status: PostStatus.PUBLISHED,
    images: []
  })
  const settingPromise = getSettingBySlug('home-page')
  return (
    <Home
      postsPromise={postsPromise}
      salePostsPromise={salePostsPromise}
      settingPromise={settingPromise}
      productsPromise={productsPromise}
    />
  )
}
