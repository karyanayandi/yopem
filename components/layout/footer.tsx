import * as React from "react"
import NextLink from "next/link"

import LanguageSwitcher from "@/components/language-switcher"
import ThemeSwitcher from "@/components/theme/theme-switcher"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import env from "@/env.mjs"
import { cn } from "@/lib/utils"

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Footer: React.FunctionComponent<FooterProps> = (props) => {
  const { className } = props

  return (
    <footer
      className={cn(
        "sticky top-[100vh] z-40 mt-auto border-t border-border px-6 py-4 text-center",
        className,
      )}
    >
      <div className="m-6 flex flex-col justify-between md:flex-row">
        <div className="flex-row space-x-3 font-semibold">
          &copy;&nbsp;
          {new Date().getFullYear()}&nbsp;
          <span className="font-bold">{env.NEXT_PUBLIC_SITE_TITLE}</span>
        </div>
        <div className="flex flex-row items-center justify-center md:order-1">
          <Button asChild aria-label="Facebook" variant="ghost" size="icon">
            <NextLink
              aria-label="X"
              href={`https://facebook.com/${env.NEXT_PUBLIC_FACEBOOK_USERNAME}`}
              target="_blank"
            >
              <Icon.Facebook />
            </NextLink>
          </Button>
          <Button asChild aria-label="Instagram" variant="ghost" size="icon">
            <NextLink
              aria-label="Instagram"
              href={`https://instagram.com/${env.NEXT_PUBLIC_INSTAGRAM_USERNAME}`}
              target="_blank"
            >
              <Icon.Instagram />
            </NextLink>
          </Button>
          <Button asChild aria-label="Tiktok" variant="ghost" size="icon">
            <NextLink
              aria-label="X"
              href={`https://tiktok.com/${env.NEXT_PUBLIC_TIKTOK_USERNAME}`}
              target="_blank"
            >
              <Icon.Tiktok />
            </NextLink>
          </Button>
          <Button asChild aria-label="WhatsApp" variant="ghost" size="icon">
            <NextLink
              aria-label="X"
              href={`https://whatsapp.com/${env.NEXT_PUBLIC_WHATSAPP_CHANNEL_USERNAME}`}
              target="_blank"
            >
              <Icon.WhatsApp />
            </NextLink>
          </Button>
          <Button asChild aria-label="X" variant="ghost" size="icon">
            <NextLink
              aria-label="X"
              href={`https://twitter.com/${env.NEXT_PUBLIC_X_USERNAME}`}
              target="_blank"
            >
              <Icon.X />
            </NextLink>
          </Button>
          <hr className="mx-4 hidden lg:block" />
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  )
}

export default Footer
