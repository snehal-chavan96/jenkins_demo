import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, XCircle, Leaf, ZoomIn, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { GlassCard } from '../gamification/GlassCard';
import { StatusBadge } from './StatusBadge';
import { Submission } from './SubmissionCard';
import { Textarea } from '../ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface SubmissionDetailModalProps {
  submission: Submission | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onDeny: (id: string, reason?: string) => void;
}

export const SubmissionDetailModal = ({
  submission,
  onClose,
  onApprove,
  onDeny,
}: SubmissionDetailModalProps) => {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showDenyDialog, setShowDenyDialog] = useState(false);
  const [denyReason, setDenyReason] = useState('');
  const [showImageZoom, setShowImageZoom] = useState(false);

  if (!submission) return null;

  const isReviewed = submission.status === 'APPROVED' || submission.status === 'REJECTED';

  const handleApprove = () => {
    onApprove(submission.id);
    setShowApproveDialog(false);
    onClose();
  };

  const handleDeny = () => {
    onDeny(submission.id, denyReason);
    setShowDenyDialog(false);
    setDenyReason('');
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <GlassCard
            gradient="from-white/95 to-white/90"
            borderColor="border-[#3FB984]/40"
            className="shadow-2xl"
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-10 w-10 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  className="text-8xl mb-4 inline-block"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {submission.challengeIcon}
                </motion.div>
                <h2 className="text-3xl text-gray-900 dark:text-white mb-2">
                  {submission.challengeType}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-3">
                  Submitted by: <span className="text-[#3FB984]">{submission.studentName}</span>
                </p>
                <div className="flex flex-wrap gap-3 justify-center items-center">
                  <StatusBadge status={submission.status} />
                  <div className="flex items-center gap-2 bg-[#3FB984]/20 dark:bg-[#3FB984]/30 rounded-full px-4 py-2 border-2 border-[#3FB984]/40">
                    <Leaf className="h-5 w-5 text-[#3FB984]" />
                    <span className="text-[#3FB984]">+{submission.ecoPoints} Points</span>
                  </div>
                </div>
              </div>

              {/* Submission Date */}
              <div className="mb-6 text-center text-gray-600 dark:text-gray-400">
                Submitted on: {submission.submissionDate}
              </div>

              {/* Student Description */}
              <div className="mb-6">
                <h3 className="text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>📝</span> Student Description
                </h3>
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-gray-300/60 dark:border-gray-600/60 p-4 min-h-32">
                  {submission.description ? (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {submission.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      No description provided
                    </p>
                  )}
                </div>
              </div>

              {/* Attached Photo */}
              {submission.imageUrl && (
                <div className="mb-6">
                  <h3 className="text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span>📸</span> Attached Photo
                  </h3>
                  <div className="relative group">
                    <img
                      src={submission.imageUrl}
                      alt="Submission"
                      className="w-full h-80 object-cover rounded-2xl border-2 border-gray-300 dark:border-gray-600 shadow-md cursor-pointer"
                      onClick={() => setShowImageZoom(true)}
                    />
                    <div 
                      className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      onClick={() => setShowImageZoom(true)}
                    >
                      <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-4">
                        <ZoomIn className="h-8 w-8 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Box about Eco Points */}
              <div className="mb-6 bg-blue-50/80 dark:bg-blue-900/20 border-2 border-blue-200/60 dark:border-blue-700/60 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-900 dark:text-blue-100">
                      <strong>Eco Points:</strong> When you approve this submission, the student will automatically receive <strong>+{submission.ecoPoints} Eco Points</strong> based on the challenge type.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {!isReviewed && (
                <div className="flex gap-4">
                  <motion.div 
                    className="flex-1"
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => setShowApproveDialog(true)}
                      className="w-full rounded-2xl bg-gradient-to-r from-[#3FB984] to-[#2d8a5f] hover:from-[#2d8a5f] hover:to-[#3FB984] text-white text-lg py-6 shadow-lg"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Approve Submission
                    </Button>
                  </motion.div>
                  <motion.div 
                    className="flex-1"
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => setShowDenyDialog(true)}
                      className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg py-6 shadow-lg"
                    >
                      <XCircle className="mr-2 h-5 w-5" />
                      Deny Submission
                    </Button>
                  </motion.div>
                </div>
              )}

              {/* Already Reviewed Message */}
              {isReviewed && (
                <div className={`text-center p-4 rounded-2xl ${
                  submission.status === 'APPROVED' 
                    ? 'bg-green-50/80 dark:bg-green-900/20 border-2 border-green-200/60 dark:border-green-700/60'
                    : 'bg-red-50/80 dark:bg-red-900/20 border-2 border-red-200/60 dark:border-red-700/60'
                }`}>
                  <p className={`${
                    submission.status === 'APPROVED'
                      ? 'text-green-900 dark:text-green-100'
                      : 'text-red-900 dark:text-red-100'
                  }`}>
                    This submission has already been {submission.status.toLowerCase()}.
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent className="rounded-2xl border-2 border-[#3FB984]/40 glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-[#3FB984]" />
              Approve Submission
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              Are you sure you want to approve this submission?
              <br />
              <strong className="text-[#3FB984]">+{submission.ecoPoints} Eco Points</strong> will be awarded to the student.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="rounded-xl bg-gradient-to-r from-[#3FB984] to-[#2d8a5f] hover:from-[#2d8a5f] hover:to-[#3FB984]"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deny Confirmation Dialog */}
      <AlertDialog open={showDenyDialog} onOpenChange={setShowDenyDialog}>
        <AlertDialogContent className="rounded-2xl border-2 border-red-300/40 glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-500" />
              Deny Submission
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              Are you sure you want to deny this submission?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-6 pb-2">
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Reason for denial (optional)
            </label>
            <Textarea
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
              placeholder="Provide feedback to the student..."
              className="min-h-24 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-500 resize-none"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeny}
              className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Deny
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {showImageZoom && submission.imageUrl && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImageZoom(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] cursor-zoom-out"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] max-w-[90vw] max-h-[90vh]"
            >
              <img
                src={submission.imageUrl}
                alt="Submission full size"
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                onClick={() => setShowImageZoom(false)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageZoom(false)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-black shadow-lg p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
