"use client"
import PlyrPlayer from "@/components/public/video-player/plyr-player";
import {TSetting} from "@/actions/settings/validations";

export default function VideosGrid(props: {
	data: TSetting | null
}) {
	const data = (props.data?.value as any[]).find(i => i.name === 'Videos').data

	return (
		<section className="container">
			<div
				className="flex lg:grid lg:grid-cols-3 gap-3 overflow-x-auto scrollbar-hide max-lg:pr-12"
				style={{ scrollSnapType: "x mandatory" }} // Enables snapping for smaller screens
			>
				{data.map((it, i) => (
					<div
						className="w-full flex-shrink-0 lg:flex-shrink md:w-1/2 lg:w-auto last:max-lg:-mr-12"
						key={i}
						style={{ scrollSnapAlign: "start" }} // Snaps for smaller screens
					>
						<PlyrPlayer youtubeId={it} />
					</div>
				))}
			</div>
		</section>
	);
}
