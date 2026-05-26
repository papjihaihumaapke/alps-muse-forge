import silverIon from "@/assets/fabric-tech/silver-ion.jpg";
import antiBacteria from "@/assets/fabric-tech/anti-bacteria.jpg";
import antiOdor from "@/assets/fabric-tech/anti-odor.jpg";
import antiStatic from "@/assets/fabric-tech/anti-static.jpg";
import spfUv from "@/assets/fabric-tech/spf-uv50.jpg";
import selfCleaning from "@/assets/fabric-tech/self-cleaning.jpg";
import instantHeat from "@/assets/fabric-tech/instant-heat.jpg";
import farInfrared from "@/assets/fabric-tech/far-infrared.jpg";
import breathable from "@/assets/fabric-tech/breathable.jpg";
import quickDry from "@/assets/fabric-tech/quick-dry.jpg";
import waterRepellent from "@/assets/fabric-tech/water-repellent.jpg";
import selfAdhesive from "@/assets/fabric-tech/self-adhesive.jpg";

const features = [
  { label: "Silver Ion – Kills 99% bacteria", src: silverIon },
  { label: "Anti-bacteria", src: antiBacteria },
  { label: "Anti-odor", src: antiOdor },
  { label: "Anti-static", src: antiStatic },
  { label: "SPF UV 50+", src: spfUv },
  { label: "Light induced self-cleaning", src: selfCleaning },
  { label: "Instant heat", src: instantHeat },
  { label: "Far infrared light", src: farInfrared },
  { label: "Breathable", src: breathable },
  { label: "Quick dry", src: quickDry },
  { label: "Water repellent", src: waterRepellent },
  { label: "Permanent soft fabric self adhesive", src: selfAdhesive },
];

export function FabricTechnology() {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Textile Science</p>
        <h2 className="text-3xl md:text-4xl font-light tracking-tight">Engineered fabric technology</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
        {features.map((f) => (
          <div key={f.label} className="flex flex-col">
            <p className="text-sm leading-snug mb-3 min-h-[2.5rem]">{f.label}</p>
            <div className="border-t border-border pt-3">
              <img
                src={f.src}
                alt={f.label}
                loading="lazy"
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
