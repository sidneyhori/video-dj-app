import { repl, controls } from '@strudel/core';
import '@strudel/webaudio';

let strudelRepl: any = null;
let isInitialized = false;

export const initStrudel = async () => {
  if (isInitialized) return strudelRepl;

  // Only initialize in browser environment
  if (typeof window === 'undefined') {
    throw new Error('Strudel can only be initialized in browser environment');
  }

  try {
    strudelRepl = repl({
      defaultOutput: 'webaudio',
      prebake: () => import('@strudel/mini'),
    });

    // Set a default silent pattern first to avoid "no pattern set" error
    await strudelRepl.evaluate('silence');
    await strudelRepl.start();
    isInitialized = true;

    console.log('Strudel initialized successfully');
    return strudelRepl;
  } catch (error) {
    console.error('Failed to initialize Strudel:', error);
    throw error;
  }
};

export const playPattern = async (pattern: string) => {
  if (!strudelRepl) {
    await initStrudel();
  }

  try {
    await strudelRepl.evaluate(pattern);
    console.log('Playing pattern:', pattern);
  } catch (error) {
    console.error('Failed to play pattern:', error);
    throw error;
  }
};

export const stopPattern = () => {
  if (strudelRepl) {
    controls.stop();
    console.log('Pattern stopped');
  }
};

export const isPlaying = () => {
  return controls.started;
};

export const cleanup = () => {
  if (strudelRepl) {
    controls.stop();
    strudelRepl = null;
    isInitialized = false;
  }
};