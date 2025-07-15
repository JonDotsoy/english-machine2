import { atom, map } from "nanostores";
import type { Question } from "@/components/dto/question";

// Tipo para representar el estado de una pregunta en la sesión
export type SessionQuestion = {
  question: string;
  answer: string;
  example?: string;
  choices: string[];
  originalIndex: number;
  shuffledChoices: string[];
  selectedAnswer?: string;
  isCorrect?: boolean;
  meaning?: string; // Added meaning field to align with Question type
};

// Tipo para el estado de una sesión por tipo de pregunta
export type SessionState = {
  questions: SessionQuestion[];
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  isCompleted: boolean;
  startTime?: Date;
  endTime?: Date;
};

// Tipo para el estado global de todas las sesiones
export type GlobalSessionState = {
  [questionType: string]: SessionState;
};

// Store principal que contiene todas las sesiones por tipo
export const sessionStore = map<GlobalSessionState>({});

// Store para el tipo de pregunta actualmente seleccionado
export const currentQuestionTypeStore = atom<string | null>(null);

// Función para inicializar una sesión para un tipo específico
export function initializeSession(questionType: string, questions: Question[]) {
  const shuffledQuestions = [...questions]
    .sort(() => Math.random() - 0.5)
    .map((q, index) => ({
      question: q.question,
      answer: q.answer, // mantenemos el typo del esquema original
      example: q.example,
      choices: q.choices || [],
      originalIndex: index,
      shuffledChoices: (q.choices || []).sort(() => Math.random() - 0.5),
      meaning: q.meaning, // Added meaning field initialization
    }));

  const sessionState: SessionState = {
    questions: shuffledQuestions,
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: shuffledQuestions.length,
    isCompleted: false,
    startTime: new Date(),
  };

  sessionStore.setKey(questionType, sessionState);
  currentQuestionTypeStore.set(questionType);
}

// Función para responder una pregunta
export function answerQuestion(
  questionType: string,
  questionIndex: number,
  selectedAnswer: string,
) {
  const currentSession = sessionStore.get()[questionType];
  if (!currentSession) return;

  const updatedQuestions = [...currentSession.questions];
  const question = updatedQuestions[questionIndex];

  if (question) {
    question.selectedAnswer = selectedAnswer;
    question.isCorrect = selectedAnswer === question.answer;

    // Recalcular el score basado en todas las respuestas correctas
    const newScore = updatedQuestions.filter(
      (q) => q.isCorrect === true,
    ).length;

    const updatedSession: SessionState = {
      ...currentSession,
      questions: updatedQuestions,
      score: newScore,
    };

    sessionStore.setKey(questionType, updatedSession);
  }
}

// Función para avanzar a la siguiente pregunta
export function nextQuestion(questionType: string) {
  const currentSession = sessionStore.get()[questionType];
  if (!currentSession) return;

  const nextIndex = currentSession.currentQuestionIndex + 1;
  const isCompleted = nextIndex >= currentSession.totalQuestions;

  const updatedSession: SessionState = {
    ...currentSession,
    currentQuestionIndex: nextIndex,
    isCompleted,
    endTime: isCompleted ? new Date() : currentSession.endTime,
  };

  sessionStore.setKey(questionType, updatedSession);
}

// Función para ir a la pregunta anterior
export function previousQuestion(questionType: string) {
  const currentSession = sessionStore.get()[questionType];
  if (!currentSession) return;

  const previousIndex = Math.max(0, currentSession.currentQuestionIndex - 1);

  const updatedSession: SessionState = {
    ...currentSession,
    currentQuestionIndex: previousIndex,
  };

  sessionStore.setKey(questionType, updatedSession);
}

// Función para ir a una pregunta específica
export function goToQuestion(questionType: string, questionIndex: number) {
  const currentSession = sessionStore.get()[questionType];
  if (!currentSession) return;

  const clampedIndex = Math.max(
    0,
    Math.min(questionIndex, currentSession.totalQuestions - 1),
  );

  const updatedSession: SessionState = {
    ...currentSession,
    currentQuestionIndex: clampedIndex,
  };

  sessionStore.setKey(questionType, updatedSession);
}

// Función para responder la pregunta actual
export function answerCurrentQuestion(
  questionType: string,
  selectedAnswer: string,
) {
  const currentSession = sessionStore.get()[questionType];
  if (!currentSession) return;

  answerQuestion(
    questionType,
    currentSession.currentQuestionIndex,
    selectedAnswer,
  );
}

// Función para reiniciar una sesión
export function resetSession(questionType: string) {
  const currentSession = sessionStore.get()[questionType];
  if (!currentSession) return;

  const resetQuestions = currentSession.questions.map((q) => ({
    ...q,
    selectedAnswer: undefined,
    isCorrect: undefined,
    shuffledChoices: [...q.choices].sort(() => Math.random() - 0.5),
  }));

  const resetSession: SessionState = {
    ...currentSession,
    questions: resetQuestions,
    currentQuestionIndex: 0,
    score: 0,
    isCompleted: false,
    startTime: new Date(),
    endTime: undefined,
  };

  sessionStore.setKey(questionType, resetSession);
}

// Función para obtener el estado de una sesión específica
export function getSessionState(
  questionType: string,
): SessionState | undefined {
  return sessionStore.get()[questionType];
}

// Función para obtener la pregunta actual
export function getCurrentQuestion(
  questionType: string,
): SessionQuestion | undefined {
  const session = getSessionState(questionType);
  if (!session) return undefined;

  return session.questions[session.currentQuestionIndex];
}

// Función para obtener el progreso de la sesión
export function getSessionProgress(questionType: string): {
  current: number;
  total: number;
  percentage: number;
} {
  const session = getSessionState(questionType);
  if (!session) return { current: 0, total: 0, percentage: 0 };

  const current = session.currentQuestionIndex + 1;
  const total = session.totalQuestions;
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return { current, total, percentage };
}

// Función para obtener las estadísticas de la sesión
export function getSessionStats(questionType: string): {
  score: number;
  totalQuestions: number;
  percentage: number;
  duration?: number;
} {
  const session = getSessionState(questionType);
  if (!session) return { score: 0, totalQuestions: 0, percentage: 0 };

  const percentage =
    session.totalQuestions > 0
      ? (session.score / session.totalQuestions) * 100
      : 0;

  let duration: number | undefined;
  if (session.startTime && session.endTime) {
    duration = session.endTime.getTime() - session.startTime.getTime();
  }

  return {
    score: session.score,
    totalQuestions: session.totalQuestions,
    percentage,
    duration,
  };
}
