import { motion } from 'motion/react';
import { Calendar, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { GlassCard } from '../gamification/GlassCard';
import { StatusBadge, SubmissionStatus } from './StatusBadge';

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  challengeType: string;
  challengeIcon: string;
  submissionDate: string;
  status: SubmissionStatus;
  description: string;
  imageUrl?: string;
  ecoPoints: number;
}

interface SubmissionCardProps {
  submission: Submission;
  onView: (submission: Submission) => void;
}

export const SubmissionCard = ({ submission, onView }: SubmissionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01, y: -2 }}
    >
      <GlassCard
        gradient="from-white/70 to-white/50"
        borderColor="border-[#3FB984]/30"
        className="shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="p-6">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <motion.div 
                className="text-4xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {submission.challengeIcon}
              </motion.div>
              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-white mb-1">
                  {submission.challengeType}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Student: {submission.studentName}
                </p>
              </div>
            </div>
            <StatusBadge status={submission.status} />
          </div>

          {/* Submission Details */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
            <Calendar className="h-4 w-4" />
            <span>{submission.submissionDate}</span>
          </div>

          {/* Action Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => onView(submission)}
              className="w-full rounded-xl bg-gradient-to-r from-[#3FB984] to-[#2d8a5f] hover:from-[#2d8a5f] hover:to-[#3FB984] text-white shadow-md"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Submission
            </Button>
          </motion.div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
