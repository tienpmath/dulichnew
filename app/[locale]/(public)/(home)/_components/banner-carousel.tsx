'use client'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

import React, {Fragment, useState} from "react";
import Image from "next/image";

import {TSetting} from "@/actions/settings/validations";
import CloudImage from "@/components/CloudImage";
export default function BannerCarousel(props: {
	data: TSetting | null
}){
	const data = (props.data?.value as any[]).find(i => i.name === 'Slide ảnh').data

	return (
		<div className={''}>
			<Carousel
				opts={{
					align: "start",
					loop: true,
				}}
				className="w-full"
			>
				<CarouselContent>
					{data?.map((image, index) => (
						<CarouselItem key={index} className="relative">
							<picture className={'block aspect-[12/7] lg:aspect-[12/5] relative cursor-grab'}>
								<CloudImage
									src={image}
									alt={`image_${index}`}
									fill
									className={'object-center object-cover w-full h-full'}
									quality={90}
								/>
							</picture>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="left-2 md:left-12 w-8 md:w-10 h-8 md:h-10 bg-transparent border-2 text-white"/>
				<CarouselNext className="right-2 md:right-12 w-8 md:w-10 h-8 md:h-10 bg-transparent border-2 text-white"/>
			</Carousel>
		</div>
	);
}
