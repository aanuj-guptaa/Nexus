const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  // Backgrounds
  [/bg-\[\#F2F0EB\]/g, 'bg-bg-base relative'],
  [/\bbg-white\b/g, 'bg-bg-surface'],
  [/\bbg-gray-50\/50\b/g, 'bg-white/5'],
  [/\bbg-gray-50\b/g, 'bg-bg-elevated'],
  [/\bbg-gray-100\b/g, 'bg-white/5'],
  [/\bbg-gray-200\b/g, 'bg-white/10'],
  [/\bbg-gray-900 text-white\b/g, 'bg-white text-black'],
  [/\bbg-gray-900\b/g, 'bg-white'],

  // Text colors
  [/\btext-gray-900\b/g, 'text-text-primary'],
  [/\btext-gray-800\b/g, 'text-text-primary'],
  [/\btext-gray-700\b/g, 'text-text-primary'],
  [/\btext-gray-600\b/g, 'text-text-muted'],
  [/\btext-gray-500\b/g, 'text-text-muted'],
  [/\btext-gray-400\b/g, 'text-text-subtle'],
  [/\btext-gray-300\b/g, 'text-white/30'],

  // Borders
  [/\bborder-gray-50\b/g, 'border-white/5'],
  [/\bborder-gray-100\b/g, 'border-white/5'],
  [/\bborder-gray-200\b/g, 'border-white/10'],
  [/\bborder-gray-300\b/g, 'border-white/15'],
  [/\bborder-gray-400\b/g, 'border-white/20'],
  [/\bborder-gray-900\b/g, 'border-white'],

  // Status pills & indicators
  [/\bbg-green-50\b/g, 'bg-green-500/10'],
  [/\bbg-green-100\b/g, 'bg-green-500/20'],
  [/\btext-green-700\b/g, 'text-green-400'],
  [/\btext-green-600\b/g, 'text-green-400'],
  [/\bborder-green-200\b/g, 'border-green-500/20'],
  [/\bborder-green-400\b/g, 'border-green-500/30'],
  
  [/\bbg-blue-50\b/g, 'bg-blue-500/10'],
  [/\bbg-blue-100\b/g, 'bg-blue-500/20'],
  [/\btext-blue-700\b/g, 'text-blue-400'],
  [/\btext-blue-600\b/g, 'text-blue-500'],
  [/\bborder-blue-200\b/g, 'border-blue-500/20'],
  [/\bborder-blue-300\b/g, 'border-blue-500/30'],
  [/\bborder-blue-400\b/g, 'border-blue-500/40'],

  [/\bbg-red-50\b/g, 'bg-red-500/10'],
  [/\bbg-red-100\b/g, 'bg-red-500/20'],
  [/\btext-red-700\b/g, 'text-red-400'],
  [/\btext-red-600\b/g, 'text-red-400'],
  [/\bborder-red-200\b/g, 'border-red-500/20'],
  [/\bborder-red-300\b/g, 'border-red-500/30'],
  [/\bborder-red-400\b/g, 'border-red-500/40'],

  [/\bbg-amber-50\b/g, 'bg-amber-500/10'],
  [/\bbg-amber-100\b/g, 'bg-amber-500/20'],
  [/\btext-amber-700\b/g, 'text-amber-400'],
  [/\btext-amber-800\b/g, 'text-amber-400'],
  [/\btext-amber-500\b/g, 'text-amber-400'],
  [/\bborder-amber-200\b/g, 'border-amber-500/20'],
  [/\bborder-amber-400\b/g, 'border-amber-500/40'],

  [/\btext-orange-500\b/g, 'text-orange-400'],
  
  // Blue buttons
  [/\bbg-blue-600\b/g, 'bg-blue'],
  [/\bhover:bg-blue-700\b/g, 'hover:bg-blue-dim'],
  [/\bhover:bg-blue-300\b/g, 'hover:bg-blue/30'],

  // Focus rings and borders
  [/\bfocus:border-blue-300\b/g, 'focus:border-blue/50'],
  [/\bfocus:border-blue-400\b/g, 'focus:border-blue/50'],
  [/\bfocus:border-red-400\b/g, 'focus:border-red-500/50'],

  // Placeholders
  [/\bplaceholder-gray-300\b/g, 'placeholder-white/20'],
];

walk('./src/components/portal', filePath => {
  if (!filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Nightmode theme applied!');
