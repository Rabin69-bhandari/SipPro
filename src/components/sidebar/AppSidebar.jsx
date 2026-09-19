"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"

import { footerItems, navItems } from "./sidebar-datatypes"
import { cn } from "cn"


// ─────────────────────────────────────────────
// MENU ITEM
// ─────────────────────────────────────────────

function CollapsibleMenuItem({ item, collapsed }) {
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)

  const hasSubItems =
    item.subitems &&
    item.subitems.length > 0


  // ─────────────────────────────────────────
  // ACTIVE ROUTE
  // ─────────────────────────────────────────

  const isActive = (url) => {
    if (!url) return false

    if (
      url === "/dashboard" ||
      url === "/home"
    ) {
      return pathname === url
    }

    return (
      pathname === url ||
      pathname.startsWith(`${url}/`)
    )
  }


  // ─────────────────────────────────────────
  // PARENT ACTIVE
  // ─────────────────────────────────────────

  const isParentActive = () => {
    if (
      item.href &&
      isActive(item.href)
    ) {
      return true
    }

    if (hasSubItems) {
      return item.subitems.some(
        (subItem) =>
          isActive(subItem.href)
      )
    }

    return false
  }


  // ─────────────────────────────────────────
  // AUTO OPEN ACTIVE SUBMENU
  // ─────────────────────────────────────────

  useEffect(() => {
    if (!hasSubItems) return

    const childIsActive =
      item.subitems.some(
        (subItem) =>
          isActive(subItem.href)
      )

    if (childIsActive) {
      setIsOpen(true)
    }
  }, [pathname])


  // ─────────────────────────────────────────
  // TOGGLE SUBMENU
  // ─────────────────────────────────────────

  const handleToggle = () => {
    if (!collapsed) {
      setIsOpen((prev) => !prev)
    }
  }


  // ─────────────────────────────────────────
  // COLLAPSED ITEM
  // ─────────────────────────────────────────

  if (collapsed) {
    return (
      <SidebarMenuItem className="flex w-full items-center justify-center">

        <SidebarMenuButton
          tooltip={item.title}
          className="flex h-11 w-full items-center justify-center p-0"
          render={
            <Link
              href={item.href}
              className={cn(
                "flex size-11 items-center justify-center rounded-xl transition-colors duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isParentActive()
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="size-5 shrink-0" />
            </Link>
          }
        />

      </SidebarMenuItem>
    )
  }


  // ─────────────────────────────────────────
  // EXPANDED ITEM
  // ─────────────────────────────────────────

  return (
    <SidebarMenuItem>

      {hasSubItems ? (
        <>

          <SidebarMenuButton
            className={cn(
              "h-12 w-full rounded-xl px-3 transition-colors duration-200",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isParentActive()
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-muted-foreground"
            )}
          >

            <div
              onClick={handleToggle}
              className="flex h-full w-full cursor-pointer items-center gap-4"
            >

              <item.icon className="size-6 shrink-0" />

              <span className="flex w-full items-center justify-between text-[16px] font-medium">

                {item.title}

                {isOpen ? (
                  <ChevronDown className="size-5 shrink-0" />
                ) : (
                  <ChevronRight className="size-5 shrink-0" />
                )}

              </span>

            </div>

          </SidebarMenuButton>


          {isOpen && (
            <div className="ml-6 mt-2 space-y-2 border-l border-sidebar-border pl-4">

              {item.subitems.map(
                (subitem) => (
                  <SidebarMenuButton
                    key={subitem.title}
                    render={
                      <Link
                        href={subitem.href}
                        className={cn(
                          "flex h-11 w-full items-center gap-3 rounded-lg px-3 text-[15px]",
                          "transition-colors duration-200",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive(
                            subitem.href
                          )
                            ? "bg-secondary font-medium text-secondary-foreground"
                            : "text-muted-foreground"
                        )}
                      >

                        <subitem.icon className="size-5 shrink-0" />

                        <span>
                          {subitem.title}
                        </span>

                      </Link>
                    }
                  />
                )
              )}

            </div>
          )}

        </>
      ) : (

        <SidebarMenuButton
          render={
            <Link
              href={item.href}
              className={cn(
                "flex h-12 w-full items-center gap-4 rounded-xl px-3",
                "transition-colors duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isParentActive()
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-muted-foreground"
              )}
            >

              <item.icon className="size-6 shrink-0" />

              <span className="text-[16px] font-medium">
                {item.title}
              </span>

            </Link>
          }
        />

      )}

    </SidebarMenuItem>
  )
}



// ─────────────────────────────────────────────
// MAIN SIDEBAR
// ─────────────────────────────────────────────

export function AppSidebar() {

  const {
    state,
    openMobile,
    setOpenMobile,
  } = useSidebar()

  const [isMobile, setIsMobile] =
    useState(false)

  const collapsed =
    state === "collapsed"


  // ─────────────────────────────────────────
  // MOBILE CHECK
  // ─────────────────────────────────────────

  useEffect(() => {

    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 765
      )
    }

    checkMobile()

    window.addEventListener(
      "resize",
      checkMobile
    )

    return () => {
      window.removeEventListener(
        "resize",
        checkMobile
      )
    }

  }, [])


  return (
    <>

      {/* MOBILE OVERLAY */}

      {openMobile && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-xs md:hidden"
          onClick={() =>
            setOpenMobile(false)
          }
        />
      )}


      {/* MOBILE OPEN BUTTON */}

      {!openMobile && (
        <button
          onClick={() =>
            setOpenMobile(true)
          }
          className="fixed bottom-5 left-5 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-opacity hover:opacity-90 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-6" />
        </button>
      )}


      {/* SIDEBAR */}

      <Sidebar
        collapsible="icon"
        className="z-50 flex flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
      >


        {/* ───────────────────────────── */}
        {/* HEADER */}
        {/* ───────────────────────────── */}

        <SidebarHeader
          className={cn(
            "w-full shrink-0 border-b border-sidebar-border py-4 transition-[padding] duration-200",
            collapsed
              ? "px-1"
              : "px-3"
          )}
        >

          <div
            className={cn(
              "flex w-full items-center",
              collapsed
                ? "justify-center"
                : "gap-3"
            )}
          >

            {/* SIP LOGO */}

            <Link
              href="/home"
              className="flex shrink-0 items-center justify-center"
            >

              <div
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground transition-all duration-200",
                  collapsed
                    ? "size-10 text-sm"
                    : "size-11 text-base"
                )}
              >
                S
              </div>

            </Link>


            {/* BRAND */}

            {!collapsed && (
              <div className="min-w-0 flex-1">

                <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">
                  Sip
                </h2>

                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  Prove what you know
                </p>

              </div>
            )}


            {/* MOBILE CLOSE */}

            {!collapsed &&
              isMobile && (
                <button
                  onClick={() =>
                    setOpenMobile(false)
                  }
                  className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              )}

          </div>

        </SidebarHeader>


        {/* ───────────────────────────── */}
        {/* NAVIGATION */}
        {/* ───────────────────────────── */}

        <SidebarContent
          className={cn(
            "w-full overflow-x-hidden py-6 transition-[padding] duration-200",
            collapsed
              ? "px-1"
              : "px-3"
          )}
        >

          <SidebarGroup className="w-full p-0">

            {!collapsed && (
              <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Career Journey
              </p>
            )}


            <SidebarMenu
              className={cn(
                "w-full",
                collapsed
                  ? "space-y-3"
                  : "space-y-3"
              )}
            >

              {navItems.map(
                (item) => (
                  <CollapsibleMenuItem
                    key={item.title}
                    item={item}
                    collapsed={
                      collapsed
                    }
                  />
                )
              )}

            </SidebarMenu>

          </SidebarGroup>

        </SidebarContent>


        {/* ───────────────────────────── */}
        {/* FOOTER */}
        {/* ───────────────────────────── */}

        <SidebarFooter
          className={cn(
            "w-full shrink-0 border-t border-sidebar-border py-4 transition-[padding] duration-200",
            collapsed
              ? "px-1"
              : "px-3"
          )}
        >

          <div
            className={cn(
              "flex w-full flex-col gap-2",
              collapsed &&
                "items-center"
            )}
          >

            {footerItems?.map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  title={
                    collapsed
                      ? item.title
                      : undefined
                  }
                  className={cn(
                    "flex h-12 items-center rounded-xl text-muted-foreground",
                    "transition-colors duration-200",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",

                    collapsed
                      ? "w-11 justify-center px-0"
                      : "w-full gap-4 px-3"
                  )}
                >

                  <div className="flex shrink-0 items-center justify-center [&>svg]:size-6">
                    {item.icons}
                  </div>

                  {!collapsed && (
                    <span className="text-[16px] font-medium">
                      {item.title}
                    </span>
                  )}

                </Link>
              )
            )}

          </div>

        </SidebarFooter>

      </Sidebar>

    </>
  )
}