import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../src/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <h1 className="text-5xl font-display font-bold text-primary">
            Welcome to NovaStackJS
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300">
            A modern full-stack framework for building powerful web applications
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Link href="/dashboard" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <h2 className="card-title text-2xl font-display font-bold text-primary">
                Dashboard
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300">
                View your application statistics and manage users
              </p>
            </div>
          </Link>

          <Link href="/settings" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <h2 className="card-title text-2xl font-display font-bold text-primary">
                Settings
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300">
                Configure your application preferences
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
} 