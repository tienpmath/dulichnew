"use client";

import SiteLogo from "@/components/public/logo.site";
import PublicNavbarMenu from "@/components/public/layout/header/public-navbar-menu";
import PublicNavbarMenuMobile from "@/components/public/layout/header/public-navbar-menu-mobile";
import SwitchLangButton from "@/components/public/layout/header/switch-lang-button";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import SearchAction from "@/components/public/layout/header/search-action";

export default function Header() {
  const t = useTranslations();

  const menuData = [
    {
      title: t("menu.intro"),
      url: "/gioi-thieu",
    },
    {
      title: t("menu.products"),
      url: "/dich-vu",
      children: [
        {
          url: "/thue-xe-du-lich",
          title: t("products.kitchen_sinks"),
        },
        {
          url: "/dua-don-san-bay",
          title: t("products.kitchen_faucets"),
        },
        {
          url: "/tour-noi-thanh",
          title: t("products.accessory"),
        },
        {
          url: "/tour-ngoai-thanh",
          title: t("products.others"),
        },
      ],
    },
    {
      title: "Hình ảnh",
      url: "/photos",
    },
    {
      title: t("menu.news"),
      url: "/tin-tuc",
      // dropdown_right: true,
      // children: [
      // 	{
      // 		title: t("menu.sale"),
      // 		url: '/blog/tin-khuyen-mai'
      // 	},
      // 	{
      // 		title: t("menu.manual"),
      // 		url: '/blog/cam-nang-san-pham'
      // 	},
      // 	{
      // 		title: t("menu.projects"),
      // 		url: '/blog/cong-trinh-thuc-te'
      // 	},
      // 	{
      // 		title: t("menu.origin_agency"),
      // 		url: '/blog/dai-ly-chinh-hang'
      // 	}
      // ]
    },
    {
      title: t("menu.agency"),
      url: "/chinh-sach",
      dropdown_right: true,
      children: [
        {
          title: t("menu.agency_policy"),
          url: "/blog/chinh-sach-thue-xe",
        },
        {
          title: t("menu.agent_registration"),
          url: "/blog/huong-dan-thue-xe",
        },
      ],
    },
  ];

  return (
    <>
      <header
        className={`~min-h-14/16 flex items-center bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-transform duration-300`}
      >
        <div className="container flex items-center justify-between">
          <div className={"mr-10 flex-grow lg:flex-grow-0"}>
            <div className="">
              <SiteLogo />
            </div>
          </div>
          <div className={"flex items-center gap-8"}>
            <div className="hidden lg:block">
              <PublicNavbarMenu menuData={menuData} />
            </div>
            <SearchAction />
            <div className="hidden lg:block">
              <SwitchLangButton />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:hidden ml-4">
            <PublicNavbarMenuMobile menuData={menuData} />
          </div>
        </div>
      </header>
    </>
  );
}
