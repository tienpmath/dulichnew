'use client'

const imgCloudSource = [
	'https://res.cloudinary.com/dgdz0gbu1/image/upload',
	'https://res.cloudinary.com/dcmwzrs2y/image/upload',
]

export default function cloudinaryLoader(props: {
	src: string,
	width?: number,
	quality?: number,
	blur?: number,
	type?: string,
}) {
	const { src, width, quality, blur, type } = props
	
	const imgType = type ? ['png', 'gif', 'jpg', 'webp'].includes(type) ? 'auto' : undefined : undefined
	
	const params = [`f_${imgType || 'webp'}`, 'c_limit', `w_${width || 'auto'}`, `q_${quality || '90'}`]
	if(blur && blur > 0){
		params.push(`e_blur:${blur || 0}`)
	}
	
	if (src.startsWith('https://images.nobili-nobinox.com.vn/p')) {
		return addTransformations(src, params.join(','))
	}
	
	for (const url of imgCloudSource) {
		if(src.includes(url)){
			return src.replace(url, `${url}/${params.join(',')}`)
		}
	}
	
	return src
}

function addTransformations(imageUrl: string, transformations: string) {
	const baseUrl = imageUrl.substring(0, imageUrl.indexOf('/images/'));
	const imagePath = imageUrl.substring(imageUrl.indexOf('/images/') + '/images/'.length);
	
	return `${baseUrl}/${transformations}/images/${imagePath}`;
}
