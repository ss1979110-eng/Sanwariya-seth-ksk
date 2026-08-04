import { Product, SaleTransaction, AdminSettings, CategoryInfo } from '../types';

export const INITIAL_SETTINGS: AdminSettings = {
  adminPin: '1234',
  shopName: 'Kisan Krishi Kendra & Agri Center',
  tagline: 'Quality Seeds, High-Yield Fertilizers & Trusted Crop Protection',
  phone: '+91 98765 43210',
  address: 'Main Grain Market Road, Agri Hub Sector 4',
  currencySymbol: '₹',
  lowStockThreshold: 15,
};

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'fertilizers',
    name: 'Fertilizers (खाद)',
    description: 'Macro & Micronutrients, Urea, DAP, NPK Complexes, Bio-fertilizers & Soil Conditioners',
    iconName: 'Sprout',
    color: 'emerald',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'pesticides',
    name: 'Pesticides & Insecticides (कीटनाशक)',
    description: 'Insecticides, Fungicides, Herbicides & Bio-pesticides for Crop Health Protection',
    iconName: 'ShieldAlert',
    color: 'rose',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  {
    id: 'seeds',
    name: 'Seeds (बीज)',
    description: 'High-Yield Hybrid Grains, Pulses, Vegetable Seeds, Oilseeds & Fodder Crops',
    iconName: 'Wheat',
    color: 'amber',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'other',
    name: 'Tools & Bio-Stimulants (अन्य)',
    description: 'Knapsack Sprayers, Growth Regulators, Micronutrient Sprays & Drip Accessories',
    iconName: 'Wrench',
    color: 'blue',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // FERTILIZERS
  {
    id: 'fert-01',
    name: 'Neem Coated Urea (50kg)',
    category: 'fertilizers',
    unit: '50 kg Bag',
    rate: 266,
    mrp: 300,
    stock: 180,
    minStockAlert: 30,
    description: 'Essential nitrogenous fertilizer with neem coating for slow nitrogen release and pest deterrence.',
    chemicalFormula: 'Nitrogen (N) 46%',
    brand: 'IFFCO',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fert-02',
    name: 'DAP - Di-Ammonium Phosphate (50kg)',
    category: 'fertilizers',
    unit: '50 kg Bag',
    rate: 1350,
    mrp: 1400,
    stock: 95,
    minStockAlert: 20,
    description: 'High phosphate fertilizer essential for root development and early seedling vigor.',
    chemicalFormula: 'N 18% : P2O5 46%',
    brand: 'KRIBHCO',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fert-03',
    name: 'NPK 19-19-19 Water Soluble (1kg)',
    category: 'fertilizers',
    unit: '1 kg Pack',
    rate: 160,
    mrp: 180,
    stock: 65,
    minStockAlert: 15,
    description: '100% water-soluble balanced spray fertilizer for vegetative growth boost.',
    chemicalFormula: 'N 19% : P 19% : K 19%',
    brand: 'Mahadhan',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fert-04',
    name: 'MOP - Muriate of Potash (50kg)',
    category: 'fertilizers',
    unit: '50 kg Bag',
    rate: 1700,
    mrp: 1800,
    stock: 40,
    minStockAlert: 10,
    description: 'Potassium fertilizer for grain shine, disease resistance, and water regulation.',
    chemicalFormula: 'K2O 60%',
    brand: 'IPL Gold',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fert-05',
    name: 'Zinc Sulfate Monohydrate 33% (10kg)',
    category: 'fertilizers',
    unit: '10 kg Bag',
    rate: 650,
    mrp: 720,
    stock: 28,
    minStockAlert: 10,
    description: 'Corrects zinc deficiencies preventing khaira disease in paddy and yellowing in wheat.',
    chemicalFormula: 'Zn 33% : S 15%',
    brand: 'Coromandel Gromor',
    updatedAt: new Date().toISOString(),
  },

  // PESTICIDES & INSECTICIDES
  {
    id: 'pest-01',
    name: 'Chlorpyrifos 20% EC Insecticide (1L)',
    category: 'pesticides',
    unit: '1 Liter Bottle',
    rate: 420,
    mrp: 480,
    stock: 52,
    minStockAlert: 15,
    description: 'Broad-spectrum organophosphate insecticide against termites, stem borers, and soil pests.',
    chemicalFormula: 'Chlorpyrifos 20% EC',
    brand: 'Syngenta',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pest-02',
    name: 'Glyphosate 41% SL Herbicide (1L)',
    category: 'pesticides',
    unit: '1 Liter Bottle',
    rate: 580,
    mrp: 650,
    stock: 35,
    minStockAlert: 10,
    description: 'Non-selective systemic herbicide for complete weed control in non-cropped areas and orchard rows.',
    chemicalFormula: 'Glyphosate 41% SL',
    brand: 'Monsanto RoundUp',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pest-03',
    name: 'Imidacloprid 17.8% SL (250ml)',
    category: 'pesticides',
    unit: '250 ml Bottle',
    rate: 310,
    mrp: 350,
    stock: 48,
    minStockAlert: 12,
    description: 'Systemic insecticide for aphid, jassid, thrips, and whitefly sucking pest control.',
    chemicalFormula: 'Imidacloprid 17.8% SL',
    brand: 'Bayer Confidor',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pest-04',
    name: 'Mancozeb 75% WP Fungicide (1kg)',
    category: 'pesticides',
    unit: '1 kg Pouch',
    rate: 390,
    mrp: 440,
    stock: 60,
    minStockAlert: 15,
    description: 'Contact fungicide providing broad-spectrum protective control against blights and rusts.',
    chemicalFormula: 'Mancozeb 75% WP',
    brand: 'Indofil M-45',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pest-05',
    name: 'Pure Neem Oil 10000 PPM Bio-Pesticide (1L)',
    category: 'pesticides',
    unit: '1 Liter Bottle',
    rate: 490,
    mrp: 550,
    stock: 22,
    minStockAlert: 8,
    description: 'Organic botanical pesticide safe for beneficial insects, anti-feedant and repellent.',
    chemicalFormula: 'Azadirachtin 1% EC',
    brand: 'EcoNeem Organic',
    updatedAt: new Date().toISOString(),
  },

  // SEEDS
  {
    id: 'seed-01',
    name: 'Wheat HD-2967 High-Yield Seed (40kg)',
    category: 'seeds',
    unit: '40 kg Bag',
    rate: 1450,
    mrp: 1600,
    stock: 75,
    minStockAlert: 20,
    description: 'Rust resistant high yielding wheat seed recommended for irrigated fertile soils.',
    chemicalFormula: 'Purity >98% | Germination >85%',
    brand: 'National Seeds Corp (NSC)',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-02',
    name: 'Hybrid Paddy Rice PB-1121 Seed (10kg)',
    category: 'seeds',
    unit: '10 kg Bag',
    rate: 1250,
    mrp: 1350,
    stock: 42,
    minStockAlert: 10,
    description: 'Premium aromatic basmati hybrid paddy seeds with long slender grains.',
    chemicalFormula: 'Purity 99% | Germination 90%',
    brand: 'Pioneer Seeds',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-03',
    name: 'Hybrid Maize / Corn Seeds NK-6240 (4kg)',
    category: 'seeds',
    unit: '4 kg Pack',
    rate: 980,
    mrp: 1100,
    stock: 30,
    minStockAlert: 8,
    description: 'Drought tolerant high starch yield corn seed with sturdy stalk and yellow grain.',
    chemicalFormula: 'Hybrid Grain F1',
    brand: 'Syngenta Seeds',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-04',
    name: 'Bollgard II BT Cotton Hybrid Seed (475g)',
    category: 'seeds',
    unit: '475 gram Pack',
    rate: 850,
    mrp: 864,
    stock: 90,
    minStockAlert: 25,
    description: 'Bollworm resistant BG-II high boll weight cotton seeds.',
    chemicalFormula: 'Cry1Ac + Cry2Ab BT Gene',
    brand: 'Rasi Seeds',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-05',
    name: 'Hybrid Mustard Seeds RH-725 (1kg)',
    category: 'seeds',
    unit: '1 kg Pouch',
    rate: 420,
    mrp: 460,
    stock: 38,
    minStockAlert: 10,
    description: 'High oil content mustard seed suitable for dryland and irrigated mustard belts.',
    chemicalFormula: 'Oil content ~41.5%',
    brand: 'Advanta Seeds',
    updatedAt: new Date().toISOString(),
  },

  // OTHER TOOLS
  {
    id: 'oth-01',
    name: 'Battery Knapsack Power Sprayer 16L',
    category: 'other',
    unit: '1 Piece',
    rate: 2800,
    mrp: 3200,
    stock: 12,
    minStockAlert: 3,
    description: '12V 8Ah battery-operated double pump sprayer with brass nozzle kit for pesticides.',
    chemicalFormula: 'Heavy Duty HDPE Tank',
    brand: 'AgriPro Star',
    updatedAt: new Date().toISOString(),
  }
];

