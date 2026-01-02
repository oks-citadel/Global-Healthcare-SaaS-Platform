'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '../brand/BrandLogo';

/**
 * InteriorNavbar
 *
 * Standalone top navigation bar for interior pages.
 * Can be used independently of the full InteriorLayout.
 */

export interface InteriorNavbarProps {
  /** User information */
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  /** Show search bar */
  showSearch?: boolean;
  /** Show notifications */
  showNotifications?: boolean;
  /** Custom left content */
  leftContent?: React.ReactNode;
  /** Custom right content */
  rightContent?: React.ReactNode;
  /** On menu button click (for mobile) */
  onMenuClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function InteriorNavbar({
  user,
  showSearch = true,
  showNotifications = true,
  leftContent,
  rightContent,
  onMenuClick,
  className = '',
}: InteriorNavbarProps) {
  return (
    <header
      className={`
        h-16 bg-white border-b border-uh-slate-200
        sticky top-0 z-30
        ${className}
      `}
    >
      <div className="h-full flex items-center justify-between px-4 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 -ml-2 text-uh-slate-500 hover:text-uh-slate-700 focus-ring rounded-lg"
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </button>
          )}

          {/* Custom Left Content or Search */}
          {leftContent || (
            showSearch && (
              <div className="hidden lg:flex flex-1 max-w-lg">
                <SearchInput />
              </div>
            )
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {rightContent || (
            <>
              {/* Notifications */}
              {showNotifications && (
                <NotificationButton hasNotifications />
              )}

              {/* User Menu */}
              {user && <UserAvatar user={user} />}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/**
 * SearchInput - Search input component
 */
export function SearchInput({
  placeholder = 'Search...',
  onSearch,
  className = '',
}: {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-uh-slate-400" />
      <input
        type="search"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className="
          w-full pl-10 pr-4 py-2
          bg-uh-slate-50 border border-uh-slate-200 rounded-lg
          text-sm placeholder:text-uh-slate-400
          focus:outline-none focus:ring-2 focus:ring-uh-teal/20 focus:border-uh-teal
          transition-all
        "
      />
    </div>
  );
}

/**
 * NotificationButton - Notification bell button
 */
export function NotificationButton({
  hasNotifications = false,
  count,
  onClick,
}: {
  hasNotifications?: boolean;
  count?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-uh-slate-500 hover:text-uh-slate-700 focus-ring rounded-lg relative"
      aria-label={`Notifications${count ? ` (${count} unread)` : ''}`}
    >
      <BellIcon />
      {hasNotifications && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-uh-teal rounded-full animate-pulse" />
      )}
      {count && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-uh-teal text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

/**
 * UserAvatar - User avatar with menu
 */
export function UserAvatar({
  user,
  showInfo = true,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  showInfo?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 cursor-pointer group">
      {showInfo && (
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium text-uh-slate-900 group-hover:text-uh-teal transition-colors">
            {user.name}
          </p>
          <p className="text-xs text-uh-slate-500">{user.role || user.email}</p>
        </div>
      )}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-uh-teal to-uh-cyan flex items-center justify-center text-white font-medium text-sm shadow-glow-teal/30 group-hover:shadow-glow-teal transition-shadow">
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
  );
}

/**
 * Breadcrumb - Breadcrumb navigation
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({
  items,
  className = '',
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav className={`flex items-center gap-2 ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRightIcon className="w-4 h-4 text-uh-slate-300" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-sm text-uh-slate-500 hover:text-uh-teal transition-colors focus-ring rounded"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm text-uh-slate-900 font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/**
 * PageHeader - Page header with title and actions
 */
export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  className = '',
}: {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-8 ${className}`}>
      {breadcrumb && <Breadcrumb items={breadcrumb} className="mb-4" />}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-uh-slate-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-uh-slate-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
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

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default InteriorNavbar;
