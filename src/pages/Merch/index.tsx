import { useMemo, useRef } from "react";
import MerchFaq from "../../components/sections/merch/MerchFaq";
import MerchFooter from "../../components/sections/merch/MerchFooter";
import MerchHero from "../../components/sections/merch/MerchHero";
import MerchNav from "../../components/sections/merch/MerchNav";
import ProductDetail from "../../components/sections/merch/ProductDetail";
import PurposeSection from "../../components/sections/merch/PurposeSection";
import StyleCarousel from "../../components/sections/merch/StyleCarousel";
import styles from "./Merch.module.css";
import { useMerchScroll } from "./useMerchScroll";

export default function MerchPage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const styleRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const purposeRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useMemo(
    () => [heroRef, styleRef, detailRef, purposeRef, faqRef],
    [],
  );
  const wrapperRef = useMerchScroll(sectionRefs);

  return (
    <div ref={wrapperRef} className={`${styles.merchRoot} ${styles.snapRoot}`}>
      <MerchNav />
      <main className={styles.main}>
        <div ref={heroRef}>
          <MerchHero />
        </div>
        <div ref={styleRef}>
          <StyleCarousel />
        </div>
        <div ref={detailRef}>
          <ProductDetail />
        </div>
        <div ref={purposeRef}>
          <PurposeSection />
        </div>
        <div ref={faqRef}>
          <MerchFaq />
        </div>
      </main>
      <MerchFooter />
    </div>
  );
}
