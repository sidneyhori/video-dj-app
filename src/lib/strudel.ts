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
    // Import mini modules first
    const mini = await import('@strudel/mini');

    strudelRepl = repl({
      defaultOutput: 'webaudio',
      prebake: () => mini,
    });

    // Initialize the REPL properly
    await strudelRepl.init();

    isInitialized = true;
    console.log('Strudel REPL initialized successfully');
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
    // Set the pattern first
    await strudelRepl.evaluate(pattern);

    // Start the scheduler if not already started
    if (!controls.started) {
      await strudelRepl.start();
    }

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