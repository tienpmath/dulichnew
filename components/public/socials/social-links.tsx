import "@/components/public/socials/social-links.css";
import { Link } from "@/navigation";
import Image from "next/image";
import siteMetadata from "@/config/siteMetadata";
export default function SocialLinks() {
  const data = [
    // {
    // 	name: 'tiktok',
    // 	icon_path: '/icons/socials-circle/tiktok.png',
    // 	url: '/',
    // },
    // {
    // 	name: 'youtube',
    // 	icon_path: '/icons/socials-circle/youtube.png',
    // 	url: siteMetadata.social.youtube
    // },
    {
      name: "zalo",
      icon_path: "/icons/socials-circle/zalo.png",
      url: siteMetadata.social.zalo,
    },
    // {
    // 	name: 'phone',
    // 	icon_path: '/icons/socials-circle/phone.png',
    // 	url: `tel:${siteMetadata.hotline}`
    // },
    {
      name: "messenger",
      icon_path: "/icons/facebook.png",
      url: siteMetadata.social.facebook,
    },
  ];
  return (
    <div className={"icon-xh z-10 right-6 bottom-32 fixed lg:block"}>
      <ul className={""}>
        {data
          .filter((ic) => ic.url !== "/")
          .map((icon) => (
            <li key={icon.name} className={`${icon.name}`}>
              <Link href={icon.url} target={"_blank"}>
                <span className="animated_zalo infinite zoomIn_zalo cmoz-alo-circle"></span>
                <span className="animated_zalo infinite pulse_zalo cmoz-alo-circle-fill"></span>
                <span>
                  <Image
                    src={icon.icon_path}
                    alt={icon.name}
                    width={40}
                    height={40}
                  />
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
