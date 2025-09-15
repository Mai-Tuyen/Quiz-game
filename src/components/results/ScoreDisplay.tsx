"use client";

import { motion } from "framer-motion";

interface ScoreDisplayProps {
  score: number;
  maxScore: number;
  timeTaken: number; // in seconds
  timeLimit: number; // in seconds
  performanceMessage: string;
}

export default function ScoreDisplay({
  score,
  maxScore,
  timeTaken,
  timeLimit,
  performanceMessage,
}: ScoreDisplayProps) {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const timePercentage = timeLimit > 0 ? (timeTaken / timeLimit) * 100 : 0;

  const getScoreColor = () => {
    if (percentage === 100) return "text-yellow-500"; // Gold for perfect
    if (percentage >= 90) return "text-green-500";
    if (percentage >= 80) return "text-blue-500";
    if (percentage >= 70) return "text-purple-500";
    if (percentage >= 60) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBackground = () => {
    if (percentage === 100) return "from-yellow-400 to-yellow-600";
    if (percentage >= 90) return "from-green-400 to-green-600";
    if (percentage >= 80) return "from-blue-400 to-blue-600";
    if (percentage >= 70) return "from-purple-400 to-purple-600";
    if (percentage >= 60) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto mb-12"
    >
      {/* Main Score Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header with gradient */}
        <div
          className={`bg-gradient-to-r ${getScoreBackground()} p-8 text-white text-center`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="mb-4"
          >
            {percentage === 100 ? (
              <div className="text-8xl mb-2">🏆</div>
            ) : percentage >= 90 ? (
              <div className="text-8xl mb-2">🌟</div>
            ) : percentage >= 80 ? (
              <div className="text-8xl mb-2">👏</div>
            ) : percentage >= 70 ? (
              <div className="text-8xl mb-2">👍</div>
            ) : (
              <div className="text-8xl mb-2">💪</div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-2">{performanceMessage}</h2>
            <p className="text-xl opacity-90">Your Results</p>
          </motion.div>
        </div>

        {/* Score Details */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Score Circle */}
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6">
                {/* Background Circle */}
                <svg
                  className="w-48 h-48 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                  />
                  {/* Progress Circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 40 * (1 - percentage / 100),
                    }}
                    transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stopColor={
                          percentage === 100
                            ? "#fbbf24"
                            : percentage >= 90
                            ? "#10b981"
                            : percentage >= 80
                            ? "#3b82f6"
                            : percentage >= 70
                            ? "#8b5cf6"
                            : percentage >= 60
                            ? "#f59e0b"
                            : "#ef4444"
                        }
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          percentage === 100
                            ? "#f59e0b"
                            : percentage >= 90
                            ? "#059669"
                            : percentage >= 80
                            ? "#2563eb"
                            : percentage >= 70
                            ? "#7c3aed"
                            : percentage >= 60
                            ? "#d97706"
                            : "#dc2626"
                        }
                      />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Score Text in Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 200 }}
                    className={`text-4xl font-bold ${getScoreColor()}`}
                  >
                    {score}
                  </motion.div>
                  <div className="text-2xl text-gray-400">/ {maxScore}</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className={`text-2xl font-bold ${getScoreColor()} mt-2`}
                  >
                    {Math.round(percentage)}%
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-lg font-semibold text-gray-700 mb-1">
                  Final Score
                </div>
                <div className="text-sm text-gray-500">
                  {score} points out of {maxScore} possible
                </div>
              </motion.div>
            </div>

            {/* Performance Stats */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">Accuracy</span>
                  <span className={`font-bold ${getScoreColor()}`}>
                    {Math.round(percentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full bg-gradient-to-r ${getScoreBackground()}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">Time Used</span>
                  <span className="font-bold text-gray-700">
                    {formatTime(timeTaken)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full ${
                      timePercentage <= 50
                        ? "bg-green-500"
                        : timePercentage <= 80
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(timePercentage, 100)}%` }}
                    transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatTime(timeLimit)} total time limit
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {score}
                  </div>
                  <div className="text-sm text-green-700">Correct</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {maxScore - score}
                  </div>
                  <div className="text-sm text-red-700">Incorrect</div>
                </div>
              </motion.div>

              {/* Performance Badges */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="flex flex-wrap gap-2"
              >
                {percentage === 100 && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    🏆 Perfect Score!
                  </span>
                )}
                {percentage >= 90 && percentage < 100 && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ Excellent!
                  </span>
                )}
                {timePercentage <= 50 && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    ⚡ Speed Demon!
                  </span>
                )}
                {score > 0 && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    🎯 Points Earned!
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
