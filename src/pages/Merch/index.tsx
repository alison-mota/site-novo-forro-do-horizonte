import MerchFaq from "../../components/sections/merch/MerchFaq";
import MerchFooter from "../../components/sections/merch/MerchFooter";
import MerchHero from "../../components/sections/merch/MerchHero";
import MerchNav from "../../components/sections/merch/MerchNav";
import ProductDetail from "../../components/sections/merch/ProductDetail";
import PurposeSection from "../../components/sections/merch/PurposeSection";
import StyleCarousel from "../../components/sections/merch/StyleCarousel";
import styles from "./Merch.module.css";

export default function MerchPage() {
  return (
    <div className={styles.merchRoot}>
      <MerchNav />
      <main className={styles.main}>
        <MerchHero />
        <StyleCarousel />
        <ProductDetail />
        <PurposeSection />
        <MerchFaq />
      </main>
      <MerchFooter />
    </div>
  );
}
