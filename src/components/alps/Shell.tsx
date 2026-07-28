import { Header } from "./Header";
import { Footer } from "./Footer";
import { SizeInfoSection } from "./SizeInfoSection";
import { InnovationModal } from "./FabricTechnology";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <SizeInfoSection />
      <Footer />
      <InnovationModal />
    </div>
  );
}
