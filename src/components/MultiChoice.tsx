import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import type { Question } from "./dto/question";
import { useStore } from "@nanostores/react";
import {
  sessionStore,
  initializeSession,
  getCurrentQuestion,
  getSessionProgress,
  getSessionStats,
  answerCurrentQuestion,
  nextQuestion,
  previousQuestion,
} from "@/stores/session";
import { ChevronLeft, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";
import { animationStore, examModeStore } from "@/components/settings/store";
import { SparklesText } from "./magicui/sparkles-text";

const MultiChoice: React.FC<{ type: string; questions: Question[] }> = ({
  type,
  questions,
}) => {
  const sessions = useStore(sessionStore);
  const currentSession = sessions[type];
  const currentQuestion = getCurrentQuestion(type);
  const progress = getSessionProgress(type);
  const stats = getSessionStats(type);
  const animationEnabled = useStore(animationStore);
  const examMode = useStore(examModeStore);
  const [showResults, setShowResults] = React.useState(false);

  // Detect desktop for UI (numeric labels)
  const [isDesktop, setIsDesktop] = React.useState(false);

  // Audio playback state
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Initialize session if it doesn't exist
  useEffect(() => {
    if (!currentSession && questions.length > 0) {
      initializeSession(type, questions);
    }
  }, [type, questions, currentSession]);

  // Play audio from base64 if available
  const handlePlayAudio = () => {
    if (!currentQuestion || !currentQuestion.audioBase64) return;
    const audioSrc = `data:audio/mp3;base64,${currentQuestion.audioBase64}`;
    if (!audioRef.current) {
      audioRef.current = new window.Audio(audioSrc);
      audioRef.current.onended = () => setIsPlaying(false);
    } else {
      audioRef.current.src = audioSrc;
    }
    setIsPlaying(true);
    audioRef.current.play();
  };

  // Detect desktop on mount
  useEffect(() => {
    setIsDesktop(window.matchMedia("(pointer:fine)").matches);
  }, []);

  // Keyboard navigation for desktop only
  useEffect(() => {
    // Simple desktop detection
    const isDesktop = window.matchMedia("(pointer:fine)").matches;
    if (!isDesktop) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (/^[1-9]$/.test(e.key)) {
        // Select choice by number (1-based)
        const idx = parseInt(e.key, 10) - 1;
        if (
          currentQuestion &&
          Array.isArray(currentQuestion.shuffledChoices) &&
          idx >= 0 &&
          idx < currentQuestion.shuffledChoices.length
        ) {
          handleAnswerSelect(currentQuestion.shuffledChoices[idx]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSession, currentQuestion]);

  // If there's no session yet, show loading
  if (!currentSession || !currentQuestion) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading session...</p>
      </div>
    );
  }

  const handleAnswerSelect = (
    selectedAnswer: string,
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    answerCurrentQuestion(type, selectedAnswer);
    // Mostrar confetti solo si la animación está habilitada, la respuesta es correcta y NO está en modo examen
    if (
      animationEnabled &&
      selectedAnswer === currentQuestion.answer &&
      !examMode
    ) {
      if (e) {
        const { clientX, clientY, currentTarget } = e;
        // Calculate origin relative to viewport for canvas-confetti
        const rect = currentTarget.getBoundingClientRect();
        const x = clientX || rect.left + rect.width / 2;
        const y = clientY || rect.top + rect.height / 2;
        confetti({
          origin: { x: x / window.innerWidth, y: y / window.innerHeight },
        });
      } else {
        confetti();
      }
    }
  };

  const handleNext = () => {
    if (
      currentSession.currentQuestionIndex <
      currentSession.totalQuestions - 1
    ) {
      nextQuestion(type);
    }
  };

  const handlePrevious = () => {
    if (currentSession.currentQuestionIndex > 0) {
      previousQuestion(type);
    }
  };

  const getButtonVariant = (choice: string) => {
    // En modo examen y sin mostrar resultados, el seleccionado es gris (outline), sin feedback de correcto/incorrecto
    if (examMode && !showResults) {
      return "outline";
    }
    if (!currentQuestion.selectedAnswer) return "outline";

    if (choice === currentQuestion.selectedAnswer) {
      return choice === currentQuestion.answer ? "default" : "destructive";
    }

    // Don't show the correct answer if an incorrect one is selected
    return "outline";
  };

  const getButtonClassName = (choice: string) => {
    // En modo examen y sin mostrar resultados, el seleccionado es gris (bg-gray-300), sin feedback de correcto/incorrecto
    if (examMode && !showResults) {
      if (choice === currentQuestion.selectedAnswer) {
        return "w-full mb-2 bg-gray-300 hover:bg-gray-400";
      }
      return "w-full mb-2";
    }
    if (!currentQuestion.selectedAnswer) return "w-full mb-2";

    if (choice === currentQuestion.selectedAnswer) {
      return choice === currentQuestion.answer
        ? "w-full mb-2 bg-green-600 hover:bg-green-700 text-white"
        : "w-full mb-2 bg-red-600 hover:bg-red-700 text-white";
    }

    // Don't highlight the correct answer if an incorrect one is selected
    return "w-full mb-2 bg-gray-300 hover:bg-gray-400";
  };

  return (
    <div className="container mx-auto p-4">
      {/* Exam mode controls */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => examModeStore.set(!examMode)}
          variant={examMode ? "default" : "outline"}
          size="sm"
        >
          {examMode ? "Salir de examen" : "Modo examen"}
        </Button>
        {examMode && (
          <Button
            onClick={() => setShowResults(!showResults)}
            variant="secondary"
            size="sm"
            className="ml-2"
          >
            Resultados
          </Button>
        )}
      </div>
      {/* Header with statistics */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Question {progress.current} of {progress.total}
          </div>
          {!examMode && (
            <div className="text-sm text-gray-600">
              Score: {stats.score}/{stats.totalQuestions} (
              {stats.percentage.toFixed(1)}%)
            </div>
          )}
          {examMode && showResults && (
            <div className="text-sm text-gray-600">
              Resultado: {stats.score}/{stats.totalQuestions} (
              {stats.percentage.toFixed(1)}%)
            </div>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={handlePrevious}
          disabled={currentSession.currentQuestionIndex === 0}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <span className="text-sm text-gray-500">
          {currentSession.currentQuestionIndex + 1} /{" "}
          {currentSession.totalQuestions}
        </span>

        <Button
          onClick={handleNext}
          disabled={
            currentSession.currentQuestionIndex ===
            currentSession.totalQuestions - 1
          }
          variant="outline"
          size="sm"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Current question */}
      <div className="mb-6 p-4 bg-white rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">
          {currentQuestion.question}
          {currentQuestion && !!currentQuestion.audioBase64 && (
            <>
              {" "}
              <Button
                onClick={handlePlayAudio}
                variant="link"
                size={"sm"}
                aria-label="Play audio for question"
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <SparklesText className="text-sm">Playing...</SparklesText>
                ) : (
                  "Play"
                )}
              </Button>
            </>
          )}
        </h3>

        {currentQuestion.example && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              <strong>Example:</strong> {currentQuestion.example}
            </p>
          </div>
        )}

        {currentQuestion.meaning && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <p className="text-sm text-green-800">
              <strong>Meaning:</strong> {currentQuestion.meaning}
            </p>
          </div>
        )}

        {/* Answer options */}
        <div className="space-y-2">
          {currentQuestion.shuffledChoices.map((choice, index) => (
            <Button
              key={`${choice}-${index}`}
              onClick={(e) => handleAnswerSelect(choice, e)}
              variant={getButtonVariant(choice)}
              className={getButtonClassName(choice)}
              aria-label={`Choice ${index + 1}: ${choice}`}
            >
              {isDesktop && (
                <span className="mr-2 text-xs text-gray-500">{index + 1}.</span>
              )}
              {choice}
            </Button>
          ))}
        </div>
      </div>

      {/* Additional information if answered */}
      {currentQuestion.selectedAnswer && (!examMode || showResults) && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm">
              Your answer: <strong>{currentQuestion.selectedAnswer}</strong>
            </span>
            <span
              className={`text-sm font-semibold ${
                currentQuestion.isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {currentQuestion.isCorrect ? "✓ Correct" : "✗ Incorrect"}
            </span>
          </div>
          {/* Only show the correct answer if answered correctly */}
          {currentQuestion.isCorrect && (
            <>
              <p className="text-sm text-gray-600 mt-2">
                Excellent! You selected the correct answer.
              </p>
              {currentQuestion.explanation && (
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-yellow-800">
                    <strong>Explanation:</strong> {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiChoice;
