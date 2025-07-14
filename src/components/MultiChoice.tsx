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

const MultiChoice: React.FC<{ type: string; db: Question[] }> = ({
  type,
  db,
}) => {
  const sessions = useStore(sessionStore);
  const currentSession = sessions[type];
  const currentQuestion = getCurrentQuestion(type);
  const progress = getSessionProgress(type);
  const stats = getSessionStats(type);

  // Inicializar sesión si no existe
  useEffect(() => {
    if (!currentSession && db.length > 0) {
      initializeSession(type, db);
    }
  }, [type, db, currentSession]);

  // Si no hay sesión aún, mostrar loading
  if (!currentSession || !currentQuestion) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Cargando sesión...</p>
      </div>
    );
  }

  const handleAnswerSelect = (selectedAnswer: string) => {
    answerCurrentQuestion(type, selectedAnswer);
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
    if (!currentQuestion.selectedAnswer) return "outline";

    if (choice === currentQuestion.selectedAnswer) {
      return choice === currentQuestion.answer ? "default" : "destructive";
    }

    // No mostrar la respuesta correcta si se seleccionó incorrecta
    return "outline";
  };

  const getButtonClassName = (choice: string) => {
    if (!currentQuestion.selectedAnswer) return "w-full mb-2";

    if (choice === currentQuestion.selectedAnswer) {
      return choice === currentQuestion.answer
        ? "w-full mb-2 bg-green-600 hover:bg-green-700 text-white"
        : "w-full mb-2 bg-red-600 hover:bg-red-700 text-white";
    }

    // No resaltar la respuesta correcta si se seleccionó incorrecta
    return "w-full mb-2 bg-gray-300 hover:bg-gray-400";
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header con estadísticas */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-2">{type}</h2>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Pregunta {progress.current} de {progress.total}
          </div>
          <div className="text-sm text-gray-600">
            Score: {stats.score}/{stats.totalQuestions} (
            {stats.percentage.toFixed(1)}%)
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Navegación */}
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={handlePrevious}
          disabled={currentSession.currentQuestionIndex === 0}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
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
          Siguiente
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Pregunta actual */}
      <div className="mb-6 p-4 bg-white rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">
          {currentQuestion.question}
        </h3>

        {currentQuestion.example && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              <strong>Ejemplo:</strong> {currentQuestion.example}
            </p>
          </div>
        )}

        {/* Opciones de respuesta */}
        <div className="space-y-2">
          {currentQuestion.shuffledChoices.map((choice, index) => (
            <Button
              key={choice}
              onClick={() => handleAnswerSelect(choice)}
              variant={getButtonVariant(choice)}
              className={getButtonClassName(choice)}
            >
              {choice}
            </Button>
          ))}
        </div>
      </div>

      {/* Información adicional si se ha respondido */}
      {currentQuestion.selectedAnswer && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm">
              Tu respuesta: <strong>{currentQuestion.selectedAnswer}</strong>
            </span>
            <span
              className={`text-sm font-semibold ${
                currentQuestion.isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {currentQuestion.isCorrect ? "✓ Correcto" : "✗ Incorrecto"}
            </span>
          </div>
          {/* Solo mostrar la respuesta correcta si se respondió correctamente */}
          {currentQuestion.isCorrect && (
            <p className="text-sm text-gray-600 mt-2">
              ¡Excelente! Has seleccionado la respuesta correcta.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiChoice;
