"use client"

import * as React from "react"
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {AddProductTagSheet} from "@/app/(protected)/dashboard/products/tags/_components/add-product-tag-sheet";

export function CreateProductTagDialog() {
	const [showSheet, setShowSheet] =
		React.useState(false)


	return (
		<div>
			<Button variant="outline" size="sm" onClick={() => setShowSheet(true)}>
				<PlusIcon className="mr-2 size-4" aria-hidden="true" />
				Thêm Tag
			</Button>
			<AddProductTagSheet
				open={showSheet}
				onOpenChange={setShowSheet}
			/>
		</div>
	)
}
