import {Prisma, ProductTag} from "@prisma/client";
import ProductTagCreateInput = Prisma.ProductTagCreateInput;
import ProductTagUpdateInput = Prisma.ProductTagUpdateInput;
import ProductTagGetPayload = Prisma.ProductTagGetPayload;

export type TProductTagCreateInput = ProductTagCreateInput
export type TProductTagUpdateInput = ProductTagUpdateInput
export type TProductTag = ProductTag
export type TProductTagWithProductCount = ProductTagGetPayload<{
	select: {
		id: true,
		slug: true,
		name: true,
		langEn: true,
		_count: {
			select: {
				products: true
			}
		}
	}
}>


