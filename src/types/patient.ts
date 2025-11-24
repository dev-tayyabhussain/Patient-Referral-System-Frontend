export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  nationalId?: string;
  patientId: string;
  address: PatientAddress;
  emergencyContact?: EmergencyContact;
  bloodType?: BloodType;
  allergies: Allergy[];
  chronicConditions: ChronicCondition[];
  medications: Medication[];
  insurance?: Insurance;
  status: PatientStatus;
  preferredLanguage: string;
  medicalHistory: MedicalRecord[];
  currentHospital?: string;
  assignedDoctor?: string;
  profileImage?: string;
  stats: PatientStats;
  createdAt: string;
  updatedAt: string;
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type PatientStatus = 'active' | 'inactive' | 'deceased';

export interface PatientAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Allergy {
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface ChronicCondition {
  condition: string;
  diagnosisDate: string;
  status: 'active' | 'controlled' | 'inactive';
  notes?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  expiryDate: string;
}

export interface MedicalRecord {
  date: string;
  type: 'consultation' | 'procedure' | 'test' | 'vaccination' | 'other';
  description: string;
  hospital: string;
  doctor: string;
  files: string[];
}

export interface PatientStats {
  totalVisits: number;
  totalReferrals: number;
  lastVisit?: string;
}
