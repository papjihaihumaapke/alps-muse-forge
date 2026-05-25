import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag, Globe } from "lucide-react";
import logoBlack from "@/assets/alps-logo-black.png";

const NAV = [
  { to: "/innovation", label: "alps innovation" },
  { to: "/contemporary", label: "alps contemporary" },
  { to: "/accessories", label: "alps accessories" },
  { to: "/collaborations", label: "alps collaborations" },
  { to: "/personal-care", label: "alps vegan skin & personal care" },
  { to: "/my-journey", label: "my journey" },
  { to: "/press", label: "press" },
  { to: "/contact", label: "contact" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
      <div className="mx-auto flex h-16 items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logoBlack} alt="ALPS Annie Ling" className="h-7 w-auto" />
        </Link>

        <nav className="hidden xl:flex items-center gap-6 text-[12px] tracking-wide">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="link-red text-foreground/80 hover:text-foreground"
              activeProps={{ className: "link-red text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-foreground">
          <button aria-label="search" className="hover:text-primary transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <Link to="/account" aria-label="account" className="hover:text-primary transition-colors">
            <User className="h-4 w-4" />
          </Link>
          <button aria-label="language" className="hidden md:flex items-center gap-1 text-[11px] hover:text-primary transition-colors">
            <Globe className="h-4 w-4" /> eng / 中文
          </button>
          <Link to="/cart" aria-label="cart" className="relative hover:text-primary transition-colors">
            <ShoppingBag className="h-4 w-4" />
            <span className="num absolute -top-2 -right-3 text-[10px] bg-primary text-primary-foreground px-1">0</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
