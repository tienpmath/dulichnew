"use client"
import {TProductWithRelation} from "@/actions/products/validations";
import ReviewForm from "@/components/public/products/product-reviews/review-form";
import {getDateVn} from "@/lib/date";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import StarRatings from "react-star-ratings";
import {useTranslations} from "next-intl";

export default function ProductReviews({product}: {
	product: TProductWithRelation
}){
	const t = useTranslations('reviews');

	return (
		<>
			{Boolean(product.comments.length > 0) ? (
				<div className={'grid gap-6 my-7'}>
					{product.comments.map((cm, index) => (
						<div key={index} className={'flex gap-5'}>
							<Avatar className={'size-14'}>
								<AvatarImage src="/avatar-default.png" alt={String(cm.name)} />
							</Avatar>
							<div className={'space-y-1'}>
								<div>
									<StarRatings rating={Number(cm.rate)} starRatedColor={'#d26e4b'} starDimension={'18px'} starSpacing={'0'}/>
								</div>
								<div>
									<span className="font-bold">{cm.name}</span> - <span className="">{new Date(cm.createdAt).toLocaleDateString()}</span>
								</div>
								<p>
									{cm.comment}
								</p>
							</div>
						</div>
					))}
				</div>
			) : (
				<div>
					<p className={'my-8'}>{t("no_review_yet")}</p>
				</div>
			)}
			<ReviewForm product={product}/>
		</>
	)
}
