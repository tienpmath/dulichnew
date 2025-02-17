"use client"
import * as React from "react";

import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import PlyrPlayer from "@/components/public/video-player/plyr-player";
import {IoMdPlay} from "react-icons/io";

export default function BannerVideo(){
	return (
		<div className={"container mx-auto max-w-[1400px] px-5 mt-14"}>
			<div className={'bg-[url("/images/banner-company-2.jpg")] rounded-md bg-cover bg-center h-96 lg:min-h-[50vh] flex items-center justify-center'}>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" size={'icon'} className={'bg-transparent text-white border-2 w-20 h-20'}>
							<IoMdPlay className={'size-12'} />
						</Button>
					</DialogTrigger>
					<DialogContent className="p-0 border-none max-w-4xl xl:max-w-5xl overflow-hidden">
						<PlyrPlayer youtubeId={'5uVU2J5ZCCg'}/>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	)
}
