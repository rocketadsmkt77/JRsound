import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import About from "@/components/About";
import ConfiguratorTeaser from "@/components/ConfiguratorTeaser";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeatureCards />
      <About />
      <ConfiguratorTeaser />
      <Services />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}
