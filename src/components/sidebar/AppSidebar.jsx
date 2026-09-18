
"use client"

import { useState,useEffect } from "react"
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

import { ChevronDown, ChevronRight, Menu,X } from "lucide-react"
import { footerItems, navItems } from "./sidebar-datatypes"
import { cn } from "cn"


function CollapsibleMenuItem({ item, collapsed }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const hasSubItems =
        item.subitems && item.subitems.length > 0

    // Checks whether a URL belongs to the current route
    const isActive = (url) => {
        if (!url) return false

        // Home should only be active on the exact /home route
        if (url === "/home") {
            return pathname === url
        }

        return (
            pathname === url ||
            pathname.startsWith(`${url}/`)
        )
    }

    // A parent is active if:
    // 1. Its own URL is active
    // 2. One of its subitems is active
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

    const handleToggle = () => {
        if (!collapsed) {
            setIsOpen((previousState) => !previousState)
        }
    }

    // ─────────────────────────────────────────
    // COLLAPSED SIDEBAR
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
                                "flex h-12 w-full items-center justify-center rounded-xl px-3 transition-all duration-200 hover:bg-accent hover:scale-105",
                                isParentActive() ?
                                "bg-primary/10 text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="size-6! shrink-0" />
                        </Link>
                    }
                />
            </SidebarMenuItem>
        )
    }

    // ─────────────────────────────────────────
    // EXPANDED SIDEBAR
    // ─────────────────────────────────────────

    return (
        <SidebarMenuItem>
            {hasSubItems ? (
                <>
                    {/* Parent Item */}

                    <SidebarMenuButton
                        className={cn(
                            "h-12 w-full rounded-xl px-3 transition-all duration-200 hover:bg-accent",
                            isParentActive() ?
                                "bg-primary/10 text-primary" : "text-muted-foreground"
                        )}
                    >
                        <div
                            onClick={handleToggle}
                            className="flex h-full w-full cursor-pointer items-center gap-5"
                        >
                            <item.icon className="size-7 shrink-0" />

                            <span className="flex w-full items-center justify-between text-lg font-semibold">
                                {item.title}

                                {isOpen ? (
                                    <ChevronDown className="size-5" />
                                ) : (
                                    <ChevronRight className="size-5" />
                                )}
                            </span>
                        </div>
                    </SidebarMenuButton>

                    {/* Sub Items */}

                    {isOpen && (
                        <div className="ml-6 mt-2 space-y-1 border-l border-border pl-3">
                            {item.subitems.map((subitem) => (
                                <SidebarMenuButton
                                    key={subitem.title}
                                    render={
                                        <Link
                                            href={subitem.href}
                                            className={cn(
                                                "flex h-10 w-full items-center gap-4 rounded-lg px-3 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground",
                                                isActive(subitem.href) &&
                                                "bg-primary/10 text-primary"
                                            )}
                                        >
                                            <subitem.icon className="size-4 shrink-0" />

                                            <span className="text-sm font-medium">
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
                /* Normal Item */

                <SidebarMenuButton
                    render={
                        <Link
                            href={item.href}
                            className={cn(
                                "flex h-12 w-full items-center gap-5 rounded-xl px-3 transition-all duration-200 hover:bg-accent",
                                isParentActive() ?
                                    "bg-primary/10 text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="size-7 shrink-0" />

                            <span className="text-lg font-semibold">
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
    const { state, openMobile, setOpenMobile } = useSidebar()
    const [isMobile, setIsMobile] = useState(false)
    const collapsed = state === "collapsed"


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

            {/* Mobile Overlay */}
            {openMobile && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setOpenMobile(false)}
                />
            )}

            {/* Mobile Trigger Button */}
            {!openMobile && (
                <button
                    onClick={() => setOpenMobile(true)}
                    className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:hidden"
                    aria-label="Open menu"
                >
                    <Menu className="h-7 w-7" />
                </button>
            )}



            <Sidebar
                collapsible="icon"
                className="z-50 flex flex-col items-center border-r bg-background p-2 py-6"
            >


                <SidebarHeader className="flex w-full items-center justify-between border-b-2 pb-6">
                    <div className="flex items-center gap-5">
                        {/* Logo */}

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
                            LC
                        </div>

                        {/* Brand */}

                        {!collapsed && (
                            <div className="leading-tight">
                                <h2 className="text-xl font-bold">
                                    LearnChen
                                </h2>

                                <p className="mt-1 text-sm font-medium text-muted-foreground">
                                    Your learning partner
                                </p>
                            </div>
                        )}

                        {/* Close button for mobile */}
                        {!collapsed && isMobile && (
                            <button
                                onClick={() => setOpenMobile(false)}
                                className="ml-auto rounded-md p-1 hover:bg-accent md:hidden"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        )}
                    </div>
                </SidebarHeader>


                {/* ─────────────────────────────────────
          NAVIGATION
      ───────────────────────────────────── */}

                <SidebarContent className="w-full py-6">
                    <SidebarGroup className="p-0" />

                    <SidebarMenu
                        className={collapsed ? "space-y-6" : "space-y-3"}
                    >
                        {navItems.map((item) => (
                            <CollapsibleMenuItem
                                key={item.title}
                                item={item}
                                collapsed={collapsed}
                            />
                        ))}
                    </SidebarMenu>

                    <SidebarGroup className="p-0" />
                </SidebarContent>


                <SidebarFooter className="w-full border-t-2">
                    <div className="flex flex-col items-center gap-3 py-5">
                        {footerItems?.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex h-11 w-full items-center gap-5 rounded-xl px-3 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
                                )}
                            >
                                <div className="shrink-0">
                                    {item.icons}
                                </div>

                                {!collapsed && (
                                    <h2 className="text-base font-semibold">
                                        {item.title}
                                    </h2>
                                )}
                            </Link>
                        ))}
                    </div>
                </SidebarFooter>
            </Sidebar>

        </>
    )
}

