"use client";

import Image, {ImageProps} from "next/image";
import cloudinaryLoader from "@/image/loader";
import React, {Fragment, useEffect, useRef, useState} from "react";
import {useIntersectionObserver, useWindowSize} from "usehooks-ts";
import {rgbDataURL} from "@/lib/rgbDataUrl";
import {cn, transformWidth} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";

type Props = Omit<ImageProps, "src"> & {
	src: string;
};

export default function CloudImage({src, alt, ...props}: Props) {
	const {width: windowWidth} = useWindowSize();
	const [calculatedWidth, setCalculatedWidth] = useState<number | undefined>(Number(props.width));
	const [cloudSrc, setCloudSrc] = useState<string | null>(null);
	const [isCalculated, setIsCalculated] = useState<boolean>(false);

	useEffect(() => {
		const width = transformWidth({
			originalWidth: Number(props.width),
			windowWidth: windowWidth,
			sizesString: props.sizes,
		});
		setCalculatedWidth(width);
		setIsCalculated(true);
	}, []);

	useEffect(() => {
		if (isCalculated) {
			setCloudSrc(cloudinaryLoader({
				src: src,
				width: calculatedWidth,
				quality: Number(props.quality),
				type: props.itemType,
			}));
		}
	}, [calculatedWidth, src, props.quality, props.itemType, isCalculated]);

	// observer
	const [visible, setVisible] = useState<boolean>(true);
	const [imageRef, entry] = useIntersectionObserver({
		root: null,
		rootMargin: '0px',
		threshold: 0.1,
	});
	useEffect(() => {
		if (entry) {
			setVisible(true);
		}
	}, [entry]);

	if (!cloudSrc || !isCalculated) return null;

	return (
		<figure ref={imageRef} className={'object-center object-cover w-full h-full'}>
			{visible ?
				(
					<Image
						{...props}
						src={cloudSrc || ""}
						alt={alt}
						placeholder={'blur'}
						blurDataURL={rgbDataURL(243, 244, 246)}
					/>
				)
				: (
					<>
						<Skeleton
							{...props}
						/>
					</>
				)
			}
		</figure>
	);
}
