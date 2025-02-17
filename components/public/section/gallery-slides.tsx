"use client"

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lightGallery from "lightgallery";
import {
	StackedCarousel,
	ResponsiveContainer,
} from "react-stacked-center-carousel";
import React, {useEffect} from "react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import {CaretLeftIcon, CaretRightIcon} from "@radix-ui/react-icons";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {TSetting} from "@/actions/settings/validations";
import CloudImage from "@/components/CloudImage";

export default function GallerySlides(props: {
	data: TSetting | null
}){
	const t = useTranslations('HomePage');

	// const data = Array.from(Array(10).keys()).map(i => ({
	// 	cover: `/gallery/gallery (${i+1}).jpg`,
	// 	title: `_image_${i+1}`
	// }))
	const data = (props.data?.value as any[]).find(i => i.name === 'Gallery').data.map((img, i) => ({
		cover: img,
		title: `_image_${i+1}`
	}))

	const ref = React.useRef<any>();

	useEffect(() => {
		const lEl = document.getElementById('light-gallery')
		if(lEl){
			lightGallery(lEl, {
				plugins: [lgThumbnail],
				thumbnail: false
			})
		}
	}, []);

	return (
		<section className={'gallery-slides mt-10 mb-5'}>
			<div className="hidden">
				<div id={'light-gallery'}>
					{data.map((d, index) => (
						<a href={d.cover} key={d.title} className={`llg_${d.title}`}>
							<CloudImage alt={''} src={d.cover} fill className={'w-full h-full object-center object-fill'} />
						</a>
					))}
				</div>
			</div>

			<div className="container relative">
				<ResponsiveContainer
					carouselRef={ref}
					render={(parentWidth, carouselRef) => {
						let currentVisibleSlide = 5;
						// if (parentWidth <= 1440) currentVisibleSlide = 3;
						if (parentWidth <= 1080) currentVisibleSlide = 3;
						return (
							<StackedCarousel
								ref={carouselRef}
								slideComponent={CardImage}
								slideWidth={parentWidth < 600 ? parentWidth - 40 : 500}
								carouselWidth={parentWidth}
								data={data}
								currentVisibleSlide={currentVisibleSlide}
								maxVisibleSlide={5}
								fadeDistance={0.1}
							/>
						);
					}}
				/>
				<>
					<button
						className={'top-1/2 -translate-y-1/2'}
						style={{ position: "absolute", left: 10, zIndex: 10 }}
						onClick={() => {
							ref.current?.goBack();
						}}
					>
						<CaretLeftIcon className={'size-10'}/>
					</button>
					<button
						className={'top-1/2 -translate-y-1/2'}
						style={{ position: "absolute", right: 10, zIndex: 10 }}
						onClick={() => {
							ref.current?.goNext();
						}}
					>
						<CaretRightIcon className={'size-10'}/>
					</button>
				</>
			</div>
		</section>
	)
}
export const CardImage = React.memo(function (props) {
	// @ts-ignore
	const { data, dataIndex } = props;
	const { cover, title } = data[dataIndex];
	return (
		<div
			style={{
				width: "100%",
				height: 340,
				userSelect: "none",
			}}
			className="my-slide-component"
			onClick={() => {
				const llg: HTMLDivElement | null = document.querySelector(`.llg_${title}`)
				if(llg) llg.click()
			}}
		>
			<CloudImage
				style={{
					height: "100%",
					width: "100%",
					objectFit: "cover",
					borderRadius: 0,
				}}
				width={1124}
				height={800}
				quality={80}
				loading={'lazy'}
				draggable={false}
				src={cover}
				alt={title}
			/>
		</div>
	);
});
