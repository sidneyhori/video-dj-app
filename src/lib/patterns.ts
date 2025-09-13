export interface MusicRequest {
  genre?: string;
  mood?: string;
  tempo?: 'slow' | 'medium' | 'fast';
  instruments?: string[];
  energy?: 'low' | 'medium' | 'high';
  effects?: string[];
}

export const genrePatterns = {
  techno: {
    base: '"bd hh sd hh"',
    tempo: 128,
    effects: ['lpf', 'delay', 'distort']
  },
  house: {
    base: '"bd ~ bd ~"',
    tempo: 124,
    effects: ['lpf', 'reverb']
  },
  ambient: {
    base: '"pad*2"',
    tempo: 80,
    effects: ['reverb', 'delay', 'lpf']
  },
  drum_and_bass: {
    base: '"bd ~ ~ ~"',
    tempo: 174,
    effects: ['lpf', 'hpf', 'distort']
  },
  trap: {
    base: '"bd ~ bd ~"',
    tempo: 140,
    effects: ['reverb', 'delay']
  }
};

export const moodModifiers = {
  dark: {
    filters: ['lpf(200)', 'gain(0.8)'],
    effects: ['room(0.9)', 'distort(0.2)']
  },
  bright: {
    filters: ['hpf(100)', 'gain(1.2)'],
    effects: ['reverb(0.3)', 'delay(0.1)']
  },
  chill: {
    filters: ['lpf(600)', 'gain(0.7)'],
    effects: ['reverb(0.5)', 'delay(0.3)']
  },
  aggressive: {
    filters: ['gain(1.5)'],
    effects: ['distort(0.4)', 'hpf(80)']
  },
  dreamy: {
    filters: ['lpf(400)', 'gain(0.6)'],
    effects: ['reverb(0.8)', 'delay(0.5)', 'room(0.7)']
  }
};

export const tempoModifiers = {
  slow: 0.7,
  medium: 1.0,
  fast: 1.3
};

export const instrumentSounds = {
  bass: 'sound("bass")',
  drums: 'sound("bd")',
  synth: 'sound("sawtooth")',
  pad: 'sound("pad")',
  percussion: 'sound("perc")',
  hihat: 'sound("hh")',
  snare: 'sound("sd")',
  kick: 'sound("bd")'
};

export const generatePattern = (request: MusicRequest): string => {
  const genre = request.genre?.toLowerCase() || 'techno';
  const mood = request.mood?.toLowerCase() || 'neutral';
  const tempo = request.tempo || 'medium';

  // Get base pattern
  const basePattern = genrePatterns[genre as keyof typeof genrePatterns] || genrePatterns.techno;
  let pattern = basePattern.base;

  // For now, just return the simple mini-notation pattern
  // We'll add complexity once basic patterns work
  return pattern;
};

export const parseNaturalLanguage = (input: string): MusicRequest => {
  const request: MusicRequest = {};
  const lowerInput = input.toLowerCase();

  // Genre detection
  if (lowerInput.includes('techno')) request.genre = 'techno';
  else if (lowerInput.includes('house')) request.genre = 'house';
  else if (lowerInput.includes('ambient')) request.genre = 'ambient';
  else if (lowerInput.includes('drum') || lowerInput.includes('dnb')) request.genre = 'drum_and_bass';
  else if (lowerInput.includes('trap')) request.genre = 'trap';

  // Mood detection
  if (lowerInput.includes('dark')) request.mood = 'dark';
  else if (lowerInput.includes('bright') || lowerInput.includes('happy')) request.mood = 'bright';
  else if (lowerInput.includes('chill') || lowerInput.includes('relax')) request.mood = 'chill';
  else if (lowerInput.includes('aggressive') || lowerInput.includes('hard')) request.mood = 'aggressive';
  else if (lowerInput.includes('dreamy') || lowerInput.includes('ethereal')) request.mood = 'dreamy';

  // Tempo detection
  if (lowerInput.includes('slow') || lowerInput.includes('down')) request.tempo = 'slow';
  else if (lowerInput.includes('fast') || lowerInput.includes('quick') || lowerInput.includes('up')) request.tempo = 'fast';
  else request.tempo = 'medium';

  // Instrument detection
  const instruments = [];
  if (lowerInput.includes('bass')) instruments.push('bass');
  if (lowerInput.includes('drum')) instruments.push('drums');
  if (lowerInput.includes('synth')) instruments.push('synth');
  if (lowerInput.includes('pad')) instruments.push('pad');
  if (lowerInput.includes('percussion') || lowerInput.includes('perc')) instruments.push('percussion');

  if (instruments.length > 0) request.instruments = instruments;

  return request;
};

export const modifyPattern = (currentPattern: string, modification: string): string => {
  const lowerMod = modification.toLowerCase();
  let modifiedPattern = currentPattern;

  // Extract the base pattern without metadata comments
  const lines = currentPattern.split('\n');
  const patternLine = lines.find(line => !line.startsWith('//')) || currentPattern;

  // Remove existing .cpm() if present to avoid conflicts
  const basePattern = patternLine.replace(/\.cpm\(\d+\)/, '');

  if (lowerMod.includes('faster') || lowerMod.includes('speed up')) {
    modifiedPattern = `${basePattern}.fast(1.5)`;
  } else if (lowerMod.includes('slower') || lowerMod.includes('slow down')) {
    modifiedPattern = `${basePattern}.slow(1.5)`;
  } else if (lowerMod.includes('more bass') || lowerMod.includes('heavier bass')) {
    modifiedPattern = `${basePattern}.gain(1.2).lpf(800)`;
  } else if (lowerMod.includes('less bass')) {
    modifiedPattern = `${basePattern}.hpf(200).gain(0.8)`;
  } else if (lowerMod.includes('darker') || lowerMod.includes('make it dark')) {
    modifiedPattern = `${basePattern}.lpf(300).room(0.8).gain(0.9)`;
  } else if (lowerMod.includes('brighter') || lowerMod.includes('make it bright')) {
    modifiedPattern = `${basePattern}.hpf(100).gain(1.1).delay(0.2)`;
  } else if (lowerMod.includes('add percussion') || lowerMod.includes('more percussion')) {
    modifiedPattern = `${basePattern}.add(sound("perc"))`;
  } else if (lowerMod.includes('ambient') || lowerMod.includes('make it ambient')) {
    modifiedPattern = `${basePattern}.slow(2).lpf(400).room(0.8)`;
  } else if (lowerMod.includes('distort') || lowerMod.includes('add distortion')) {
    modifiedPattern = `${basePattern}.distort(0.3).gain(0.9)`;
  } else if (lowerMod.includes('reverb') || lowerMod.includes('add reverb')) {
    modifiedPattern = `${basePattern}.room(0.6)`;
  } else if (lowerMod.includes('delay') || lowerMod.includes('add delay')) {
    modifiedPattern = `${basePattern}.delay(0.3)`;
  }

  return modifiedPattern;
};