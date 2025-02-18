import * as React from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { TSetting } from "@/actions/settings/validations";
import CloudImage from "@/components/CloudImage";

export default function ProductFeatures(props: { data: TSetting | null }) {
  const t = useTranslations("products");

  let data = [
    {
      img: "",
      path: "/xe-dua-don-say-bay-da-lat",
      title: t("kitchen_sinks"),
      count: Math.round(Math.random() * 90) + 10,
    },
    {
      img: "",
      path: "/xe-da-lat-nha-trang",
      title: t("kitchen_faucets"),
      count: Math.round(Math.random() * 90) + 10,
    },
    {
      img: "",
      path: "/thue-xe-du-lich-da-lat",
      title: t("accessory"),
      count: Math.round(Math.random() * 90) + 10,
    },
    {
      img: "",
      path: "/tour-du-lich-da-la",
      title: t("others"),
      count: Math.round(Math.random() * 90) + 10,
    },
  ];

  data = data.map((i, index) => ({
    ...i,
    img:
      (props.data?.value as any[]).find((i) => i.name === "Sản phẩm").data[
        index
      ] || "",
  }));

  return (
    <section className={""}>
      <div className={"container"}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
          {data.map((d) => (
            <div key={d.title} className={"w-full"}>
              <Link
                href={d.path}
                className="group block aspect-square overflow-hidden w-full"
              >
                <CloudImage
                  src={d.img}
                  className={
                    "transition duration-300 ease-in-out hover:scale-110 w-full h-full object-cover"
                  }
                  alt={d.title}
                  priority
                  quality={90}
                  height={600}
                  width={600}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 33vw"
                />
              </Link>
              <div
                className={
                  "border-2 px-2 py-2 flex flex-col lg:flex-row gap-3 items-center justify-between w-full"
                }
              >
                <p className="uppercase text-sm font-bold">{d.title}</p>
                <div className={"w-full lg:w-fit flex-shrink-0 sm:block"}>
                  <Link href={d.path} passHref>
                    <button className="w-full button button--mimas text-xs uppercase px-5 py-2">
                      <span className={""}>{t("detail")}</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
