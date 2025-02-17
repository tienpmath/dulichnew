import { MetadataRoute } from 'next'
import {getPostSiteMap} from "@/actions/posts/queries";
import {getPostTags} from "@/actions/posts/tags/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const resPosts = await getPostSiteMap()
	const blogUrls = resPosts.data?.map((item) => ({
		url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${item.slug}`,
		lastModified: item.updatedAt,
	})) || []

	return [
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 1,
		},
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5,
		},
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}/san-pham`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5,
		},
		...blogUrls,
	]
}
