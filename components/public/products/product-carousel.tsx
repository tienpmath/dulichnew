"use client"
import React from "react";
import ProductCard from "@/components/public/products/product-card";
import {Button} from "@/components/ui/button";
import {Link} from "@/navigation";
import {ArrowLeft} from "lucide-react";
import {TProductWithRelation} from "@/actions/products/validations";
import {useTranslations} from "next-intl";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel"

export default function ProductCarousel(props: {
	data: TProductWithRelation[]
}) {
	const {data} = props

	return (
		<Carousel
			opts={{
				align: "start",
				loop: true,
			}}
			className="w-full"
		>
			<CarouselContent >
				{data?.slice(0, 8).map((product, index) => (
					<CarouselItem key={index} className="basis-1/2 lg:basis-1/4">
						<div>
							<ProductCard product={product} key={product.id} size={'sm'}/>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className={'max-xl:-left-1'}/>
			<CarouselNext className={'max-xl:-right-1'}/>
		</Carousel>
	)
}
