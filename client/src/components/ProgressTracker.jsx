import { HiSparkles, HiTrophy, HiFire, HiChartBar } from 'react-icons/hi2'
import { useUser } from '../contexts/UserContext'
import '../styles/components/progress-tracker.css'

function ProgressTracker() {
  const { user } = useUser()
  const progress = user?.progress || {}
  const level = progress.level || 1
  const points = progress.points || 0
  const streak = progress.streak || 0
  const achievements = progress.achievements || []

  // Calculate progress to next level
  const pointsInCurrentLevel = points % 100
  const pointsToNextLevel = 100 - pointsInCurrentLevel
  const progressPercentage = (pointsInCurrentLevel / 100) * 100

  // Calculate total achievements possible
  const totalAchievements = 10
  const achievementsUnlocked = achievements.length

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h3 className="progress-title">Your Progress</h3>
        <div className="progress-level-badge">
          <HiSparkles />
          Level {level}
        </div>
      </div>

      <div className="progress-stats">
        <div className="progress-stat">
          <div className="stat-icon points">
            <HiChartBar />
          </div>
          <div className="stat-content">
            <div className="stat-value">{points}</div>
            <div className="stat-label">Points</div>
          </div>
        </div>

        <div className="progress-stat">
          <div className="stat-icon streak">
            <HiFire />
          </div>
          <div className="stat-content">
            <div className="stat-value">{streak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>

        <div className="progress-stat">
          <div className="stat-icon achievements">
            <HiTrophy />
          </div>
          <div className="stat-content">
            <div className="stat-value">{achievementsUnlocked}/{totalAchievements}</div>
            <div className="stat-label">Achievements</div>
          </div>
        </div>
      </div>

      <div className="progress-bar-section">
        <div className="progress-bar-header">
          <span className="progress-bar-label">Progress to Level {level + 1}</span>
          <span className="progress-bar-points">{pointsToNextLevel} points to go</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {achievements.length > 0 && (
        <div className="achievements-section">
          <h4 className="achievements-title">Recent Achievements</h4>
          <div className="achievements-list">
            {achievements.slice(-3).map((achievement, idx) => (
              <div key={idx} className="achievement-badge">
                <HiTrophy />
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressTracker

