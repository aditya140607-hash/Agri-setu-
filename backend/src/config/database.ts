import bcrypt from 'bcryptjs';

// Types matching the Prisma PostgreSQL schema
export type Role = 'FARMER' | 'ADMIN' | 'EXPERT';
export type Language = 'EN' | 'HI';
export type ExpertRequestStatus = 'PENDING' | 'IN_REVIEW' | 'RESOLVED';

export interface User {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string | null;
  passwordHash: string;
  role: Role;
  preferredLanguage: Language;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  state: string;
  district: string;
  village: string;
  landSize: number; // In acres
  soilType: string;
  irrigation: string;
  createdAt: string;
  updatedAt: string;
}

export interface Crop {
  id: string;
  farmerId: string;
  cropName: string;
  variety?: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  sowingDate: string;
  expectedHarvestDate?: string;
  areaAcres?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CropAnalysis {
  id: string;
  farmerId: string;
  imageUrl: string;
  cropName: string;
  detectedIssue: string;
  confidence: number;
  symptoms: string[];
  recommendations: string[];
  chemicalControl?: string;
  biologicalControl?: string;
  needsExpertReview: boolean;
  createdAt: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  category: 'Financial' | 'Insurance' | 'Irrigation' | 'Machinery' | 'Input Subsidy' | 'Organic Farming' | 'Seeds' | 'Market Support';
  description: string;
  eligibility: string;
  benefits: string;
  documents: string[];
  officialUrl: string;
  stateApplicable: string;
  minLandRequired?: number;
  maxLandRequired?: number;
  createdAt: string;
}

export interface SavedScheme {
  id: string;
  farmerId: string;
  schemeId: string;
  savedAt: string;
}

export interface WeatherRecord {
  id: string;
  location: string;
  district: string;
  state: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  conditions: string;
  advisory: string;
  forecast: Array<{
    day: string;
    temp: number;
    humidity: number;
    rainProb: number;
    condition: string;
  }>;
  recordedAt: string;
}

export interface MandiPrice {
  id: string;
  cropName: string;
  state: string;
  district: string;
  mandiName: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQty: number; // quintals/tonnes
  priceDate: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface ExpertProfile {
  id: string;
  userId: string;
  name: string;
  specialization: string;
  kvkName: string;
  location: string;
  experienceYears: number;
  contactInformation: string;
  availableDays: string[];
  rating: number;
  createdAt: string;
}

export interface ExpertRequest {
  id: string;
  farmerId: string;
  farmerName?: string;
  farmerPhone?: string;
  expertId?: string;
  cropName: string;
  question: string;
  imageUrl?: string;
  status: ExpertRequestStatus;
  expertReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  farmerId: string;
  message: string;
  response: string;
  language: Language;
  createdAt: string;
}

export interface Notification {
  id: string;
  farmerId: string;
  title: string;
  message: string;
  type: 'WEATHER_ALERT' | 'SCHEME_DEADLINE' | 'MANDI_SURGE' | 'CROP_HEALTH' | 'SYSTEM';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Feedback {
  id: string;
  farmerId: string;
  farmerName?: string;
  rating: number;
  message: string;
  createdAt: string;
}

// In-Memory Database store with relational methods
class DatabaseStore {
  users: User[] = [];
  farmerProfiles: FarmerProfile[] = [];
  crops: Crop[] = [];
  cropAnalyses: CropAnalysis[] = [];
  governmentSchemes: GovernmentScheme[] = [];
  savedSchemes: SavedScheme[] = [];
  weatherRecords: WeatherRecord[] = [];
  mandiPrices: MandiPrice[] = [];
  expertProfiles: ExpertProfile[] = [];
  expertRequests: ExpertRequest[] = [];
  chatMessages: ChatMessage[] = [];
  notifications: Notification[] = [];
  feedbacks: Feedback[] = [];

  private isSeeded = false;

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    if (this.isSeeded) return;

