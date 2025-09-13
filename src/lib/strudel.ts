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

    isInitialized = true;
    console.log('Strudel REPL created successfully');
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

  console.log('=== DEBUGGING STRUDEL FUNCTIONS ===');

  // Test 1: Try basic JavaScript evaluation
  try {
    const jsTest = await strudelRepl.evaluate('1 + 1');
    console.log('✅ Basic JS works:', jsTest);
  } catch (error) {
    console.log('❌ Basic JS failed:', error);
  }

  // Test 2: Check what's in the global context
  try {
    const globalsTest = await strudelRepl.evaluate('Object.keys(this)');
    console.log('✅ Global context keys:', globalsTest);
  } catch (error) {
    console.log('❌ Globals check failed:', error);
  }

  // Test 3: Check if typical Strudel functions exist
  const testFunctions = ['s', 'sound', 'note', 'stack', 'silence'];
  for (const func of testFunctions) {
    try {
      const funcTest = await strudelRepl.evaluate(`typeof ${func}`);
      console.log(`✅ ${func}:`, funcTest);
    } catch (error) {
      console.log(`❌ ${func}: not available`);
    }
  }

  // Test 4: Try the actual pattern
  try {
    const result = await strudelRepl.evaluate(pattern);
    console.log('Pattern evaluated successfully:', pattern);
    console.log('Result:', result);
    return result;
  } catch (error) {
    console.error('Failed to play pattern:', error);
    console.error('Pattern was:', pattern);
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