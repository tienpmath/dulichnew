"use client"

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lightGallery from "lightgallery";
import React, {useEffect} from "react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import {TSetting} from "@/actions/settings/validations";
import _ from "lodash";
import CloudImage from "@/components/CloudImage";

export default function Gallery(props: {
	data: TSetting | null
}){
	const data = (props.data?.value as any[]).find(i => i.name === 'Gallery').data.map((img, i) => ({
		cover: img,
		title: `_image_${i+1}`
	}))

	useEffect(() => {
		const lEl = document.getElementById('gallery-page')
		if(lEl){
			lightGallery(lEl, {
				plugins: [lgThumbnail],
				selector: '.llg__item',
				thumbnail: false
			})
		}
	}, []);

	const chunkData = _.chunk(data, 1)
	chunkData.forEach((row, rowIndex) => {
		if(rowIndex >= 4){
			const num = rowIndex%4
			chunkData[num] = chunkData[num].concat(row)
			chunkData[rowIndex] = []
		}
	})

	return (
		<section className={''}>
			<div id={'gallery-page'}>
				<div className={'grid grid-cols-2 lg:grid-cols-4 gap-5'}>
					{chunkData.map((row, rowIndex) => (
						<div key={'row_'+rowIndex} className={'space-y-5'}>
							{(row as any[]).map((d, itemIndex) => {
								return (
									<a href={d.cover} key={d.title} className={`llg__item llg_${d.title} block`}>
										<CloudImage alt={''} src={d.cover} width={500} height={500} className={''} />
									</a>
								)
							})}
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
