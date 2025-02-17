"use client"

import * as React from "react"
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
	AddProductCategorySheet
} from "@/app/(protected)/dashboard/products/categories/_components/add-product-category-sheet";

export function CreateProductCategoryDialog() {
	const [showSheet, setShowSheet] =
		React.useState(false)

	return (
		<div>
			<Button variant="outline" size="sm" onClick={() => setShowSheet(true)}>
				<PlusIcon className="mr-2 size-4" aria-hidden="true" />
				Thêm Category
			</Button>
			<AddProductCategorySheet
				open={showSheet}
				onOpenChange={setShowSheet}
			/>
		</div>
	)
}
