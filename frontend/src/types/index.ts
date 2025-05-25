export interface DorCriterionResponse {
  id: number;
  criterion: string;
  order_index: number;
}

export interface CreateDorRequest {
  name: string;
  description: string;
  criteria: string[];
}

export interface UpdateDorRequest {
  name: string;
  description: string;
  criteria: string[];
}

export interface DorListResponse {
  id: number;
  name: string;
  description: string;
  criteria_count: number;
  created_at: string;
}

export interface DorDetailResponse {
  id: number;
  name: string;
  description: string;
  criteria: DorCriterionResponse[];
  created_at: string;
  updated_at: string;
}

export interface CreateDorResponse {
  id: number;
  message: string;
}

export interface DeleteDorResponse {
  message: string;
}

export interface CheckTaskRequest {
  dor_id: number;
  task_text: string;
}

export interface CriterionCheckResult {
  criterion: string;
  passed: boolean;
  comment: string;
}

export interface CheckTaskResponse {
  dor_name: string;
  total_criteria: number;
  passed_criteria: number;
  pass_rate: number;
  results: CriterionCheckResult[];
}

export interface ErrorResponse {
  detail: string;
} 