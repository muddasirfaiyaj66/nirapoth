import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-gradient-to-b from-muted/30 to-muted/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="NiraPoth"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
              </div>
              <span className="font-bold text-lg text-green-gradient">
                NiraPoth
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Making roads safer through technology and transparency
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="#"
                className="group text-muted-foreground hover:text-primary transition-all duration-300"
              >
                <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                  <Facebook className="h-5 w-5" />
                </div>
              </Link>
              <Link
                href="#"
                className="group text-muted-foreground hover:text-primary transition-all duration-300"
              >
                <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                  <Twitter className="h-5 w-5" />
                </div>
              </Link>
              <Link
                href="#"
                className="group text-muted-foreground hover:text-primary transition-all duration-300"
              >
                <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                  <Linkedin className="h-5 w-5" />
                </div>
              </Link>
              <Link
                href="#"
                className="group text-muted-foreground hover:text-primary transition-all duration-300"
              >
                <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                  <Mail className="h-5 w-5" />
                </div>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors duration-300"></div>
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors duration-300"></div>
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#stakeholders"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors duration-300"></div>
                  For Stakeholders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors duration-300"></div>
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors duration-300"></div>
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors duration-300"></div>
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary/60" />
                Email: info@nirapodpoth.gov.bd
              </li>
              <li className="text-muted-foreground flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  📞
                </span>
                Phone: +880 1234-567890
              </li>
              <li className="text-muted-foreground">
                Address: Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 NiraPoth (নিরাপথ). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
