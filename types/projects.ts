// types/projects.ts

export interface ProblemHypothesis {
  problem_statement: string;
  when_context: string;
  where_location: string;
  affected_audience: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'occasionally' | 'seasonal';
  current_workaround: string;
  defined_at: string;
}

export interface InterviewRecord {
  id: string;
  interviewee_name: string;
  role_or_context: string;
  problem_confirmed: 'yes' | 'sort_of' | 'no';
  current_workaround: string;
  existing_spend_or_time: string; // Customer's willingness to pay proxy
  buying_signal: 'offer_to_pay' | 'asked_to_buy' | 'introduced' | 'none';
  key_quote_or_surprise?: string;
  logged_at: string;
}

export interface ValidationDataPayload {
  interviews: InterviewRecord[];
  total_interviews: number;
  last_updated_at?: string;
}

export interface CustomerPersona {
  persona_name: string;
  job_title_or_role: string;
  age_range: string;
  ranked_pain_points: string[];
  desired_gains: string[];
  current_spend: string;
  watering_holes: string; // Where they hang out online/offline
  verbatim_problem_quote: string; // Exact customer words
}

export interface DiscoveryMetricsPayload {
  problem_hypothesis?: ProblemHypothesis;
  customer_personas?: CustomerPersona[];
  source_opportunity_id?: string;
}

export interface MSPPayload {
  solution_type: 'product_service' | 'tools_saas' | 'marketplace' | 'content';
  industry_sector: string;
  rationale: string;
  access_type: string;
  one_sentence_description: string;
  perceived_value_price: string;
  delivery_channel: string;
  resources_needed: string;
  time_to_first_sale: 'hours' | 'days' | 'weeks' | 'months';
  differentiation_vs_diy: string;
}

export interface SolutionDesignPayload {
  msp?: MSPPayload;
  updated_at?: string;
}

export interface CompetitiveLandscapePayload {
  macro_trend: string;
  competitors_and_diy: string;
  what_is_working: string;
  what_is_failing_or_hard: string;
  customer_gather_spots: string;
}

export interface ViabilityCheckPayload {
  first_sale_14_days: 'yes' | 'maybe' | 'no';
  resources_available: 'yes' | 'mostly' | 'no';
  stamina_6_months: 'absolutely' | 'probably' | 'uncertain' | 'probably_not';
  biggest_risk: string;
  kill_criteria: string;
  worst_case_scenario?: string;
  regret_test?: 'starting' | 'not_starting';
  final_decision?: 'go' | 'pivot' | 'no_go';
  decision_rationale?: string;
}