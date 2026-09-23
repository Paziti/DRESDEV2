import { SelectionProvider } from "@/lib/selection-context";
import { SiteHeader } from "@/components/dresde/site-header";
import { HeroSceneTransition } from "@/components/dresde/hero-scene-transition";
import { LocationsExperience } from "@/components/dresde/locations-experience";
import { Gallery } from "@/components/dresde/gallery";
import { DresdeFooter } from "@/components/dresde/dresde-footer";

export default function Home() {
  return (
    <SelectionProvider>
      <SiteHeader />
      <main id="top">
        <HeroSceneTransition />
        <div id="contenido">
          <LocationsExperience />
        </div>
        <Gallery />
      </main>
      <DresdeFooter />
    </SelectionProvider>
  );
}
