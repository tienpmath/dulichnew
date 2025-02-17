"use client"

import * as React from "react";
// import "plyr/dist/plyr.css"
import "./plyr-player.css"
import Plyr from 'plyr';
import {useEffect, useRef} from "react";

export default function PlyrPlayer(props: {youtubeId: string, autoplay?: boolean}) {
	const ref = useRef<HTMLDivElement|null>(null)
	useEffect(() => {
		if(ref.current){
			const player = new Plyr(ref.current, {
				autoplay: props.autoplay,
				controls: ['play', 'progress', 'fullscreen', 'volume'],
			});
		}
	}, [])

	return (
		<div ref={ref} data-plyr-provider="youtube" data-plyr-embed-id={props.youtubeId}></div>
	)
}
