import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-emerald-900 border-t border-gray-200 dark:border-emerald-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="NiraPoth"
                    width={40}
                    height={40}
                    className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent">
                  NiraPoth
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 dark:text-white/80 leading-relaxed max-w-xs">
              Making roads safer through technology and transparency
            </p>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <Link href="#" className="group" aria-label="Facebook">
                <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-emerald-800 hover:bg-gray-200 dark:hover:bg-emerald-700 transition-all duration-300 group-hover:scale-110">
                  <Facebook className="h-4 w-4 text-gray-700 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors" />
                </div>
              </Link>
              <Link href="#" className="group" aria-label="Twitter">
                <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-emerald-800 hover:bg-gray-200 dark:hover:bg-emerald-700 transition-all duration-300 group-hover:scale-110">
                  <Twitter className="h-4 w-4 text-gray-700 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors" />
                </div>
              </Link>
              <Link href="#" className="group" aria-label="LinkedIn">
                <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-emerald-800 hover:bg-gray-200 dark:hover:bg-emerald-700 transition-all duration-300 group-hover:scale-110">
                  <Linkedin className="h-4 w-4 text-gray-700 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors" />
                </div>
              </Link>
              <Link href="#" className="group" aria-label="Email">
                <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-emerald-800 hover:bg-gray-200 dark:hover:bg-emerald-700 transition-all duration-300 group-hover:scale-110">
                  <Mail className="h-4 w-4 text-gray-700 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors" />
                </div>
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-6 font-semibold text-gray-900 dark:text-white text-base">
              Product
            </h3>
            <ul className="space-y-3.5">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 group-hover:bg-emerald-700 dark:group-hover:bg-emerald-300 transition-colors duration-200"></div>
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 group-hover:bg-emerald-700 dark:group-hover:bg-emerald-300 transition-colors duration-200"></div>
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#stakeholders"
                  className="text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 group-hover:bg-emerald-700 dark:group-hover:bg-emerald-300 transition-colors duration-200"></div>
                  For Stakeholders
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 group-hover:bg-emerald-700 dark:group-hover:bg-emerald-300 transition-colors duration-200"></div>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-6 font-semibold text-gray-900 dark:text-white text-base">
              Resources
            </h3>
            <ul className="space-y-3.5">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 group-hover:bg-emerald-700 dark:group-hover:bg-emerald-300 transition-colors duration-200"></div>
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 group-hover:bg-emerald-700 dark:group-hover:bg-emerald-300 transition-colors duration-200"></div>
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 group-hover:bg-emerald-700 dark:group-hover:bg-emerald-300 transition-colors duration-200"></div>
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 group-hover:bg-emerald-700 dark:group-hover:bg-emerald-300 transition-colors duration-200"></div>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="mb-6 font-semibold text-gray-900 dark:text-white text-base">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@nirapodpoth.gov.bd"
                  className="text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-start gap-3 group"
                >
                  <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="break-all">info@nirapodpoth.gov.bd</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801234567890"
                  className="text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-3 group"
                >
                  <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>+880 1234-567890</span>
                </a>
              </li>
              <li className="text-sm text-gray-700 dark:text-white/70 flex items-start gap-3">
                <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-emerald-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-white/60 text-center md:text-left">
              &copy; {new Date().getFullYear()} NiraPoth (নিরাপথ). All rights
              reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="#"
                className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
