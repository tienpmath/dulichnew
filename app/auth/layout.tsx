import {Button} from "@/components/ui/button";
import {ArrowLeftIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";
import {cn} from "@/lib/utils";
import {inter} from "@/app/fonts";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/toaster";
import {Toaster as ToasterSonner} from "@/components/ui/sonner";

const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang="vi" className={'scroll-smooth'}>
      <body
        suppressHydrationWarning={true}
        className={cn(
          "bg-background font-inter antialiased",
          inter.variable
        )}
      >
      <TooltipProvider>
        <div className="min-h-screen pt-12 pb-4 px-2 flex items-center justify-center bg-blue-50">
          <Button asChild variant={'outline'} className={'flex gap-2 absolute top-2 left-2'}>
            <Link href={'/'}>
              <ArrowLeftIcon/> Trang chủ
            </Link>
          </Button>
          {children}
        </div>
      </TooltipProvider>
      <Toaster />
      <ToasterSonner/>
      <div className={'clear-both'}></div>
      </body>
    </html>
   );
}

export default AuthLayout;
