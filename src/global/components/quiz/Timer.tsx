"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimerProps {
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
  onTimeUp: () => void;
}

export default function Timer({
  timeRemaining,
  totalTime,
  onTimeUp,
}: TimerProps) {
  const [currentTime, setCurrentTime] = useState(timeRemaining);

  useEffect(() => {
    setCurrentTime(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (currentTime <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTime, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (currentTime / totalTime) * 100;
  const isLowTime = progressPercentage <= 10; // Last 10% of time
  const isCriticalTime = progressPercentage <= 5; // Last 5% of time

  const getTimerColor = () => {
    if (isCriticalTime) return "text-red-600";
    if (isLowTime) return "text-amber-600";
    return "text-green-600";
  };

  const getProgressColor = () => {
    if (isCriticalTime) return "bg-red-500";
    if (isLowTime) return "bg-amber-500";
    return "bg-green-500";
  };

  const getBackgroundColor = () => {
    if (isCriticalTime) return "bg-red-50 border-red-200";
    if (isLowTime) return "bg-amber-50 border-amber-200";
    return "bg-green-50 border-green-200";
  };

  return (
    <motion.div
      className={`p-4 rounded-lg border ${getBackgroundColor()}`}
      animate={{
        scale: isCriticalTime ? [1, 1.02, 1] : 1,
      }}
      transition={{
        duration: 1,
        repeat: isCriticalTime ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      <div className="text-center">
        {/* Timer Icon */}
        <motion.div
          className={`mx-auto mb-3 ${getTimerColor()}`}
          animate={{
            rotate: isCriticalTime ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            repeat: isCriticalTime ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>

        {/* Time Display */}
        <motion.div
          className={`text-2xl font-bold ${getTimerColor()}`}
          animate={{
            scale: isCriticalTime ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isCriticalTime ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          {formatTime(currentTime)}
        </motion.div>

        <div className="text-sm text-gray-600 mb-4">Time Remaining</div>

        {/* Circular Progress */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className="text-gray-200"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            {/* Progress circle */}
            <motion.path
              className={getProgressColor().replace("bg-", "text-")}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="100"
              initial={{ strokeDashoffset: 0 }}
              animate={{
                strokeDashoffset: 100 - progressPercentage,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-semibold ${getTimerColor()}`}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <motion.div
            className={`h-2 rounded-full ${getProgressColor()}`}
            initial={{ width: "100%" }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Warning Messages */}
        {isCriticalTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-red-600 text-xs font-medium bg-red-100 rounded px-2 py-1 mt-2"
          >
            ⚠️ Critical Time!
          </motion.div>
        )}
        {isLowTime && !isCriticalTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-amber-600 text-xs font-medium bg-amber-100 rounded px-2 py-1 mt-2"
          >
            ⏰ Running Low on Time
          </motion.div>
        )}

        {/* Total Time Info */}
        <div className="text-xs text-gray-500 mt-2">
          Total: {formatTime(totalTime)}
        </div>
      </div>
    </motion.div>
  );
}
