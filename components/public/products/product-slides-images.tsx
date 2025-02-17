'use client'

// import styles
import "slick-carousel/slick/slick.css";
import "@/components/public/products/product-slick-images.css"
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'react-medium-image-zoom/dist/styles.css'
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';

import {parseProductImages, TProductWithRelation} from "@/actions/products/validations";
import React, {Fragment, useEffect, useRef, useState} from "react";
import Slider from "react-slick";
import Image from "next/image";
import {cn} from "@/lib/utils";
import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import {SlickArrowLeft, SlickArrowRight} from "@/components/public/slick/arrows";
import lightGallery from "lightgallery";
import InnerImageZoom from "react-inner-image-zoom";
import useAddClassNameWrapper from "@/hooks/use-add-class-name-wrapper";
import CloudImage from "@/components/CloudImage";

export default function ProductSlideImages({data}: {
	data: TProductWithRelation
}){
	const [curSlide, setCurSlide] = useState(0)
	const [curImageIndex, setCurImageIndex] = useState(0)
	const lightGalleryRef = useRef<any>(null);

	useAddClassNameWrapper("product")

	useEffect(() => {
		const lEl = document.getElementById('light-gallery')
		if(lEl){
			lightGalleryRef.current = lightGallery(lEl, {
				plugins: [lgThumbnail, lgZoom],
				selector: '.slick__slide',
				thumbnail: false
			})
		}
	}, [])

	if(!parseProductImages(data.images) || parseProductImages(data.images).length === 0) return <></>

	return (
		<div className={'product-slick-images'}>
			<picture
				className={'cursor-zoom-in bg-white bg-opacity-80 rounded-md block w-full overflow-hidden aspect-square relative border border-gray-200 mb-3'}
				onClick={() => {
					lightGalleryRef.current.openGallery(curImageIndex);
				}}
			>
				<InnerImageZoom
					src={parseProductImages(data.images)[curImageIndex].url}
					className={'w-full [&>div>img]:aspect-square [&>div>img]:w-full [&>div>img]:h-full [&>div>img]:object-center [&>div>img]:object-contain [&>div>img]:!flex [&>div>img]:items-center [&>div>img]:justify-center'}
					zoomType={'hover'}
				/>
			</picture>

			<div id={'light-gallery'}>
				<Slider
					beforeChange={(currentSlide, nextSlide) => setCurSlide(nextSlide)}
					adaptiveHeight={true}
					infinite={false}
					speed={250}
					slidesToShow={5}
					slidesToScroll={5}
					centerMode={false}
					variableWidth={true}
					touchMove={false}
					prevArrow={<SlickArrowLeft currentSlide={curSlide} slidesToScroll={5} slideCount={data.images.length}/>}
					nextArrow={<SlickArrowRight currentSlide={curSlide} slidesToScroll={5} slideCount={data.images.length}/>}
					className={'-mx-1'}
				>
					{parseProductImages(data.images).map((image, index)=> (
						<div
							key={image.index}
							className={'px-1 relative cursor-pointer'}
							onMouseEnter={() => setCurImageIndex(index)}
						>
							<picture
								data-src={image.url}
								className={cn('slick__slide bg-white bg-opacity-80 w-16 xl:w-20 aspect-square pointer-events-none rounded-md block mb-0 overflow-hidden relative transition-colors', {
									'border border-gray-200': curImageIndex !== index,
									'border-2 border-indigo-500': curImageIndex == index,
								})}
							>
								<CloudImage
									src={image.url}
									alt={`Ảnh ${data.title} ${index + 1}`}
									width={67}
									height={67}
									className={'w-full h-full object-center object-contain'}
								/>
							</picture>
						</div>
					))}
				</Slider>
			</div>
		</div>
	);
}
