import ProductCategory from "@/app/[locale]/(public)/(products)/san-pham/danh-muc/[...slug]/page";
import PostCategory from "@/app/[locale]/(public)/(blog)/blog/danh-muc/[...slug]/page";
import {getPostCategoryBySlug} from "@/actions/posts/categories/queries";
import {Metadata, ResolvingMetadata} from "next";
import {getProductCategoryBySlug} from "@/actions/products/categories/queries";
import siteMetadata from "@/config/siteMetadata";

type Props = {
	params: { slug: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const {data, error} = await getPostCategoryBySlug(params.slug[params.slug.length-1])

	if(!data || error) {
		const {data, error} = await getProductCategoryBySlug(params.slug[params.slug.length-1])

		if(!data || error) {
			return {
				title: 'Not Found'
			}
		}

		return {
			title: `${data.name}`,
			description: `Danh sách sản phẩm trong danh mục: ${data.name}`,
			openGraph: {
				title: `${data.name}`,
				description: `Danh sách sản phẩm trong danh mục: ${data.name}`,
				images: `${siteMetadata.ogImage}`
			}
		}
	}

	return {
		title: `${data.name}`,
		description: `Danh sách bài viết trong danh mục: ${data.name}`,
		openGraph: {
			title: `${data.name}`,
			description: `Danh sách bài viết trong danh mục: ${data.name}`,
			images: `${siteMetadata.ogImage}`
		}
	}
}

export default async function Page(props: {
	params: { slug: string },
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	const postCategory = await getPostCategoryBySlug(props.params.slug[0])
	if (!postCategory.data || postCategory.error) {
		return (
			<>
				<ProductCategory
					params={{slug: props.params.slug}}
					searchParams={props.searchParams}
				/>
			</>
		)
	}

	return (
		<>
			<PostCategory
				params={{slug: props.params.slug}}
				searchParams={props.searchParams}
			/>
		</>
	)
}
