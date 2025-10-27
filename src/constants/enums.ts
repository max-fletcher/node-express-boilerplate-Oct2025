export enum AppUserVerificationStatus {
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
  BANNED = 'BANNED',
}

export const APP_USER_VERIFICATION_STATUSES = [
  AppUserVerificationStatus.VERIFIED,
  AppUserVerificationStatus.UNVERIFIED,
  AppUserVerificationStatus.BANNED,
] as const;

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  ELEMENTARY = 'ELEMENTARY',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export const DIFFICULTIES = [
  Difficulty.BEGINNER,
  Difficulty.ELEMENTARY,
  Difficulty.INTERMEDIATE,
  Difficulty.ADVANCED,
] as const;

export enum ProficiencyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export const PROFICIENCY_LEVELS = [
  ProficiencyLevel.BEGINNER,
  ProficiencyLevel.INTERMEDIATE,
  ProficiencyLevel.ADVANCED,
] as const;

export enum Familiarity {
  KNOWIT = 'KNOWIT',
  FAMILIAR = 'FAMILIAR',
  DONTKNOW = 'DONTKNOW',
}

export const FAMILIARITY = [
  Familiarity.KNOWIT,
  Familiarity.FAMILIAR,
  Familiarity.DONTKNOW,
] as const