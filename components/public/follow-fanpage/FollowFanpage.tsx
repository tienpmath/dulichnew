import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {TSetting} from "@/actions/settings/validations";
import Image from "next/image";
import siteMetadata from "@/config/siteMetadata";
import CloudImage from "@/components/CloudImage";


export default function FollowFanpage(props: {
  data: TSetting | null
}) {
  const data = (props.data?.value as any[]).find(i => i.name === 'Gallery').data

  return (
    <section className="bg-gray-100 bg-[url('/images/background_module.png')]">
      <div className="w-full h-full">
        <div className="py-14 flex flex-col gap-6">
          <div className="flex items-center justify-center flex-col">
            <div className="text-center text-lg px-4">
              Theo dõi fanpage của chúng tôi
            </div>
            <Link
              href={siteMetadata.social.facebook}
              target={'_blank'}
              className="text-orange-500 text-xl md:text-2xl text-center whitespace-nowrap"
            >
              @Fanpage
            </Link>
          </div>

          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full px-4 lg:px-0"
          >
            <CarouselContent className="flex">
              {(data as string[]).map((item, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/5 2xl:basis-1/6 h-auto"
                >
                  <div
                    className={`flex flex-col h-full group`}
                  >
                    <div
                      className={`relative aspect-square bg-white overflow-hidden flex items-center justify-center`}
                    >
                      <CloudImage
                        src={item}
                        alt="product image"
                        height={300}
                        width={400}
                        quality={100}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform ease-in-out duration-500"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
