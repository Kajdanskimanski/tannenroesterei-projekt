import { initNav } from './nav.js';
import { initTimeline } from './timeline.js';
import { initQuiz } from './quiz.js';

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initTimeline();
    initQuiz();
});