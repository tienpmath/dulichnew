"use client"
import React from "react";
import {useTranslations} from "next-intl";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel"
import PostCard from "@/components/public/posts/post-card";
import duplicateItems from "@/lib/duplicate-items";
import {cn} from "@/lib/utils";

export default function PostsCarousel2(props: {
	data: any[],
	basis?: number,
}) {
	const {data, basis} = props
	const t = useTranslations();

	const caBasis = basis || 4
	
	return (
		<Carousel
			opts={{
				align: "start",
				loop: true,
			}}
			className="w-full -mb-12"
		>
			<CarouselContent className={'pb-12'}>
				{data.slice(0, 8).map((post, index) => (
					<CarouselItem key={index} className={cn("md:basis-1/2", {
						"lg:basis-1/3": caBasis === 3,
						"lg:basis-1/4": caBasis === 4,
						"lg:basis-1/5": caBasis === 5,
					})}>
						<div>
							<PostCard post={post} smallSize/>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className={'max-xl:-left-1'}/>
			<CarouselNext className={'max-xl:-right-1'}/>
		</Carousel>
	)
}
