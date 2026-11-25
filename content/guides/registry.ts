import type { GuideContent } from '@/lib/guides/types';
import { content as hospitalLevelGuide } from './hospital-level-guide';
import { content as medicalDepartmentGuide } from './medical-department-guide';
import { content as referralGuide } from './referral-guide';
import { content as nhiCopaymentGuide } from './nhi-copayment-guide';
import { content as chronicPrescriptionGuide } from './chronic-prescription-guide';
import { content as firstVisitGuide } from './first-visit-guide';
import { content as emergencyGuide } from './emergency-guide';
import { content as nhiCardUsageGuide } from './nhi-card-usage-guide';
import { content as nhiEnrollmentGuide } from './nhi-enrollment-guide';
import { content as nhiAppGuide } from './nhi-app-guide';
import { content as prescriptionGuide } from './prescription-guide';
import { content as drugInteractionGuide } from './drug-interaction-guide';
import { content as medicineStorageGuide } from './medicine-storage-guide';
import { content as urineTestGuide } from './urine-test-guide';
import { content as liverFunctionGuide } from './liver-function-guide';
import { content as kidneyFunctionGuide } from './kidney-function-guide';
import { content as bloodSugarGuide } from './blood-sugar-guide';
import { content as elderlyMedicalGuide } from './elderly-medical-guide';
import { content as childMedicalGuide } from './child-medical-guide';
import { content as pregnancyCheckupGuide } from './pregnancy-checkup-guide';
import { content as diabetesManagementGuide } from './diabetes-management-guide';

export const guideContent: Record<string, GuideContent> = {
  'hospital-level-guide': hospitalLevelGuide,
  'medical-department-guide': medicalDepartmentGuide,
  'referral-guide': referralGuide,
  'nhi-copayment-guide': nhiCopaymentGuide,
  'chronic-prescription-guide': chronicPrescriptionGuide,
  'first-visit-guide': firstVisitGuide,
  'emergency-guide': emergencyGuide,
  'nhi-card-usage-guide': nhiCardUsageGuide,
  'nhi-enrollment-guide': nhiEnrollmentGuide,
  'nhi-app-guide': nhiAppGuide,
  'prescription-guide': prescriptionGuide,
  'drug-interaction-guide': drugInteractionGuide,
  'medicine-storage-guide': medicineStorageGuide,
  'urine-test-guide': urineTestGuide,
  'liver-function-guide': liverFunctionGuide,
  'kidney-function-guide': kidneyFunctionGuide,
  'blood-sugar-guide': bloodSugarGuide,
  'elderly-medical-guide': elderlyMedicalGuide,
  'child-medical-guide': childMedicalGuide,
  'pregnancy-checkup-guide': pregnancyCheckupGuide,
  'diabetes-management-guide': diabetesManagementGuide,
};

export function getGuideContent(slug: string): GuideContent | undefined {
  return guideContent[slug];
}