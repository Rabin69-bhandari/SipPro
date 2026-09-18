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

  const hasSubItems = item.subitems && item.subitems.length > 0


  // ─────────────────────────────────────────
  // ACTIVE ROUTE
  // ─────────────────────────────────────────

  const isActive = (url) => {
    if (!url) return false

    // Dashboard should only be active on exact route
    if (url === "/dashboard" || url === "/home") {
      return pathname === url
    }

    return pathname === url || pathname.startsWith(`${url}/`)
  }


  // ─────────────────────────────────────────
  // PARENT ACTIVE
  // ─────────────────────────────────────────

  const isParentActive = () => {
    if (item.href && isActive(item.href)) {
      return true
    }

    if (hasSubItems) {
      return item.subitems.some((subItem) =>
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

    const childIsActive = item.subitems.some((subItem) =>
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
  // COLLAPSED SIDEBAR ITEM
  // ─────────────────────────────────────────

  if (collapsed) {
    return (
      <SidebarMenuItem className="flex items-center justify-center">

        <SidebarMenuButton
          tooltip={item.title}
          render={
            <Link
              href={item.href}
              className={cn(
                "flex h-12 w-full items-center justify-center rounded-xl transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isParentActive()
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="size-8 shrink-0" />
            </Link>
          }
        />

      </SidebarMenuItem>
    )
  }


  // ─────────────────────────────────────────
  // EXPANDED SIDEBAR ITEM
  // ─────────────────────────────────────────

  return (
    <SidebarMenuItem>

      {hasSubItems ? (
        <>

          {/* Parent */}

          <SidebarMenuButton
            className={cn(
              "h-12 w-full rounded-xl px-3 transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
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


          {/* Sub Items */}

          {isOpen && (
            <div className="ml-6 mt-2 space-y-2 border-l border-sidebar-border pl-4">

              {item.subitems.map((subitem) => (
                <SidebarMenuButton
                  key={subitem.title}
                  render={
                    <Link
                      href={subitem.href}
                      className={cn(
                        "flex h-11 w-full items-center gap-3 rounded-lg px-3 text-[15px] transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive(subitem.href)
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
              ))}

            </div>
          )}

        </>
      ) : (

        // ─────────────────────────────────
        // NORMAL ITEM
        // ─────────────────────────────────

        <SidebarMenuButton
          render={
            <Link
              href={item.href}
              className={cn(
                "flex h-12 w-full items-center gap-4 rounded-xl px-3 transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
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

  const [isMobile, setIsMobile] = useState(false)

  const collapsed = state === "collapsed"


  // ─────────────────────────────────────────
  // MOBILE CHECK
  // ─────────────────────────────────────────

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 765)
    }

    checkMobile()

    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])


  return (
    <>

      {/* ─────────────────────────────────── */}
      {/* MOBILE OVERLAY */}
      {/* ─────────────────────────────────── */}

      {openMobile && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-xs md:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}


      {/* ─────────────────────────────────── */}
      {/* MOBILE OPEN BUTTON */}
      {/* ─────────────────────────────────── */}

      {!openMobile && (
        <button
          onClick={() => setOpenMobile(true)}
          className="fixed bottom-5 left-5 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-opacity hover:opacity-90 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-6" />
        </button>
      )}


      {/* ─────────────────────────────────── */}
      {/* SIDEBAR */}
      {/* ─────────────────────────────────── */}

      <Sidebar
        collapsible="icon"
        className="z-50 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
      >

        {/* ─────────────────────────────── */}
        {/* HEADER */}
        {/* ─────────────────────────────── */}

        <SidebarHeader className="w-full border-b border-sidebar-border px-3 py-5">

          <div className="flex w-full items-center gap-4">

            {/* Logo */}

            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground">
              K
            </div>


            {/* Brand */}

            {!collapsed && (
              <div className="min-w-0 flex-1">

                <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">
                  Kabil
                </h2>

                <p className="mt-1 truncate text-sm text-muted-foreground">
                  Prove what you know
                </p>

              </div>
            )}


            {/* Mobile close */}

            {!collapsed && isMobile && (
              <button
                onClick={() => setOpenMobile(false)}
                className="ml-auto flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            )}

          </div>

        </SidebarHeader>


        {/* ─────────────────────────────── */}
        {/* NAVIGATION */}
        {/* ─────────────────────────────── */}

        <SidebarContent className="w-full px-3 py-6">

          <SidebarGroup className="p-0">

            {/* Section title */}

            {!collapsed && (
              <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Career Journey
              </p>
            )}


            {/* Navigation */}

            <SidebarMenu
              className={
                collapsed
                  ? "space-y-4"
                  : "space-y-3"
              }
            >

              {navItems.map((item) => (
                <CollapsibleMenuItem
                  key={item.title}
                  item={item}
                  collapsed={collapsed}
                />
              ))}

            </SidebarMenu>

          </SidebarGroup>

        </SidebarContent>


        {/* ─────────────────────────────── */}
        {/* FOOTER */}
        {/* ─────────────────────────────── */}

        <SidebarFooter className="w-full border-t border-sidebar-border px-3 py-4">

          <div className="flex flex-col gap-2">

            {footerItems?.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-12 w-full items-center rounded-xl px-3 text-muted-foreground transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed
                    ? "justify-center"
                    : "gap-4"
                )}
              >

                <div className="shrink-0 [&>svg]:size-6">
                  {item.icons}
                </div>

                {!collapsed && (
                  <span className="text-[16px] font-medium">
                    {item.title}
                  </span>
                )}

              </Link>
            ))}

          </div>

        </SidebarFooter>

      </Sidebar>

    </>
  )
}