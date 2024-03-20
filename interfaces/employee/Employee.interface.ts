export interface ExperienceUser {
  title: string;
  nameBussiness: string;
  activyBussiness: string;
  description: string;
  area?: string;
  subarea?: string;
  country?: string;
  level: string;
  dateStart: string;
  dateEnd?: string;
  currentJob: boolean;
  employe: string;

  _id?: string;
  __v?: number;
}

export interface EmployeeTotalResponse {
  _id: number;
  total: number;
}

