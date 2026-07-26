import { Header } from "./Header";
import { Footer } from "./Footer";
import { SizeInfoSection } from "./SizeInfoSection";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <SizeInfoSection />
      <Footer />
    </div>
  );
}

