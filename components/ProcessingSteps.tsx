import * as React from 'react';
import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { ProcessingStep } from '../types';

interface ProcessingStepsProps {
  isComplete: boolean;
}

const STEPS: Omit<ProcessingStep, 'status'>[] = [
  { id: 1, label: "Selecting Relevant Frameworks" },
  { id: 2, label: "Applying Combinatorial Logic" },
  { id: 3, label: "Drilling Down to First Principles" },
  { id: 4, label: "Validating Root Cause" },
  { id: 5, label: "Synthesizing Final Answer" },
];

const ProcessingSteps: React.FC<ProcessingStepsProps> = ({ isComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (isComplete) {
      setCurrentStepIndex(STEPS.length);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 2500); // Fake progress to match "Thinking" time roughly

    return () => clearInterval(interval);
  }, [isComplete]);

  return (
    <div className="space-y-4 font-mono text-sm max-w-md mx-auto mt-8">
      {STEPS.map((step, index) => {
        let status: 'pending' | 'active' | 'completed' = 'pending';
        if (index < currentStepIndex) status = 'completed';
        else if (index === currentStepIndex) status = isComplete ? 'completed' : 'active';

        return (
          <div key={step.id} className="flex items-center space-x-3 transition-colors duration-300">
            <div className="flex-shrink-0">
              {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-success" />}
              {status === 'active' && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
              {status === 'pending' && <Circle className="w-5 h-5 text-gray-700" />}
            </div>
            <span className={`
              ${status === 'completed' ? 'text-gray-300' : ''}
              ${status === 'active' ? 'text-white font-bold' : ''}
              ${status === 'pending' ? 'text-gray-600' : ''}
            `}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProcessingSteps;