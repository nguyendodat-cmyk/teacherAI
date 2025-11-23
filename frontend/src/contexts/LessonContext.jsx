import { createContext, useContext, useState, useCallback } from 'react';
import lessonsSeed from '../sampleData/lessons_seed.json';

const LessonContext = createContext();

export const LessonProvider = ({ children }) => {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepResults, setStepResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Get all available lessons for selector UI
  const allLessons = lessonsSeed.lessons;

  // Load a specific lesson by ID
  const loadLessonById = useCallback(async (lessonId) => {
    setIsLoading(true);
    try {
      const lesson = lessonsSeed.lessons.find(l => l.lesson_id === lessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        setCurrentStepIndex(0);
        setStepResults({});
        console.log('Loaded lesson:', lesson);
      } else {
        console.error('Lesson not found:', lessonId);
      }
    } catch (error) {
      console.error('Failed to load lesson:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTodaysLesson = useCallback(async (lessonId = null) => {
    setIsLoading(true);
    try {
      // If lessonId provided, load that specific lesson
      // Otherwise default to Logistics lesson for demo
      // TODO: Later integrate with API to get recommended lesson
      const targetId = lessonId || 'logistics_booking_container';
      const lesson = lessonsSeed.lessons.find(l => l.lesson_id === targetId)
                  || lessonsSeed.lessons[0];
      setCurrentLesson(lesson);
      setCurrentStepIndex(0);
      setStepResults({});
      console.log('Loaded lesson:', lesson);
    } catch (error) {
      console.error('Failed to load lesson:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const nextStep = useCallback(() => {
    if (currentLesson && currentStepIndex < currentLesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentLesson, currentStepIndex]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const recordStepResult = useCallback((stepIndex, result) => {
    setStepResults(prev => ({
      ...prev,
      [stepIndex]: result
    }));
  }, []);

  const completeLesson = useCallback(async () => {
    try {
      const totalScore = Object.values(stepResults).reduce((sum, r) => sum + (r.score || 0), 0);
      const avgScore = totalScore / Object.keys(stepResults).length;

      console.log('Lesson completed:', {
        lesson_id: currentLesson.lesson_id,
        step_results: stepResults,
        overall_score: avgScore
      });

      // Mock API call - later will be actual POST to /api/lessons/complete
      // await fetch('/api/lessons/complete', { method: 'POST', body: JSON.stringify(...) })

      return { success: true, score: avgScore };
    } catch (error) {
      console.error('Failed to complete lesson:', error);
      throw error;
    }
  }, [stepResults, currentLesson]);

  const currentStep = currentLesson?.steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentLesson ? currentStepIndex === currentLesson.steps.length - 1 : false;
  const progress = currentLesson ? ((currentStepIndex + 1) / currentLesson.steps.length) * 100 : 0;

  return (
    <LessonContext.Provider value={{
      currentLesson,
      currentStep,
      currentStepIndex,
      stepResults,
      isLoading,
      isFirstStep,
      isLastStep,
      progress,
      allLessons,
      loadTodaysLesson,
      loadLessonById,
      nextStep,
      previousStep,
      recordStepResult,
      completeLesson
    }}>
      {children}
    </LessonContext.Provider>
  );
};

export const useLesson = () => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLesson must be used within LessonProvider');
  }
  return context;
};
