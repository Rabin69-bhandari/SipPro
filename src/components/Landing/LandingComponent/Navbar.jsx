"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Events", href: "#events" },
  { label: "About Us", href: "#about" },
  { label: "Contact Us", href: "#contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="
        absolute
        inset-x-0
        top-0
        z-50
        border-b
        border-border/40
        bg-card/95
        backdrop-blur-md
      "
    >
      <nav
        className="
          mx-auto
          flex
          h-[72px]
          max-w-[1400px]
          items-center
          justify-between
          px-5
          sm:px-8
          lg:px-12
          xl:px-14
        "
      >
        {/* LOGO */}
        <Link
          href="/"
          className="
            flex
            items-center
            text-[23px]
            font-semibold
            tracking-tight
            text-primary
            sm:text-[24px]
            lg:text-[26px]
          "
        >
          LearnChen

          <svg
            viewBox="0 0 24 24"
            className="
              ml-1
              h-5
              w-5
              fill-current
              lg:h-[22px]
              lg:w-[22px]
            "
            aria-hidden="true"
          >
            <path d="M21.4 2.8C14.9 3 8.2 5.1 5.1 10.1c-1.5 2.4-1.6 5-.4 7.2 2.2-3.7 5.4-6.4 9.4-8.3-3.3 2.5-5.8 5.6-7.4 9.3 2.5 1 5.3.4 7.5-1.4 4.1-3.4 5.8-9.3 7.2-14.1Z" />
          </svg>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div
          className="
            hidden
            items-center
            gap-7
            lg:flex
            xl:gap-8
          "
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="
                relative
                text-[14px]
                font-medium
                tracking-[0.01em]
                text-foreground
                transition-colors
                duration-200
                hover:text-primary
              "
            >
              {link.label}
            </Link>
          ))}

          {/* LOGIN */}
          <Link
            href="/sign-in"
            className="
              ml-1
              rounded-lg
              bg-primary
              px-6
              py-2.5
              text-[14px]
              font-medium
              text-primary-foreground
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-primary/90
              hover:shadow-md
            "
          >
            Login
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="
            flex
            h-9
            w-9
            flex-col
            items-center
            justify-center
            gap-[4px]
            rounded-lg
            border
            border-border
            bg-card
            transition-colors
            duration-200
            hover:bg-accent
            lg:hidden
          "
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`
              h-[1.5px]
              w-[18px]
              bg-primary
              transition-transform
              duration-300
              ${
                menuOpen
                  ? "translate-y-[5.5px] rotate-45"
                  : ""
              }
            `}
          />

          <span
            className={`
              h-[1.5px]
              w-[18px]
              bg-primary
              transition-opacity
              duration-300
              ${menuOpen ? "opacity-0" : ""}
            `}
          />

          <span
            className={`
              h-[1.5px]
              w-[18px]
              bg-primary
              transition-transform
              duration-300
              ${
                menuOpen
                  ? "-translate-y-[5.5px] -rotate-45"
                  : ""
              }
            `}
          />
        </button>
      </nav>

      {/* MOBILE NAVIGATION */}
      {menuOpen && (
        <div
          className="
            mx-5
            rounded-xl
            border
            border-border
            bg-card
            p-3
            shadow-xl
            sm:mx-8
            lg:hidden
          "
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="
                  rounded-lg
                  px-4
                  py-2.5
                  text-[14px]
                  font-medium
                  text-foreground
                  transition-colors
                  duration-200
                  hover:bg-accent
                  hover:text-accent-foreground
                "
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="
                mt-2
                rounded-lg
                bg-primary
                px-4
                py-2.5
                text-center
                text-[14px]
                font-medium
                text-primary-foreground
                transition-colors
                duration-200
                hover:bg-primary/90
              "
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;