export type Role = 'FARMER' | 'ADMIN' | 'EXPERT';
export type Language = 'EN' | 'HI';

export interface User {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string | null;
  role: Role;
  preferredLanguage: Language;
  createdAt: string;
  profile?: FarmerProfile | null;
  expertProfile?: ExpertProfile | null;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  state: string;
  district: string;
  village: string;
  landSize: number;
  soilType: string;
  irrigation: string;
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
  arrivalQty: number;
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
  status: 'PENDING' | 'IN_REVIEW' | 'RESOLVED';
  expertReply?: string;
  createdAt: string;
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
