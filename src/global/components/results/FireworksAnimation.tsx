"use client";

import { motion } from "framer-motion";

export default function FireworksAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Animated background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
      />

      {/* Celebration text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1.2, 1, 1],
          y: [50, -20, -20, -100],
        }}
        transition={{
          duration: 4,
          times: [0, 0.2, 0.8, 1],
          ease: "easeOut",
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            className="text-8xl mb-4"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: 3,
              ease: "easeInOut",
            }}
          >
            🏆
          </motion.div>
          <motion.h1
            className="text-6xl font-bold text-white drop-shadow-lg"
            animate={{
              scale: [1, 1.05, 1],
              textShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 40px rgba(255,255,255,0.8)",
                "0 0 20px rgba(255,255,255,0.5)",
              ],
            }}
            transition={{
              duration: 1,
              repeat: 2,
              ease: "easeInOut",
            }}
          >
            PERFECT!
          </motion.h1>
          <motion.p
            className="text-2xl text-white drop-shadow-md mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Outstanding Achievement! 🎉
          </motion.p>
        </div>
      </motion.div>

      {/* Animated sparkles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 10,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            y: -10,
            scale: [0, 1, 0],
            rotate: 360,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Floating celebration emojis */}
      {["🎉", "🎊", "⭐", "🌟", "✨", "💫", "🏆", "👏"].map((emoji, i) => (
        <motion.div
          key={emoji + i}
          className="absolute text-4xl"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            rotate: 0,
            scale: 0,
          }}
          animate={{
            y: -100,
            rotate: 360,
            scale: [0, 1.5, 1, 0],
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            delay: Math.random() * 3,
            ease: "easeOut",
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Radial burst effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [0, 8, 12],
          opacity: [1, 0.3, 0],
        }}
        transition={{
          duration: 2,
          ease: "easeOut",
        }}
      >
        <div className="w-32 h-32 border-4 border-yellow-400 rounded-full" />
      </motion.div>

      {/* Secondary burst */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [0, 6, 10],
          opacity: [1, 0.5, 0],
        }}
        transition={{
          duration: 1.5,
          delay: 0.5,
          ease: "easeOut",
        }}
      >
        <div className="w-24 h-24 border-2 border-white rounded-full" />
      </motion.div>
    </div>
  );
}
