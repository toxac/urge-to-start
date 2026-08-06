// types/profileJsonFields.ts

export type EducationLevel = 
  | "high_school" 
  | "undergraduate_degree" 
  | "postgraduate_degree" 
  | "self_taught";

export type UserRoles = 
  | "base" 
  | "trial" 
  | "enrolled" 
  | "member" 
  | "provider" 
  | "mentor" 
  | "superadmin" 
  | "admin_marketing" 
  | "admin_accounts";

export type UserAgeGroup = 
  | "under_18" 
  | "18_24" 
  | "25_34" 
  | "35_44" 
  | "45_54" 
  | "55_plus";

export type ProfileSkills = {
  category: string;
  title: string;
  level: string;
};

export type ProfileMotivationSchema = {
  push: string;
  push_other: string | null;
  pull: string;
  pull_other: string | null;
  urgency: string;
  urgency_other: string | null;
  why_statement: string;
};

export type ProfileCommitmentSchema = {
  time_to_launch: number; // in months
  weekly_hours: number;
  capital: number | null;
};

export type ProfileRoadblockSchema = {
  roadblocks: string[] | null;
  roadblocks_other: string | null;
};

export type ProfileSocialFootprintSchema = {
  type: "platform" | "clubs" | "professional" | "network" | "other";
  name: string;
  profile_link_url: string;
  total_connections: number | null;
};

export type ProfileAssessmentSchema = {
  assessment_type: string;
  observation: string;
  recommendation: string[];
  score: number;
};