import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import React from "react";
import {useTranslations} from "next-intl";

export default function NotFound() {
  const t = useTranslations('not_found');

  return (
    <div className={'grid grid-cols-1 gap-7 lg:gap-10'}>
      <div className="container min-h-96 flex items-center justify-center">
        <section>
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-indigo-600 dark:text-indigo-500">404</h1>
              <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">{t("title")}</p>
              <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">{t("message")}</p>
              <Button size={'lg'} className={'rounded-full'} variant={'primary'} asChild>
                <Link href={'/'}>
                  <ArrowLeft className={'w-5 h-5 mr-3'} /> {t("back")}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
