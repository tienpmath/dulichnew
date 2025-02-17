'use client'

import {parseProductImages, TProductWithRelation} from "@/actions/products/validations";
import React, {Fragment, useState} from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import Image from "next/image";

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import {CaretLeftIcon, CaretRightIcon} from "@radix-ui/react-icons";
import {SlickArrowLeft, SlickArrowRight} from "@/components/public/slick/arrows";

export default function ProductSlickImages({data}: {
	data: TProductWithRelation
}){
	const [curSlide, setCurSlide] = useState(0)

	return (
		<div className={'w-full sm:w-96 bg-white p-5 pb-4 rounded-md'}>
			<Slider
				beforeChange={(currentSlide, nextSlide) => setCurSlide(nextSlide)}
				adaptiveHeight={true}
				dots={true}
				dotsClass={'slick-dots vweb-scrollbar'}
				customPaging={(index) => (
					<Image src={parseProductImages(data.images)[index].url} alt={`${data.slug}_image_paging_${index}`} width={54} height={54} className={'aspect-square object-contain'}/>
				)}
				infinite={true}
				speed={250}
				slidesToShow={1}
				slidesToScroll={1}
				touchMove={false}
				prevArrow={<SlickArrowLeft currentSlide={curSlide} slidesToScroll={5} slideCount={data.images.length}/>}
				nextArrow={<SlickArrowRight currentSlide={curSlide} slidesToScroll={5} slideCount={data.images.length}/>}
				afterChange={(currentSlide) => {
					const dots_nav: HTMLUListElement | null = document.querySelector('.slick-dots')
					if(!dots_nav) return

					const curSlidePosition = currentSlide * 60
					const inView = curSlidePosition > dots_nav.scrollLeft && curSlidePosition < (dots_nav.scrollLeft + dots_nav.offsetWidth)
					if(inView) return

					dots_nav.scrollLeft = curSlidePosition
				}}
			>
				{parseProductImages(data.images).map((image, index)=> (
					<Fragment key={image.index}>
						<Zoom zoomMargin={40}>
							<picture className={'rounded-md block mb-0 w-full overflow-hidden aspect-square relative border border-gray-200'}>
								<Image
									src={image.url}
									alt={`${data.slug}_image_${index}`}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 66vw"
									className={'object-center object-contain'}
								/>
							</picture>
						</Zoom>
					</Fragment>
				))}
			</Slider>
		</div>
	);
}
