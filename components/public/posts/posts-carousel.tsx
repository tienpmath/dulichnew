"use client"

import PostCard from "@/components/public/posts/post-card";
import React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel"

export default function PostsCarousel(props :{
	data: any[] | null
}){
	const {data} = props

	return (
		<div className={'container'}>
			<Carousel
				opts={{
					align: "start",
					loop: true,
				}}
				className="w-full"
			>
				<CarouselContent>
					{data?.map((post, index) => (
						<CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
							<PostCard post={post} smallSize/>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className={'max-xl:-left-1'}/>
				<CarouselNext className={'max-xl:-right-1'}/>
			</Carousel>
		</div>
	)
}
