export interface Referral {
  _id: string;
  referralId: string;
  patient: string;
  referringDoctor: string;
  referringHospital: string;
  receivingDoctor?: string;
  receivingHospital: string;
  reason: string;
  priority: ReferralPriority;
  specialty: string;
  chiefComplaint: string;
  historyOfPresentIllness?: string;
  physicalExamination?: string;
  vitalSigns?: VitalSigns;
  diagnosis: Diagnosis;
  treatmentGiven?: string;
  medications: ReferralMedication[];
  investigations: Investigation[];
  status: ReferralStatus;
  response?: ReferralResponse;
  appointment?: Appointment;
  followUp: FollowUp;
  attachments: Attachment[];
  pdfReport?: PDFReport;
  timeline: TimelineEntry[];
  messages: ReferralMessage[];
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export type ReferralPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ReferralStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

export interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
}

export interface Diagnosis {
  primary: string;
  secondary: string[];
}

export interface ReferralMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Investigation {
  type: string;
  result: string;
  date: string;
  file?: string;
}

export interface ReferralResponse {
  notes: string;
  responseDate: string;
  responseBy: string;
}

export interface Appointment {
  scheduledDate: string;
  scheduledTime: string;
  location: string;
  notes?: string;
}

export interface FollowUp {
  required: boolean;
  date?: string;
  notes?: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface PDFReport {
  url: string;
  generatedAt: string;
}

export interface TimelineEntry {
  action: TimelineAction;
  timestamp: string;
  performedBy: string;
  notes?: string;
}

export type TimelineAction = 'created' | 'sent' | 'received' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

export interface ReferralMessage {
  sender: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
