import { WritingError, FlowMetrics } from '../types';

// A lightweight simulation of the "Local WASM" engine described in the PRD.
// Uses regex to find common style issues quickly (<50ms).

const WEASEL_WORDS = ['very', 'basically', 'actually', 'sort of', 'kind of', 'really'];
const PASSIVE_VOICE_INDICATORS = [
  /\b(am|are|is|was|were|be|been|being)\s+\w+ed\b/gi
];

export const localCheckErrors = (text: string): WritingError[] => {
  const errors: WritingError[] = [];
  
  // 1. Check for Weasel Words
  WEASEL_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      errors.push({
        id: `local-${match.index}`,
        type: 'style',
        startIndex: match.index,
        endIndex: match.index + word.length,
        original: match[0],
        suggestion: '', // Omit suggestion for style warnings sometimes
        confidence: 0.9,
        explanation: `The word "${word}" often weakens your statement. Consider removing it.`,
        source: 'local'
      });
    }
  });

  // 2. Simple Passive Voice Detection
  PASSIVE_VOICE_INDICATORS.forEach(regex => {
    let match;
    while ((match = regex.exec(text)) !== null) {
        errors.push({
          id: `local-passive-${match.index}`,
          type: 'syntax',
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          original: match[0],
          suggestion: 'active voice',
          confidence: 0.7,
          explanation: 'Passive voice detected. Consider rewriting in active voice for clarity.',
          source: 'local'
        });
    }
  });

  // 3. Sentence Length Check (very crude)
  const sentences: string[] = text.match(/[^.!?]+[.!?]+/g) || [];
  let currentIndex = 0;
  sentences.forEach(sentence => {
    const wordCount = sentence.split(/\s+/).length;
    if (wordCount > 40) {
       errors.push({
        id: `local-length-${currentIndex}`,
        type: 'style',
        startIndex: text.indexOf(sentence, currentIndex),
        endIndex: text.indexOf(sentence, currentIndex) + sentence.length,
        original: sentence.substring(0, 20) + '...',
        suggestion: 'Split sentence',
        confidence: 0.8,
        explanation: 'This sentence is very long (>40 words). Consider splitting it.',
        source: 'local'
       });
    }
    currentIndex += sentence.length;
  });

  return errors;
};

// Fix: Add explicit FlowMetrics return type to match the interface requirements for string literals
export const calculateFlowMetricsLocal = (text: string): FlowMetrics => {
    // Simulate flow analysis
    const sentences: string[] = text.match(/[^.!?]+[.!?]+/g) || [];
    const avgLength = sentences.reduce((acc, s) => acc + s.split(/\s+/).length, 0) / (sentences.length || 1);
    const score = Math.min(100, Math.max(0, 100 - Math.abs(15 - avgLength) * 2)); // Arbitrary scoring based on 15 words being ideal

    return {
        flowScore: Math.round(score),
        metrics: {
            sentenceVariety: 2.5,
            transitionDensity: 4.2,
            passiveVoiceRatio: 0.1,
            fleschKincaidGrade: 8.5
        },
        recommendations: [
            { type: 'sentence-length', priority: 'medium', tip: 'Try varying sentence length to improve rhythm.' },
            { type: 'transitions', priority: 'low', tip: 'Use more transition words like "However" or "Therefore".' }
        ],
        trend: 'stable'
    };
}