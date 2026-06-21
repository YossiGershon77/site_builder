'use client';

import type { SetupTranslations } from '@/lib/setup/translations';

export function SetupStepper({
  currentStep,
  onStepClick,
  labels,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
  labels: SetupTranslations['stepper'];
}) {
  const STEPS = [
    { id: 1, label: labels.details, icon: '🏪' },
    { id: 2, label: labels.services, icon: '✂️' },
    { id: 3, label: labels.hours, icon: '🕐' },
    { id: 4, label: labels.gallery, icon: '📷' },
    { id: 5, label: labels.staff, icon: '👥' },
  ] as const;
  return (
    <div className="flex items-center justify-between mb-10">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isFuture = currentStep < step.id;
        const lineCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <button
                type="button"
                disabled={isFuture}
                onClick={() => isCompleted && onStepClick(step.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  isCompleted
                    ? 'bg-green-500 text-white cursor-pointer'
                    : isCurrent
                      ? 'bg-[#111111] text-white'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </button>
              <span
                className={`text-[10px] sm:text-xs truncate max-w-[56px] sm:max-w-none ${
                  isFuture ? 'text-gray-300' : 'text-[#111111]'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 mx-1 sm:mx-2 transition-colors ${
                  lineCompleted ? 'bg-[#111111]' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
