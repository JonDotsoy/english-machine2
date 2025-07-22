import React from "react";
import { useStore } from "@nanostores/react";
import { animationStore, examModeStore } from "./store";

const SettingsForm: React.FC = () => {
  const animationEnabled = useStore(animationStore);
  const examModeEnabled = useStore(examModeStore);
  const [checked, setChecked] = React.useState(animationEnabled);
  const [examChecked, setExamChecked] = React.useState(examModeEnabled);

  React.useEffect(() => {
    setChecked(animationEnabled);
  }, [animationEnabled]);
  React.useEffect(() => {
    setExamChecked(examModeEnabled);
  }, [examModeEnabled]);

  // Persist immediately on toggle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    animationStore.set(e.target.checked);
    console.log("Animation setting updated:", e.target.checked);
  };

  const handleExamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExamChecked(e.target.checked);
    examModeStore.set(e.target.checked);
    console.log("Exam mode setting updated:", e.target.checked);
  };

  return (
    <form className="space-y-6 mx-auto bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="animation" className="flex items-center">
          <input
            type="checkbox"
            id="animation"
            name="animation"
            className="mr-2"
            checked={checked}
            onChange={handleChange}
          />
          Enable animations in MultiChoice forms
        </label>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            If enabled, you will see a confetti animation when you answer
            correctly in MultiChoice exercises.
          </p>
        </div>
      </div>
      <div>
        <label htmlFor="examMode" className="flex items-center">
          <input
            type="checkbox"
            id="examMode"
            name="examMode"
            className="mr-2"
            checked={examChecked}
            onChange={handleExamChange}
          />
          Enable exam mode by default
        </label>
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-800">
            If enabled, exercises will start in exam mode, hiding immediate
            feedback until you choose to see results.
          </p>
        </div>
      </div>
    </form>
  );
};

export default SettingsForm;
