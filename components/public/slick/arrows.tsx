import {CaretLeftIcon, CaretRightIcon} from "@radix-ui/react-icons";
import React from "react";
import {cn} from "@/lib/utils";

export const SlickArrowLeft = (props : {
	currentSlide: number,
	slidesToScroll: number,
	slideCount: number,
	infinite?: boolean
}) => {
	const { currentSlide, slidesToScroll, slideCount, infinite } = props
	const disabled = currentSlide === 0 && !Boolean(infinite)
	return (
		<button
			{...props}
			className={cn("slick-prev slick-arrow", {
				"slick-disabled": disabled
			})}
			aria-hidden="true"
			aria-disabled={disabled}
			type="button"
		>
			<CaretLeftIcon className={'size-6'}/>
		</button>
	)
};
export const SlickArrowRight = (props : {
	currentSlide: number,
	slidesToScroll: number,
	slideCount: number,
	infinite?: boolean
}) => {
	const { currentSlide, slidesToScroll, slideCount, infinite } = props
	const disabled = (currentSlide >= slideCount - slidesToScroll) && !Boolean(infinite)
	return (
		<button
			{...props}
			className={cn("slick-next slick-arrow", {
				"slick-disabled": disabled
			})}
			aria-hidden="true"
			aria-disabled={disabled}
			type="button"
		>
			<CaretRightIcon className={'size-6'}/>
		</button>
	)
};