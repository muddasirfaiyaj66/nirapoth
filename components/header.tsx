"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { ThemeToggle } from "@/components/theme-toggle";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-border/50 bg-white dark:bg-background/80 backdrop-blur-xl shadow-sm dark:supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="NiraPoth"
              width={40}
              height={40}
              className="h-10 w-10 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-gradient">
              NiraPoth
            </span>
            <span className="text-lg text-muted-foreground font-medium">
              নিরাপথ
            </span>
          </div>
        </Link>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/#features"
            className="text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-green-100 dark:hover:bg-transparent px-3 py-2 rounded-md"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-green-100 dark:hover:bg-transparent px-3 py-2 rounded-md"
          >
            How It Works
          </Link>
          <Link
            href="/#stakeholders"
            className="text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-green-100 dark:hover:bg-transparent px-3 py-2 rounded-md"
          >
            For Stakeholders
          </Link>
          <Link
            href="/maps"
            className="text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-green-100 dark:hover:bg-transparent px-3 py-2 rounded-md"
          >
            Traffic Maps
          </Link>
          <ThemeToggle />
          {isAuthenticated && user && <NotificationDropdown />}
          {isAuthenticated && user ? (
            <DropdownMenu
              open={dropdownOpen}
              onOpenChange={(open) => {
                console.log("Dropdown state changed:", open);
                setDropdownOpen(open);
              }}
            >
              <DropdownMenuTrigger asChild>
                <div
                  className={`relative h-10 w-10 rounded-full hover:bg-green-100 dark:hover:bg-accent cursor-pointer flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg ${
                    dropdownOpen ? "bg-green-100 dark:bg-accent" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.profileImage || ""}
                      alt={user.firstName}
                    />
                    <AvatarFallback>
                      {user.firstName?.charAt(0)?.toUpperCase()}
                      {user.lastName?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 z-[9999] bg-background border shadow-lg"
                align="end"
                side="bottom"
                sideOffset={8}
                style={{ zIndex: 9999 }}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={async () => {
                    await logout();
                    window.location.href = "/";
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm" className="hover:bg-primary dark:text-white dark:border-white/60 dark:hover:bg-primary">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-white shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <Link
              href="/#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/#stakeholders"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Stakeholders
            </Link>
            <Link
              href="/maps"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Traffic Maps
            </Link>
            {isAuthenticated && user ? (
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.profileImage || ""}
                      alt={user.firstName}
                    />
                    <AvatarFallback>
                      {user.firstName?.charAt(0)?.toUpperCase()}
                      {user.lastName?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent text-red-600 border-red-200 hover:bg-red-50"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                      window.location.href = "/";
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
