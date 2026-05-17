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
  [/\bbg-bg-base\b/g, 'bg-[#F2F0EB] dark:bg-bg-base'],
  [/\bbg-bg-surface\b/g, 'bg-white dark:bg-bg-surface'],
  [/\bbg-bg-elevated\b/g, 'bg-gray-50 dark:bg-bg-elevated'],
  [/\bbg-white\/5\b/g, 'bg-gray-100 dark:bg-white/5'],
  [/\bbg-white\/10\b/g, 'bg-gray-200 dark:bg-white/10'],

  // Text colors
  [/\btext-text-primary\b/g, 'text-gray-900 dark:text-text-primary'],
  [/\btext-text-muted\b/g, 'text-gray-500 dark:text-text-muted'],
  [/\btext-text-subtle\b/g, 'text-gray-400 dark:text-text-subtle'],
  [/\btext-white\/30\b/g, 'text-gray-300 dark:text-white/30'],

  // Borders
  [/\bborder-white\/5\b/g, 'border-gray-100 dark:border-white/5'],
  [/\bborder-white\/10\b/g, 'border-gray-200 dark:border-white/10'],
  [/\bborder-white\/15\b/g, 'border-gray-300 dark:border-white/15'],
  [/\bborder-white\/20\b/g, 'border-gray-400 dark:border-white/20'],

  // Colors
  [/\bbg-green-500\/10\b/g, 'bg-green-50 dark:bg-green-500/10'],
  [/\bbg-green-500\/20\b/g, 'bg-green-100 dark:bg-green-500/20'],
  [/\btext-green-400\b/g, 'text-green-600 dark:text-green-400'],
  [/\bborder-green-500\/20\b/g, 'border-green-200 dark:border-green-500/20'],
  [/\bborder-green-500\/30\b/g, 'border-green-400 dark:border-green-500/30'],

  [/\bbg-blue-500\/10\b/g, 'bg-blue-50 dark:bg-blue-500/10'],
  [/\bbg-blue-500\/20\b/g, 'bg-blue-100 dark:bg-blue-500/20'],
  [/\btext-blue-400\b/g, 'text-blue-700 dark:text-blue-400'],
  [/\btext-blue-500\b/g, 'text-blue-600 dark:text-blue-500'],
  [/\bborder-blue-500\/20\b/g, 'border-blue-200 dark:border-blue-500/20'],
  [/\bborder-blue-500\/30\b/g, 'border-blue-300 dark:border-blue-500/30'],
  [/\bborder-blue-500\/40\b/g, 'border-blue-400 dark:border-blue-500/40'],

  [/\bbg-red-500\/10\b/g, 'bg-red-50 dark:bg-red-500/10'],
  [/\bbg-red-500\/20\b/g, 'bg-red-100 dark:bg-red-500/20'],
  [/\btext-red-400\b/g, 'text-red-600 dark:text-red-400'],
  [/\bborder-red-500\/20\b/g, 'border-red-200 dark:border-red-500/20'],
  [/\bborder-red-500\/30\b/g, 'border-red-300 dark:border-red-500/30'],
  [/\bborder-red-500\/40\b/g, 'border-red-400 dark:border-red-500/40'],

  [/\bbg-amber-500\/10\b/g, 'bg-amber-50 dark:bg-amber-500/10'],
  [/\bbg-amber-500\/20\b/g, 'bg-amber-100 dark:bg-amber-500/20'],
  [/\btext-amber-400\b/g, 'text-amber-600 dark:text-amber-400'],
  [/\bborder-amber-500\/20\b/g, 'border-amber-200 dark:border-amber-500/20'],
  [/\bborder-amber-500\/40\b/g, 'border-amber-400 dark:border-amber-500/40'],

  [/\btext-orange-400\b/g, 'text-orange-500 dark:text-orange-400'],

  [/\bbg-blue\b/g, 'bg-blue-600 dark:bg-blue'],
  [/\bhover:bg-blue-dim\b/g, 'hover:bg-blue-700 dark:hover:bg-blue-dim'],
  [/\bhover:bg-blue\/30\b/g, 'hover:bg-blue-300 dark:hover:bg-blue/30'],

  [/\bfocus:border-blue\/50\b/g, 'focus:border-blue-400 dark:focus:border-blue/50'],
  [/\bfocus:border-red-500\/50\b/g, 'focus:border-red-400 dark:focus:border-red-500/50'],

  [/\bplaceholder-white\/20\b/g, 'placeholder-gray-300 dark:placeholder-white/20'],
];

walk('./src/components/portal', filePath => {
  if (!filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Darkmode classes added!');
