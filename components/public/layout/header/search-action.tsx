"use client"
import React from "react";
import {IoSearchOutline} from "react-icons/io5";
import {SearchProductsInput} from "@/components/public/products/search-products-input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

export default function SearchAction(props:{
}){

	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<button>
						<IoSearchOutline size={22} className="cursor-pointer"/>
					</button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-3 bg-white rounded shadow-lg">
					<SearchProductsInput/>
				</PopoverContent>
			</Popover>
		</>
	)
}
