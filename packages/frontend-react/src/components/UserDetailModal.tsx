import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface User {
  id: number;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserDetailModal({ open, onClose, user }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base-100 rounded-lg shadow-2xl p-6 w-[480px] max-w-[90vw]"
                >
                  <Dialog.Title className="text-2xl font-display font-bold text-primary mb-6">
                    User Details
                  </Dialog.Title>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-neutral/5 rounded-lg">
                      <span className="font-medium text-neutral-600 dark:text-neutral-300">ID</span>
                      <span className="font-mono">{user.id}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-neutral/5 rounded-lg">
                      <span className="font-medium text-neutral-600 dark:text-neutral-300">Email</span>
                      <span className="text-primary">{user.email}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-neutral/5 rounded-lg">
                      <span className="font-medium text-neutral-600 dark:text-neutral-300">Admin Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        user.isAdmin ? 'bg-success/20 text-success' : 'bg-neutral/20 text-neutral'
                      }`}>
                        {user.isAdmin ? 'Administrator' : 'Regular User'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-neutral/5 rounded-lg">
                      <span className="font-medium text-neutral-600 dark:text-neutral-300">Created At</span>
                      <span>{new Date(user.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button
                      variant="secondary"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 