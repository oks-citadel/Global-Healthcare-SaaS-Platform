'use client';

import React, { useState } from 'react';
import { DashboardBackground } from '../theme/UnifiedHealthBrightBackground';
import { BrandLogo } from '../brand/BrandLogo';
import Link from 'next/link';

/**
 * InteriorLayout
 *
 * Bright, clean layout for interior pages (dashboards, portals).
 * Features sidebar navigation and maximum readability.
 */

export interface InteriorLayoutProps {
  children: React.ReactNode;
  /** Active navigation item */
  activeNav?: string;
  /** User information */
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  /** Navigation items */
  navItems?: NavItem[];
  /** Portal type for styling */
  portalType?: 'patient' | 'provider' | 'admin';
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export function InteriorLayout({
  children,
  activeNav,
  user,
  navItems = [],
  portalType = 'patient',
}: InteriorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardBackground>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <InteriorSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeNav={activeNav}
          navItems={navItems}
          portalType={portalType}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
          {/* Top Navigation */}
          <InteriorTopNav
            onMenuClick={() => setSidebarOpen(true)}
            user={user}
          />

          {/* Page Content */}
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </DashboardBackground>
  );
}

/**
 * InteriorSidebar - Sidebar navigation for interior pages
 */
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeNav?: string;
  navItems: NavItem[];
  portalType: 'patient' | 'provider' | 'admin';
}

function InteriorSidebar({
  isOpen,
  onClose,
  activeNav,
  navItems,
  portalType,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 w-64 z-50
          bg-white border-r border-uh-slate-200
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-uh-slate-100">
          <BrandLogo variant="dark" size="sm" />
        </div>

        {/* Portal Badge */}
        <div className="px-6 py-3 border-b border-uh-slate-100">
          <span
            className={`
              text-[10px] uppercase tracking-widest font-medium
              ${portalType === 'admin' ? 'text-uh-indigo' : ''}
              ${portalType === 'provider' ? 'text-uh-cyan' : ''}
              ${portalType === 'patient' ? 'text-uh-teal' : ''}
            `}
          >
            {portalType} Portal
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
              isActive={activeNav === item.id}
            />
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-uh-slate-100">
          <Link
            href="/help"
            className="flex items-center gap-3 px-3 py-2 text-sm text-uh-slate-600 hover:text-uh-slate-900 hover:bg-uh-slate-50 rounded-lg transition-colors"
          >
            <HelpIcon />
            Help & Support
          </Link>
        </div>
      </aside>
    </>
  );
}

function SidebarNavItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`
        flex items-center justify-between px-3 py-2.5 rounded-lg
        text-sm font-medium transition-all duration-200
        focus-ring
        ${
          isActive
            ? 'bg-gradient-to-r from-uh-teal/10 to-uh-cyan/10 text-uh-teal border-l-2 border-uh-teal'
            : 'text-uh-slate-600 hover:text-uh-slate-900 hover:bg-uh-slate-50'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {item.icon && <span className="w-5 h-5">{item.icon}</span>}
        {item.label}
      </div>
      {item.badge && (
        <span className="bg-uh-teal/10 text-uh-teal text-xs px-2 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

/**
 * InteriorTopNav - Top navigation bar for interior pages
 */
interface TopNavProps {
  onMenuClick: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
}

function InteriorTopNav({ onMenuClick, user }: TopNavProps) {
  return (
    <header className="h-16 bg-white border-b border-uh-slate-200 sticky top-0 z-30">
      <div className="h-full flex items-center justify-between px-4 lg:px-8">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-uh-slate-500 hover:text-uh-slate-700 focus-ring rounded-lg"
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </button>

        {/* Search (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-lg">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-uh-slate-400" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-uh-slate-50 border border-uh-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-uh-teal/20 focus:border-uh-teal transition-all"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className="p-2 text-uh-slate-500 hover:text-uh-slate-700 focus-ring rounded-lg relative"
            aria-label="Notifications"
          >
            <BellIcon />
            <span className="absolute top-1 right-1 w-2 h-2 bg-uh-teal rounded-full" />
          </button>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-uh-slate-900">{user.name}</p>
                <p className="text-xs text-uh-slate-500">{user.role || user.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-uh-teal to-uh-cyan flex items-center justify-center text-white font-medium text-sm">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Icons
function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default InteriorLayout;
