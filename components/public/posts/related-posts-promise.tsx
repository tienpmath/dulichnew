import {getRandomPublishedPosts} from "@/actions/posts/queries";
import RelatedPosts from "@/components/public/posts/related-posts";

export default function RelatedPostsPromise(){
	const postsPromise = getRandomPublishedPosts(6)

	return (
		<RelatedPosts postsPromise={postsPromise}/>
	)
}
