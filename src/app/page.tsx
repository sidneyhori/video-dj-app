'use client';

import { useState } from 'react';
import { Play, Square, Volume2 } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPattern, setCurrentPattern] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) return;

    // TODO: Implement NLP processing and Strudel pattern generation
    setCurrentPattern(`// Generated from: "${input}"\nsound("bd hh sd hh").cpm(120)`);
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    // TODO: Stop Strudel playback
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Video DJ
          </h1>
          <p className="text-xl text-gray-300">
            Create music with natural language • Powered by Strudel.cc
          </p>
        </header>

        {/* Main Interface */}
        <div className="max-w-4xl mx-auto">
          {/* Input Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4">Tell me what to play</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 'dark techno with heavy bass' or 'chill ambient vibes'"
                className="flex-1 px-6 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button
                onClick={handleGenerate}
                disabled={!input.trim()}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Control Panel */}
          {currentPattern && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Controls</h2>
                <div className="flex items-center gap-4">
                  <Volume2 className="w-6 h-6" />
                  <button
                    onClick={isPlaying ? handleStop : handleGenerate}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      isPlaying
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-5 h-5" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Play
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Pattern Display */}
              <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
                <pre className="text-green-400">{currentPattern}</pre>
              </div>

              {/* Quick Modifications */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Quick modifications</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'make it faster',
                    'add more bass',
                    'make it darker',
                    'add percussion',
                    'slow it down',
                    'make it ambient'
                  ].map((mod) => (
                    <button
                      key={mod}
                      className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                      onClick={() => setInput(mod)}
                    >
                      {mod}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Visual Display Placeholder */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4">Visuals</h2>
            <div className="aspect-video bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-xl flex items-center justify-center">
              <p className="text-gray-300">
                {isPlaying ? '🎵 Audio visualizer coming soon...' : 'Start playing music to see visuals'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-400">
          <p>Built with Next.js & Strudel.cc • Open source on GitHub</p>
        </footer>
      </div>
    </div>
  );
}