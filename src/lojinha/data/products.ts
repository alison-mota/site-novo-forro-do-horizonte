export type ProductTag = "Novo" | "Promoção" | "Único Lote" | null;

export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  tag: ProductTag;
  swatchBg: string;
  description: string;
  images: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "oversized-solar",
    name: "Oversized Horizonte Solar",
    price: "R$ 89,90",
    category: "Oversized Masculina",
    tag: "Novo",
    swatchBg: "#ece4db",
    description:
      "Camiseta em 100% algodão sustentável de alta gramatura. Conforto e durabilidade com caimento moderno para o dia a dia.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDz0nXMKFbsUXEyF3iyADkZiB9N9f8bfjjWgOHwuzP9XaTbNxKe90VAbVJYvjgHg8xEsIS80208dAEFdovS7i8ycUxt4B_CkwVveTZy81pn-PXGFqE1K7KHV73oEjhZQtq_R_nTLNVqEF6pFA2aKInoRPxOCahxNdzsH5xlRk8NYCqJTjUwd9b3stTmrxbwUVZvxFaDMVgzw3Sg3_KwRKp0cbFx_ljjBbVSxxOgvq3VDoywwn2U6AIpxYAwiIiiDfdJhqnYOkJfpf4",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJK7OnrtjX8OM0HjmxZ6_y0SX47yCH7Tep16BYbqIEA_4_qOMOtkshq14ODIw-g253JfANvWxmZNdE5FWYfjC4sJznCH6QsaOZ3W3P-7ANeii5MJlZdF8HCsilPqjzR_whW3M7_yj35LeLdcud5aCZPkJMrvNWyXziZoD5GK0x2XYYM_1TNnzYOTXp0YANzjR95v177z91i0QBz8QHb3EmOCiPA25h3azg53EVDAfVMoCyW8KWkWG461Qw7Oa3RS5ZOCbVVsN2MA4",
    ],
  },
  {
    id: "babyl-klassica",
    name: "Baby Look Forró Clássica",
    price: "R$ 64,90",
    category: "Baby Look",
    tag: "Promoção",
    swatchBg: "#e6ebef",
    description:
      "Modelo leve com toque macio e excelente respirabilidade para o uso em shows, ensaios e dia a dia.",
    images: [],
  },
  {
    id: "basica-areia",
    name: "Básica Unissex Areia",
    price: "R$ 59,90",
    category: "Básica Unissex",
    tag: null,
    swatchBg: "#ece8e0",
    description:
      "Modelagem versátil e atemporal com tecido confortável, ideal para compor looks casuais em qualquer estação.",
    images: [],
  },
  {
    id: "regata-sertao",
    name: "Regata Ritmo do Sertão",
    price: "R$ 72,90",
    category: "Regata",
    tag: "Único Lote",
    swatchBg: "#e9e2d8",
    description:
      "Regata de alta mobilidade com acabamento reforçado para quem busca performance e estilo no calor.",
    images: [],
  },
  {
    id: "polo-premium",
    name: "Polo Horizonte Premium",
    price: "R$ 99,90",
    category: "Polo",
    tag: "Novo",
    swatchBg: "#e3e7ea",
    description:
      "Polo premium com acabamento refinado e presença marcante para ocasiões que pedem um visual mais alinhado.",
    images: [],
  },
  {
    id: "oversized-noite",
    name: "Oversized Noite de Forró",
    price: "R$ 92,90",
    category: "Oversized Masculina",
    tag: null,
    swatchBg: "#e7e1d9",
    description:
      "Corte amplo e contemporâneo com malha encorpada para quem prioriza conforto e identidade visual.",
    images: [],
  },
];
