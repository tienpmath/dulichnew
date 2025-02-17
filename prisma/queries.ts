import { PrismaClient, Prisma } from '@prisma/client'
import _ from "lodash";
import slug from "slug";

const prisma = new PrismaClient()

async function main() {
	const title = "STEP NT644U sink"

	const data =  await prisma.product.findMany({
		where: {
			NOT: {
				images: {
					equals: []
				}
			}
		},
		select: {
			title: true
		}
	})
	console.log(data)
}

main()
.then(async () => {
	await prisma.$disconnect()
})
.catch(async (e) => {
	console.error(e)
	await prisma.$disconnect()
	process.exit(1)
})
