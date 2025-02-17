"use client"

// import styles
import "slick-carousel/slick/slick.css";

import React, {useState} from "react";
import {SlickArrowLeft, SlickArrowRight} from "@/components/public/slick/arrows";
import Slider from "react-slick";
import PlyrPlayer from "@/components/public/video-player/plyr-player";
import {useTranslations} from "next-intl";
import {TSetting} from "@/actions/settings/validations";

export default function VideosCarousel(props: {
	data: TSetting | null
}){
	const data = (props.data?.value as any[]).find(i => i.name === 'Videos').data

	const [curSlide, setCurSlide] = useState(0)
	const t = useTranslations('HomePage');

	return (
		<section className="my-5">
			<div className={'videos-carousel container'}>
				<h2 className="text-center ~text-2xl/3xl text-cyan-900 uppercase font-bold m-0 mt-4 ~mb-6/10">
					{t("videos")}
					<div className="w-40 h-0.5 bg-red-700 mx-auto mt-2"></div>
				</h2>

				<Slider
					beforeChange={(currentSlide, nextSlide) => setCurSlide(nextSlide)}
					adaptiveHeight={true}
					infinite={true}
					speed={250}
					slidesToShow={3}
					slidesToScroll={1}
					touchMove={false}
					accessibility={true}
					prevArrow={<SlickArrowLeft infinite={true} currentSlide={curSlide} slidesToScroll={1} slideCount={Number(data?.length)}/>}
					nextArrow={<SlickArrowRight infinite={true} currentSlide={curSlide} slidesToScroll={1} slideCount={Number(data?.length)}/>}
					className={'-mx-2'}
					responsive={[
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 2,
							}
						},
						{
							breakpoint: 480,
							settings: {
								slidesToShow: 1,
							}
						}
					]}
				>
					{data?.map((it, index) => (
						<div key={it} className={'px-2'}>
							<PlyrPlayer youtubeId={it} />
						</div>
					))}
				</Slider>
			</div>
		</section>
	)
}
