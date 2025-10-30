"use client";

import { motion } from "framer-motion";

interface QuizCardSkeletonProps {
  index: number;
}

export default function QuizCardSkeleton({ index }: QuizCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full"
    >
      {/* Header skeleton */}
      <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Content skeleton */}
      <div className="p-6">
        {/* Title skeleton */}
        <div className="mb-2">
          <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.2,
              }}
            />
          </div>
          <div className="h-5 bg-gray-200 rounded-md w-1/2 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.3,
              }}
            />
          </div>
        </div>

        {/* Description skeleton */}
        <div className="mb-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.4,
              }}
            />
          </div>
          <div className="h-4 bg-gray-200 rounded w-5/6 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.5,
              }}
            />
          </div>
          <div className="h-4 bg-gray-200 rounded w-2/3 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.6,
              }}
            />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.7,
                }}
              />
            </div>
            <div className="h-4 bg-gray-200 rounded w-20 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.8,
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.9,
                }}
              />
            </div>
            <div className="h-4 bg-gray-200 rounded w-16 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1.0,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom row skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded-full w-20 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 1.1,
              }}
            />
          </div>
          <div className="h-4 bg-gray-200 rounded w-24 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 1.2,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
