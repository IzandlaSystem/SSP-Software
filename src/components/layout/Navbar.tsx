'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, Menu, X, Cpu, ChevronRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();

  const navLinks = React.useMemo(() => [
    { name: 'Product', href: '/product' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Technology', href: '/technology' },
    { name: 'Contact', href: '/contact' },
  ], []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  React.useEffect(() => {
    navLinks.forEach((link) => router.prefetch(link.href));
    router.prefetch('/login');
  }, [navLinks, router]);

  return (
    <header className="marketing-navbar sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="marketing-navbar__brand flex items-center space-x-2.5 group">
            <div className="marketing-navbar__mark bg-[#0A0A0A] text-white p-2 rounded-lg transition-all duration-300 group-hover:scale-105">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="marketing-navbar__wordmark text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                SSP <span className="text-brand-blue font-extrabold text-xs ml-1 uppercase">Pro</span>
              </span>
              <span className="marketing-navbar__tagline text-[9px] text-zinc-500 font-bold">Smart Sports Platform</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-1 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`marketing-navbar__link px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Theme Toggles */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'performance' : 'light')}
            className="marketing-navbar__icon-button p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-all cursor-pointer"
            title="Switch Theme"
          >
            <Cpu className={`h-4 w-4 ${theme === 'performance' ? 'text-brand-blue' : ''}`} />
          </button>
          <Link
            href="/login"
            className="marketing-navbar__cta flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#0A0A0A] hover:bg-[#1F2937] text-white shadow-sm transition-all"
          >
            <span>Launch Demo</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'performance' : 'light')}
            className="marketing-navbar__icon-button p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
          >
            <Cpu className="h-4 w-4" />
          </button>
          <button
            onClick={toggleMobileMenu}
            className="marketing-navbar__icon-button p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="marketing-navbar__mobile lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col space-y-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 text-sm font-bold rounded-lg bg-[#0A0A0A] text-white shadow-sm"
            >
              Launch Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