// Helper to generate sample transactions spread across past 12 months for 2025 and 2026
const generateInitialTransactions = (): SaleTransaction[] => {
  const transactions: SaleTransaction[] = [];
  const currentDate = new Date();
  
  // Sample customer names
  const customers = [
    { name: 'Ramesh Singh', phone: '98765 11223' },
    { name: 'Sukhdev Verma', phone: '98123 44556' },
    { name: 'Gurpreet Gill', phone: '97890 33211' },
    { name: 'Mohan Lal Patel', phone: '99887 76655' },
    { name: 'Balwant Kumar', phone: '96543 21098' },
    { name: 'Jagdish Sharma', phone: '98334 55667' },
    { name: 'Anil Yadav', phone: '97112 23344' },
    { name: 'Harpreet Dhillon', phone: '95443 32211' }
  ];

  let billCounter = 1001;

  // We generate monthly data for 2025 (Jan - Dec) and 2026 (Jan - Aug)
  const years = [2025, 2026];

  years.forEach((year) => {
    const maxMonth = year === 2026 ? currentDate.getMonth() : 11;

    for (let monthIdx = 0; monthIdx <= maxMonth; monthIdx++) {
      const monthStr = (monthIdx + 1).toString().padStart(2, '0');
      const monthKey = `${year}-${monthStr}`;

      // 4 to 8 transactions per month
      const numTx = Math.floor(Math.random() * 5) + 4;

      for (let t = 0; t < numTx; t++) {
        const day = Math.floor(Math.random() * 26) + 1;
        const dayStr = day.toString().padStart(2, '0');
        const dateStr = `${year}-${monthStr}-${dayStr}`;
        const cust = customers[Math.floor(Math.random() * customers.length)];

        // Pick 1-3 random products
        const numItems = Math.floor(Math.random() * 3) + 1;
        const selectedProducts: Array<{ p: Product; qty: number }> = [];

        for (let k = 0; k < numItems; k++) {
          const randProd = INITIAL_PRODUCTS[Math.floor(Math.random() * INITIAL_PRODUCTS.length)];
          if (!selectedProducts.find(item => item.p.id === randProd.id)) {
            const qty = randProd.category === 'fertilizers' ? Math.floor(Math.random() * 10) + 2 : Math.floor(Math.random() * 4) + 1;
            selectedProducts.push({ p: randProd, qty });
          }
        }

        const items = selectedProducts.map(({ p, qty }) => ({
          productId: p.id,
          productName: p.name,
          category: p.category,
          unit: p.unit,
          rate: p.rate,
          quantity: qty,
          total: p.rate * qty,
        }));

        const totalAmount = items.reduce((sum, it) => sum + it.total, 0);
        const paymentMethods: Array<'Cash' | 'UPI' | 'Credit' | 'Bank Transfer'> = ['Cash', 'UPI', 'UPI', 'Cash', 'Credit'];

        transactions.push({
          id: `tx-${year}-${monthStr}-${billCounter}`,
          billNumber: `BILL-${billCounter++}`,
          customerName: cust.name,
          customerPhone: cust.phone,
          date: dateStr,
          month: monthKey,
          year: year,
          items,
          totalAmount,
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          notes: 'Standard agricultural supplies sale',
        });
      }
    }
  });

  return transactions;
};

export const INITIAL_TRANSACTIONS = generateInitialTransactions();
