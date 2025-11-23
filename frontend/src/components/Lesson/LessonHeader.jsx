import { useState } from 'react';
import { useLesson } from '../../contexts/LessonContext';
import Icon from '../ui/Icon';
import './LessonHeader.css';

const LessonHeader = ({
  title,
  estimatedMinutes,
  currentStepIndex,
  totalSteps,
  progress,
  topic,
}) => {
  const { allLessons, loadLessonById, currentLesson } = useLesson();
  const [showSelector, setShowSelector] = useState(false);

  // Format topic for display
  const formattedTopic = topic ? topic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';

  const handleLessonSelect = (lessonId) => {
    loadLessonById(lessonId);
    setShowSelector(false);
  };

  return (
    <div className="lesson-header glass">
      <div className="lesson-header-main">
        <div className="lesson-title-block">
          <div className="lesson-label-row">
            <span className="lesson-label">
              <Icon name="bookOpen" size="sm" />
              Today's Lesson
            </span>
            <button
              className="lesson-selector-btn"
              onClick={() => setShowSelector(!showSelector)}
              title="Switch lesson"
            >
              <Icon name="chevronDown" size="sm" />
              <span>Switch</span>
            </button>
          </div>
          {showSelector && (
            <div className="lesson-selector-dropdown">
              {allLessons.map((lesson) => (
                <button
                  key={lesson.lesson_id}
                  className={`lesson-selector-item ${currentLesson?.lesson_id === lesson.lesson_id ? 'active' : ''}`}
                  onClick={() => handleLessonSelect(lesson.lesson_id)}
                >
                  <div className="selector-item-title">{lesson.title}</div>
                  <div className="selector-item-meta">
                    {lesson.title_vi && <span className="selector-item-vi">{lesson.title_vi}</span>}
                    <span className="selector-item-duration">{lesson.estimated_minutes} min</span>
                    {lesson.category && <span className="selector-item-category">{lesson.category}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
          <h2 className="lesson-title">{title}</h2>
          <div className="lesson-meta">
            <span className="lesson-chip">
              <Icon name="clock" size="sm" />
              ≈ {estimatedMinutes} min
            </span>
            {topic && (
              <span className="lesson-chip topic">
                <Icon name="tag" size="sm" />
                {formattedTopic}
              </span>
            )}
          </div>
        </div>

        <div className="lesson-step-indicator">
          <span className="step-text">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonHeader;
