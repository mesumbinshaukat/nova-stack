import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { motion } from 'framer-motion';

export function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setEnabled(true);
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'novastack-dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'novastack');
    }
  }, []);

  const toggleTheme = (checked: boolean) => {
    setEnabled(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'novastack-dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'novastack');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center space-x-2"
    >
      <span className="text-sm text-neutral/70 dark:text-base-100/70">Dark Mode</span>
      <Switch
        checked={enabled}
        onChange={toggleTheme}
        className={`${
          enabled ? 'bg-primary' : 'bg-neutral/30 dark:bg-neutral/60'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-base-100 shadow-lg`}
        />
      </Switch>
    </motion.div>
  );
} 