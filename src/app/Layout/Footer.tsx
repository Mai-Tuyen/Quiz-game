import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-2xl">🎯</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Quiz Game
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 MaiTuyen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