    const salt = bcrypt.genSaltSync(10);
    const farmerPasswordHash = bcrypt.hashSync('farmer123', salt);
    const adminPasswordHash = bcrypt.hashSync('admin123', salt);
    const expertPasswordHash = bcrypt.hashSync('expert123', salt);

    // 1. Users
    const demoFarmerUser: User = {
      id: 'usr-farmer-01',
      fullName: 'Rameshwar Patil',
      mobileNumber: '9876543210',
      email: 'rameshwar.patil@agrisetu.in',
      passwordHash: farmerPasswordHash,
      role: 'FARMER',
      preferredLanguage: 'HI',
      createdAt: new Date('2025-01-15T08:00:00Z').toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const demoAdminUser: User = {
      id: 'usr-admin-01',
      fullName: 'Dr. Anand Verma (Agronomy Director)',
      mobileNumber: '9988776655',
      email: 'admin@agrisetu.in',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      preferredLanguage: 'EN',
      createdAt: new Date('2025-01-01T08:00:00Z').toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const demoExpertUser: User = {
      id: 'usr-expert-01',
      fullName: 'Dr. Sunita Sharma',
      mobileNumber: '9812345678',
      email: 'expert.sharma@agrisetu.in',
      passwordHash: expertPasswordHash,
      role: 'EXPERT',
      preferredLanguage: 'HI',
      createdAt: new Date('2025-01-05T08:00:00Z').toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(demoFarmerUser, demoAdminUser, demoExpertUser);

    // 2. Farmer Profiles
    this.farmerProfiles.push({
      id: 'prof-farmer-01',
      userId: 'usr-farmer-01',
      state: 'Maharashtra',
      district: 'Nashik',
      village: 'Deola',
      landSize: 4.5,
      soilType: 'Black Clay Loam (काली मिट्टी)',
      irrigation: 'Drip & Well Irrigation',
      createdAt: new Date('2025-01-15T08:30:00Z').toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 3. Crops for Farmer
    this.crops.push(
      {
        id: 'crop-01',
        farmerId: 'usr-farmer-01',
        cropName: 'Soybean (सोयाबीन)',
        variety: 'JS-335',
        season: 'Kharif',
        sowingDate: '2025-06-25T00:00:00Z',
        expectedHarvestDate: '2025-10-15T00:00:00Z',
        areaAcres: 2.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'crop-02',
        farmerId: 'usr-farmer-01',
        cropName: 'Wheat (गेहूं)',
        variety: 'Sharbati HD-2967',
        season: 'Rabi',
        sowingDate: '2025-11-10T00:00:00Z',
        expectedHarvestDate: '2026-03-25T00:00:00Z',
        areaAcres: 2.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'crop-03',
        farmerId: 'usr-farmer-01',
        cropName: 'Onion (प्याज)',
        variety: 'N-53 Red',
        season: 'Kharif',
        sowingDate: '2025-07-05T00:00:00Z',
        expectedHarvestDate: '2025-11-05T00:00:00Z',
        areaAcres: 1.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    // 4. Crop Analyses History
    this.cropAnalyses.push({
      id: 'analysis-01',
      farmerId: 'usr-farmer-01',
      imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80',
      cropName: 'Wheat',
      detectedIssue: 'Yellow Rust (Puccinia striiformis)',
      confidence: 94.6,
      symptoms: [
        'Bright yellow powdery pustules forming linear stripes on leaf blades',
        'Chlorotic yellowing along leaf veins',
        'Stunted grain development and early leaf senescence'
      ],
      recommendations: [
        'Spray Propiconazole 25% EC (Tilt) @ 1 ml per litre of water upon initial detection',
        'Ensure balanced nitrogen fertilization; avoid excess urea',
        'Monitor field during humid foggy mornings (temperatures 10°C - 20°C)'
      ],
      chemicalControl: 'Propiconazole 25% EC or Tebuconazole 25.9% EC @ 200 ml/acre in 200L water',
      biologicalControl: 'Trichoderma viride foliar spray 5g/L during early vegetative stages',
      needsExpertReview: false,
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    });

    // 5. Government Schemes
    this.governmentSchemes.push(
      {
        id: 'sch-pmkisan',
        name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
        category: 'Financial',
        description: 'Direct income support of ₹6,000 per year in three equal 4-monthly instalments of ₹2,000 directly transferred into Aadhaar-linked bank accounts of landholding farmer families across India.',
        eligibility: 'All landholding farmer families having cultivable landholding in their names. Subject to exclusions for institutional landowners and high income taxpayers.',
        benefits: '₹6,000 guaranteed annual income support per annum directly in Direct Benefit Transfer (DBT) mode.',
        documents: ['Aadhaar Card', 'Land Ownership Record (Khata/Khasra/7/12 Extract)', 'Bank Account Passbook (Aadhaar Seeded)', 'Mobile Number linked to Aadhaar'],
        officialUrl: 'https://pmkisan.gov.in',
        stateApplicable: 'All India',
        minLandRequired: 0.1,
        maxLandRequired: 100,
        createdAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 'sch-pmfby',
        name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
        category: 'Insurance',
        description: 'Comprehensive risk insurance coverage from pre-sowing to post-harvest losses against non-preventable natural risks (drought, flood, pest, cyclone, unseasonal rain) at heavily subsidised premium rates.',
        eligibility: 'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.',
        benefits: 'Very low farmer premium (2% for Kharif, 1.5% for Rabi, 5% for Annual Horticultural crops). Balance premium 100% subsidized by State and Central Governments. Claim payouts directly to bank.',
        documents: ['Land record 7/12 or RoR', 'Sowing Certificate from Patwari/Gram Sevak', 'Bank Passbook copy', 'Aadhaar Card'],
        officialUrl: 'https://pmfby.gov.in',
        stateApplicable: 'All India',
        minLandRequired: 0.1,
        maxLandRequired: 500,
        createdAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 'sch-kcc',
        name: 'Kisan Credit Card (KCC) Scheme',
        category: 'Financial',
        description: 'Adequate and timely credit support from the banking system for agricultural crop cultivation, post-harvest expenses, produce marketing, consumption requirements, and maintenance of farm assets.',
        eligibility: 'All farmers, individual/joint borrowers who are owner cultivators, tenant farmers, oral lessees and sharecroppers.',
        benefits: 'Short-term crop loans up to ₹3,00,000 at a concessional interest rate of 4% per annum (with prompt repayment 3% interest subvention). No collateral required up to ₹1.60 Lakh.',
        documents: ['Application Form', 'Two passport size photos', 'ID proof (Aadhaar/Voter ID)', 'Land records / tenancy agreement'],
        officialUrl: 'https://myscheme.gov.in/schemes/kcc',
        stateApplicable: 'All India',
        minLandRequired: 0.1,
        maxLandRequired: 100,
        createdAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 'sch-pmksy',
        name: 'PMKSY - Per Drop More Crop (Micro Irrigation)',
        category: 'Irrigation',
        description: 'Subsidy on Drip Irrigation and Sprinkler Irrigation systems to enhance water use efficiency and farm productivity at field level.',
        eligibility: 'All farmers owning agricultural land with assured irrigation water source. Small & Marginal farmers receive higher subsidy support.',
        benefits: 'Up to 55% subsidy for Small/Marginal farmers and up to 45% for other farmers on micro-irrigation system installation costs.',
        documents: ['Land title certificate', 'Aadhaar Card', 'Water source verification certificate', 'Bank passbook', 'Electricity connection bill'],
        officialUrl: 'https://pmksy.gov.in',
        stateApplicable: 'All India',
        minLandRequired: 0.5,
        maxLandRequired: 12.5,
        createdAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 'sch-enam',
        name: 'e-NAM (National Agriculture Market)',
        category: 'Machinery',
        description: 'Pan-India electronic trading portal networking existing APMC mandis to create a unified national market for agricultural commodities.',
        eligibility: 'Any farmer holding agricultural produce seeking transparent price discovery and online payment.',
        benefits: 'Access to competitive buyers nationwide, quality assaying, electronic bidding, direct online payment to bank without middleman commission.',
        documents: ['Aadhaar Card', 'Bank Account details', 'Mobile Number', 'Mandi registration slip'],
        officialUrl: 'https://enam.gov.in',
        stateApplicable: 'All India',
        minLandRequired: 0,
        maxLandRequired: 500,
        createdAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 'sch-shc',
        name: 'Soil Health Card Scheme',
        category: 'Input Subsidy',
        description: 'Assisting State Governments to issue Soil Health Cards to farmers every 2 years containing nutrient status of 12 soil parameters with customized crop-wise fertilizer dosage recommendations.',
        eligibility: 'Open to all farmers possessing farm land across all states and districts.',
        benefits: 'Free soil testing report card with scientific guidance on Macro (N, P, K), Micro nutrients (Zn, Fe, Cu, Mn, Bo) and organic carbon to optimize input costs.',
        documents: ['Farmer Aadhaar details', 'Field GPS coordinate / plot survey number'],
        officialUrl: 'https://soilhealth.dac.gov.in',
        stateApplicable: 'All India',
        minLandRequired: 0,
        maxLandRequired: 100,
        createdAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 'sch-pkvy',
        name: 'Paramparagat Krishi Vikas Yojana (Organic Farming)',
        category: 'Organic Farming',
        description: 'Promoting organic farming through cluster approach and Participatory Guarantee System (PGS) certification, bio-fertilizer and vermicompost support.',
        eligibility: 'Farmer groups formed into clusters of 20-50 hectares.',
        benefits: 'Financial assistance of ₹50,000 per hectare for 3 years, of which ₹31,000 is given directly via DBT for organic inputs.',
        documents: ['Group formation charter', 'Land extracts', 'Bank details'],
        officialUrl: 'https://pgsindia-ncof.gov.in',
        stateApplicable: 'All India',
        minLandRequired: 1.0,
        maxLandRequired: 50,
        createdAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 'sch-smsp-seeds',
        name: 'Sub-Mission on Seeds & Planting Material (SMSP)',
        category: 'Seeds',
        description: 'Quality certified seed production and subsidized seed distribution to farmers to boost seed replacement rate (SRR) across major cereal, pulse, and oilseed crops.',
        eligibility: 'Individual cultivators and farmer grower groups across notified agro-climatic zones.',
        benefits: 'Up to 50% subsidy on purchase of certified hybrid foundation seeds, seed mini-kits distributed free to marginal farmers.',
        documents: ['Aadhaar Card', 'Farmer land registry / Khatauni', 'Kisan Credit Card (if applicable)'],
        officialUrl: 'https://seednet.gov.in',
        stateApplicable: 'All India',
        minLandRequired: 0.1,
        maxLandRequired: 25,
        createdAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 'sch-pmaasha-market',
        name: 'PM-AASHA (Pradhan Mantri Annadata Aay Sanraksan Abhiyan)',
        category: 'Market Support',
        description: 'Comprehensive umbrella scheme ensuring Minimum Support Price (MSP) realization through Price Support Scheme (PSS), Price Deficiency Payment Scheme (PDPS), and Pilot of Private Procurement & Stockist Scheme (PPSS).',
        eligibility: 'All farmers selling notified pulses, oilseeds, and copra with valid sowing registrations.',
        benefits: 'Direct procurement at MSP or direct bank compensation (PDPS) for the difference between MSP and market mandi modal price.',
        documents: ['Farmer Mandi Registration', 'Aadhaar Card', 'Aadhaar-seeded Bank Passbook', 'Crop Sowing Certificate'],
        officialUrl: 'https://pmaasha.gov.in',
        stateApplicable: 'All India',
        minLandRequired: 0.1,
        maxLandRequired: 100,
        createdAt: new Date('2025-01-01').toISOString(),
      }
    );

    // 6. Saved Schemes for Demo Farmer
    this.savedSchemes.push(
      {
        id: 'ss-01',
        farmerId: 'usr-farmer-01',
        schemeId: 'sch-pmkisan',
        savedAt: new Date('2025-01-18').toISOString(),
      },
      {
        id: 'ss-02',
        farmerId: 'usr-farmer-01',
        schemeId: 'sch-pmfby',
        savedAt: new Date('2025-01-20').toISOString(),
      }
    );

    // 7. Weather Records
    this.weatherRecords.push(
      {
        id: 'w-nashik',
        location: 'Deola, Nashik',
        district: 'Nashik',
        state: 'Maharashtra',
        temperature: 28.5,
        humidity: 62,
        rainfall: 0.0,
        windSpeed: 14.2,
        conditions: 'Partly Cloudy',
        advisory: 'Optimal weather for wheat earhead flowering and onion bulb enlargement. Morning dew likely; monitor for downy mildew in onions.',
        forecast: [
          { day: 'Today', temp: 29, humidity: 62, rainProb: 5, condition: 'Partly Cloudy' },
          { day: 'Tomorrow', temp: 30, humidity: 58, rainProb: 10, condition: 'Sunny' },
          { day: 'Day 3', temp: 31, humidity: 55, rainProb: 0, condition: 'Clear Sky' },
          { day: 'Day 4', temp: 28, humidity: 68, rainProb: 25, condition: 'Scattered Clouds' },
          { day: 'Day 5', temp: 27, humidity: 72, rainProb: 40, condition: 'Light Shower Risk' }
        ],
        recordedAt: new Date().toISOString(),
      },
      {
        id: 'w-karnal',
        location: 'Karnal Mandi Area',
        district: 'Karnal',
        state: 'Haryana',
        temperature: 22.4,
        humidity: 78,
        rainfall: 0.0,
        windSpeed: 9.8,
        conditions: 'Misty / Cool',
        advisory: 'Favorable temperatures for wheat tillering and grain filling. No irrigation needed if soil moisture is adequate from recent rainfall.',
        forecast: [
          { day: 'Today', temp: 22, humidity: 78, rainProb: 0, condition: 'Misty' },
          { day: 'Tomorrow', temp: 23, humidity: 74, rainProb: 0, condition: 'Sunny' },
          { day: 'Day 3', temp: 24, humidity: 70, rainProb: 5, condition: 'Sunny' },
          { day: 'Day 4', temp: 24, humidity: 65, rainProb: 0, condition: 'Clear Sky' },
          { day: 'Day 5', temp: 22, humidity: 80, rainProb: 15, condition: 'Cloudy' }
        ],
        recordedAt: new Date().toISOString(),
      },
      {
        id: 'w-indore',
        location: 'Indore Malwa Region',
        district: 'Indore',
        state: 'Madhya Pradesh',
        temperature: 27.8,
        humidity: 54,
        rainfall: 0.0,
        windSpeed: 11.5,
        conditions: 'Sunny',
        advisory: 'Dry weather expected for the next 5 days. Ideal conditions for harvesting early sown mustard and chickpea.',
        forecast: [
          { day: 'Today', temp: 28, humidity: 54, rainProb: 0, condition: 'Sunny' },
          { day: 'Tomorrow', temp: 29, humidity: 50, rainProb: 0, condition: 'Sunny' },
          { day: 'Day 3', temp: 30, humidity: 48, rainProb: 0, condition: 'Sunny' },
          { day: 'Day 4', temp: 31, humidity: 45, rainProb: 0, condition: 'Sunny' },
          { day: 'Day 5', temp: 29, humidity: 52, rainProb: 10, condition: 'Clear' }
        ],
        recordedAt: new Date().toISOString(),
      }
    );

    // 8. Mandi Prices
    this.mandiPrices.push(
      {
        id: 'mp-01',
        cropName: 'Wheat (गेहूं)',
        state: 'Madhya Pradesh',
        district: 'Indore',
        mandiName: 'Indore APMC Mandi',
        minPrice: 2350,
        maxPrice: 2720,
        modalPrice: 2540,
        arrivalQty: 1250,
        priceDate: new Date().toISOString().split('T')[0],
        trend: 'up',
        changePercent: 3.2,
      },
      {
        id: 'mp-02',
        cropName: 'Wheat (गेहूं)',
        state: 'Punjab',
        district: 'Ludhiana',
        mandiName: 'Khanna Grain Market',
        minPrice: 2275,
        maxPrice: 2580,
        modalPrice: 2425,
        arrivalQty: 1840,
        priceDate: new Date().toISOString().split('T')[0],
        trend: 'stable',
        changePercent: 0.4,
      },
      {
        id: 'mp-03',
        cropName: 'Soybean (सोयाबीन)',
        state: 'Maharashtra',
        district: 'Nashik',
        mandiName: 'Lasalgaon Mandi',
        minPrice: 4300,
        maxPrice: 4850,
        modalPrice: 4620,
        arrivalQty: 920,
        priceDate: new Date().toISOString().split('T')[0],
        trend: 'up',
        changePercent: 2.1,
      },
      {
        id: 'mp-04',
        cropName: 'Soybean (सोयाबीन)',
        state: 'Madhya Pradesh',
        district: 'Ujjain',
        mandiName: 'Ujjain APMC',
        minPrice: 4250,
        maxPrice: 4790,
        modalPrice: 4580,
        arrivalQty: 1400,
        priceDate: new Date().toISOString().split('T')[0],
        trend: 'down',
        changePercent: -1.2,
      },
      {
        id: 'mp-05',
        cropName: 'Onion (लाल प्याज)',
        state: 'Maharashtra',
        district: 'Nashik',
        mandiName: 'Lasalgaon APMC (Asia Largest)',
        minPrice: 1650,
        maxPrice: 2850,
        modalPrice: 2350,
        arrivalQty: 4200,
        priceDate: new Date().toISOString().split('T')[0],
        trend: 'up',
        changePercent: 8.5,
      },
      {
        id: 'mp-06',
        cropName: 'Mustard (सरसों)',
        state: 'Rajasthan',
        district: 'Bharatpur',
        mandiName: 'Bharatpur Krishi Upaj Mandi',
        minPrice: 5100,
        maxPrice: 5650,
        modalPrice: 5450,
        arrivalQty: 1100,
        priceDate: new Date().toISOString().split('T')[0],
        trend: 'up',
        changePercent: 1.8,
      },
      {
        id: 'mp-07',
        cropName: 'Cotton (कपास)',
        state: 'Gujarat',
        district: 'Rajkot',
        mandiName: 'Rajkot APMC',
        minPrice: 6800,
        maxPrice: 7650,
        modalPrice: 7250,
        arrivalQty: 850,
        priceDate: new Date().toISOString().split('T')[0],
        trend: 'down',
        changePercent: -0.8,
      },
      {
        id: 'mp-08',
        cropName: 'Paddy Basmati (धान)',
        state: 'Haryana',
        district: 'Karnal',
        mandiName: 'Taraori Grain Market',
        minPrice: 3800,
        maxPrice: 4450,
        modalPrice: 4200,
        arrivalQty: 2100,
        priceDate: new Date().toISOString().split('T')[0],
        trend: 'stable',
        changePercent: 0.1,
      }
    );

    // 9. Expert Profiles
    this.expertProfiles.push(
      {
        id: 'exp-01',
        userId: 'usr-expert-01',
        name: 'Dr. Sunita Sharma',
        specialization: 'Crop Protection & Integrated Pest Management (IPM)',
        kvkName: 'Krishi Vigyan Kendra (KVK) Nashik',
        location: 'Nashik, Maharashtra',
        experienceYears: 14,
        contactInformation: 'dr.sharma.kvk@icar.gov.in | Mon-Fri 10am-4pm',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        rating: 4.9,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'exp-02',
        userId: 'usr-expert-02',
        name: 'Dr. Rakesh Kulshreshtha',
        specialization: 'Soil Chemistry & Organic Nutrition',
        kvkName: 'ICAR - Indian Agricultural Research Institute (IARI)',
        location: 'New Delhi / Karnal',
        experienceYears: 18,
        contactInformation: 'r.kulshreshtha@iari.res.in',
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        rating: 4.8,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'exp-03',
        userId: 'usr-expert-03',
        name: 'Er. Virendra Godara',
        specialization: 'Farm Mechanization & Micro-Irrigation Systems',
        kvkName: 'KVK Bikaner / Rajasthan Agri University',
        location: 'Bikaner, Rajasthan',
        experienceYears: 11,
        contactInformation: 'virendra.godara@kvk.org.in',
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        rating: 4.7,
        createdAt: new Date().toISOString(),
      }
    );

    // 10. Expert Requests
    this.expertRequests.push({
      id: 'req-01',
      farmerId: 'usr-farmer-01',
      farmerName: 'Rameshwar Patil',
      farmerPhone: '9876543210',
      expertId: 'exp-01',
      cropName: 'Wheat',
      question: 'Leaf tips showing yellow striping after irrigation. Is it rust or nitrogen deficiency?',
      status: 'RESOLVED',
      expertReply: 'Based on your photo and soil report, this is mild nitrogen leaching following heavy flood irrigation, not yellow rust. Apply 20 kg urea top-dress per acre with irrigation. Pustules were not observed.',
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    });

    // 11. Chat Messages
    this.chatMessages.push(
      {
        id: 'chat-01',
        farmerId: 'usr-farmer-01',
        message: 'गेहूं में पीला रतुआ के क्या लक्षण हैं और इसका क्या उपाय है?',
        response: 'पीला रतुआ (Yellow Rust) में पत्तियों पर पीले रंग के छोटे-छोटे दानेदार धब्बे कतारों में दिखाई देते हैं। यह ठंडे और नम मौसम (10-20°C) में तेजी से फैलता है। नियंत्रण के लिए प्रोपिकोनाज़ोल 25% EC (टिल्ट) 200 मिली प्रति 200 लीटर पानी में मिलाकर प्रति एकड़ तुरंत छिड़काव करें।',
        language: 'HI',
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      }
    );

    // 12. Notifications
    this.notifications.push(
      {
        id: 'notif-01',
        farmerId: 'usr-farmer-01',
        title: 'Mandi Price Surge: Onion +8.5%',
        message: 'Lasalgaon Mandi onion modal price reached ₹2,350/Qtl today (+₹185). Good window for grading and dispatch.',
        type: 'MANDI_SURGE',
        link: '/mandi',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
      {
        id: 'notif-02',
        farmerId: 'usr-farmer-01',
        title: 'PM-KISAN 17th Installment Credited',
        message: 'Your ₹2,000 DBT installment for PM-KISAN has been processed into your bank account ending in 4108.',
        type: 'SCHEME_DEADLINE',
        link: '/schemes',
        isRead: false,
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'notif-03',
        farmerId: 'usr-farmer-01',
        title: 'Weather Alert: Dense Fog Forecasted',
        message: 'High humidity (75-85%) and low night temperatures expected over next 48 hours. Monitor wheat for fungal leaf spots.',
        type: 'WEATHER_ALERT',
        link: '/weather',
        isRead: true,
        createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      }
    );

    // 13. Feedback
    this.feedbacks.push({
      id: 'fb-01',
      farmerId: 'usr-farmer-01',
      farmerName: 'Rameshwar Patil',
      rating: 5,
      message: 'AGRI-SETU helped me catch yellow rust early on my wheat crop and saved at least ₹35,000 in yield loss. The mandi price alerts in Marathi/Hindi are very helpful!',
      createdAt: new Date('2025-01-28').toISOString(),
    });

    this.isSeeded = true;
  }
}

export const db = new DatabaseStore();
