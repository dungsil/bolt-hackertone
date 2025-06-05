import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpenCheck, LayoutDashboard, Receipt, CreditCard, User, LogOut, Menu, X } from 'lucide-react';
import { currentUser } from '../data/mockData';
import { ModeToggle } from './mode-toggle';
import { LanguageToggle } from './LanguageToggle';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const Layout: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: t('common.dashboard'), icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/transactions', label: t('common.transactions'), icon: <Receipt className="h-5 w-5" /> },
    { path: '/accounts', label: t('common.accounts'), icon: <CreditCard className="h-5 w-5" /> },
    { path: '/profile', label: t('common.profile'), icon: <User className="h-5 w-5" /> },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
              <BookOpenCheck className="h-6 w-6" />
              <span className="text-xl">Pawqar</span>
            </Link>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="h-10 w-10"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
          
          <div className="hidden items-center gap-4 md:flex">
            <LanguageToggle />
            <ModeToggle />
            <div className="flex items-center gap-2">
              <Avatar>
                {currentUser.avatar ? (
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                ) : (
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium">{currentUser.name}</span>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <LogOut className="h-4 w-4" />
              <span>{t('common.logout')}</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={closeMobileMenu}>
          <div className="absolute right-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background p-4" onClick={e => e.stopPropagation()}>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-accent'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t pt-4">
              <div className="mb-2 flex items-center gap-2">
                <Avatar>
                  {currentUser.avatar ? (
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  ) : (
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm font-medium">{currentUser.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ModeToggle />
                <Button variant="outline" className="w-full justify-start gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>{t('common.logout')}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 border-r bg-background md:block">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-auto p-4">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </aside>
        
        {/* Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;