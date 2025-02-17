"use client"
import {useEffect, useRef} from "react";
import PlyrPlayer from "@/components/public/video-player/plyr-player";

export default function BgYoutubeVideo(props:{
	videoId: string,
	muted?: number,
}){
	const youtubeVideoID = props.videoId || "1c2R8I_OR7w"
	const iframeString = `https://www.youtube.com/embed/${youtubeVideoID}?controls=0&autoplay=1&mute=${props?.muted ?? 1}&playsinline=1&loop=1&playlist=${youtubeVideoID}`
	
	return (
		<>
			{(props?.muted === 0) ? (
				<PlyrPlayer
					autoplay={true}
					youtubeId={youtubeVideoID}
				/>
			): (
				<iframe
					className={'pointer-events-none w-full aspect-video absolute top-1/2 -translate-y-1/2'}
					src={iframeString}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerPolicy="strict-origin-when-cross-origin"
				></iframe>
			)}
		</>
	)
}
