import { motion } from 'framer-motion';
import { FadeInOnView } from './FadeInOnView';

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <FadeInOnView>
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-display mb-4 text-neutral dark:text-base-100"
            >
              NovaStackJS
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-neutral/70 dark:text-base-100/70 mb-6"
            >
              Build blazing-fast full-stack apps with TypeScript, PHP-WASM, and a custom AI chatbot.
            </motion.p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary btn-lg shadow-lg hover:btn-accent transition duration-300"
            >
              Get Started
            </motion.button>
          </div>
        </FadeInOnView>
        <FadeInOnView>
          <div className="relative">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              src="/artists-impressed.png"
              alt="Impressive UI Demo"
              className="rounded-3xl shadow-2xl transform hover:scale-105 transition duration-500"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-8 left-4 w-36 h-36 bg-primary/30 rounded-full filter blur-3xl"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -top-12 right-4 w-24 h-24 bg-accent/20 rounded-full filter blur-3xl"
            />
          </div>
        </FadeInOnView>
      </div>
    </section>
  );
} 