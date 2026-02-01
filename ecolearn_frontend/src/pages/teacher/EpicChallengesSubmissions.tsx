import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ClipboardCheck, Filter, Search, RefreshCw, Sparkles, FileQuestion, CheckCircle2, Clock, ThumbsUp } from 'lucide-react';
import { SubmissionCard, Submission } from '../../components/submissions/SubmissionCard';
import { SubmissionDetailModal } from '../../components/submissions/SubmissionDetailModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Loader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { epicChallengeAPI } from '../../services/epicChallenge';
import { useAuth } from '../../context/AuthContext';

export const EpicChallengeSubmissions = () => {
      const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterChallenge, setFilterChallenge] = useState<string>('all');

    const { user } = useAuth();

    if (!user) return null;

      const fetchPending = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const res = await epicChallengeAPI.getPending();
      setSubmissions(res);
    } catch (err) {
      console.error(err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

     // ============================
  // COUNTS
  // ============================
  const pendingCount = submissions.filter(s => s.status === 'PENDING').length;
  const approvedCount = submissions.filter(s => s.status === 'APPROVED').length;
  const deniedCount = submissions.filter(s => s.status === 'REJECTED').length;

  const challengeTypes = Array.from(
    new Set(submissions.map(s => s.challengeType))
  );

  const handleRefresh = () => fetchPending();


      // ============================
  // ACTIONS
  // ============================
  const handleApprove = async (submissionId: string) => {
    try {
      await epicChallengeAPI.review(Number(submissionId), {
        teacherId: Number(user.id),
        approved: true,
      });

      setSubmissions(prev =>
        prev.map(s =>
          s.id === submissionId ? { ...s, status: 'APPROVED' } : s
        )
      );

      confetti();
      toast.success('Approved! EcoPoints awarded.');
    } catch {
      toast.error('Approval failed');
    }
  };

  const handleDeny = async (submissionId: string, reason?: string) => {
    try {
      await epicChallengeAPI.review(Number(submissionId), {
        teacherId: Number(user.id),
        approved: false,
        remarks: reason,
      });

      setSubmissions(prev =>
        prev.map(s =>
          s.id === submissionId ? { ...s, status: 'REJECTED' } : s
        )
      );

      toast.error('Submission rejected');
    } catch {
      toast.error('Rejection failed');
    }
  };

  const handleRetry = () => fetchPending();


  // ============================
  // FILTERING
  // ============================
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.challengeType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || sub.status === filterStatus;

    const matchesChallenge =
      filterChallenge === 'all' || sub.challengeType === filterChallenge;

    return matchesSearch && matchesStatus && matchesChallenge;
  });
  
    if (hasError) {
        return <ErrorState onRetry={handleRetry} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] transition-colors duration-300 px-4 py-8 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-5xl"
                            >
                                📋
                            </motion.div>
                            <div>
                                <h1 className="text-4xl sm:text-5xl text-gray-900 dark:text-white">
                                    Epic Challenge Submissions
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-400 mt-1">
                                    Review and approve student submissions
                                </p>
                            </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="rounded-xl bg-gradient-to-r from-[#3FB984] to-[#2d8a5f] hover:from-[#2d8a5f] hover:to-[#3FB984] text-white shadow-md"
                            >
                                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </motion.div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card rounded-2xl p-4 border-2 border-[#FFD166]/40"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-1">Pending</p>
                                    <p className="text-3xl text-[#FFD166]">{pendingCount}</p>
                                </div>
                                <ClipboardCheck className="h-10 w-10 text-[#FFD166]" />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card rounded-2xl p-4 border-2 border-[#3FB984]/40"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-1">Approved</p>
                                    <p className="text-3xl text-[#3FB984]">{approvedCount}</p>
                                </div>
                                <Sparkles className="h-10 w-10 text-[#3FB984]" />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card rounded-2xl p-4 border-2 border-red-400/40"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-1">Denied</p>
                                    <p className="text-3xl text-red-500">{deniedCount}</p>
                                </div>
                                <ClipboardCheck className="h-10 w-10 text-red-500" />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-2xl p-6 border-2 border-[#3FB984]/30 mb-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by student or challenge..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-[#3FB984] dark:focus:border-[#3FB984]"
                            />
                        </div>

                        {/* Status Filter */}
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-[#3FB984]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="PENDING">PENDING</SelectItem>
                                <SelectItem value="APPROVED">APPROVED</SelectItem>
                                <SelectItem value="REJECTED">REJECTED</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Challenge Type Filter */}
                        <Select value={filterChallenge} onValueChange={setFilterChallenge}>
                            <SelectTrigger className="rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-[#3FB984]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by challenge" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Challenges</SelectItem>
                                {challengeTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>

                {/* Tabs for Status */}
                <Tabs defaultValue="all" className="mb-6">
                    <TabsList className="glass-card rounded-xl p-1 border-2 border-[#3FB984]/30">
                        <TabsTrigger value="all" className="rounded-lg">
                            All ({submissions.length})
                        </TabsTrigger>
                        <TabsTrigger value="PENDING" className="rounded-lg">
                            PENDING ({pendingCount})
                        </TabsTrigger>
                        <TabsTrigger value="APPROVED" className="rounded-lg">
                            APPROVED ({approvedCount})
                        </TabsTrigger>
                        <TabsTrigger value="REJECTED" className="rounded-lg">
                            REJECTED ({deniedCount})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-6">
                        {isLoading ? (
                            <Loader />
                        ) : filteredSubmissions.length === 0 ? (
                            <EmptyState
                                icon={FileQuestion}
                                title="No submissions found"
                                description={searchQuery || filterStatus !== 'all' || filterChallenge !== 'all'
                                    ? "Try adjusting your filters or search query"
                                    : "Students haven't submitted any challenges yet"}
                            />
                        ) : (
                            <div className="grid gap-6 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredSubmissions.map((submission, index) => (
                                    <motion.div
                                        key={submission.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <SubmissionCard
                                            submission={submission}
                                            onView={setSelectedSubmission}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="PENDING" className="mt-6">
                        {isLoading ? (
                            <Loader />
                        ) : filteredSubmissions.filter(s => s.status === 'PENDING').length === 0 ? (
                            <EmptyState
                                icon={CheckCircle2}
                                title="No pending submissions"
                                description="All submissions have been reviewed"
                            />
                        ) : (
                            <div className="grid gap-6 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredSubmissions
                                    .filter(s => s.status === 'PENDING')
                                    .map((submission, index) => (
                                        <motion.div
                                            key={submission.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <SubmissionCard
                                                submission={submission}
                                                onView={setSelectedSubmission}
                                            />
                                        </motion.div>
                                    ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="APPROVED" className="mt-6">
                        {isLoading ? (
                            <Loader />
                        ) : filteredSubmissions.filter(s => s.status === 'APPROVED').length === 0 ? (
                            <EmptyState
                                icon={Clock}
                                title="No approved submissions"
                                description="No submissions have been approved yet"
                            />
                        ) : (
                            <div className="grid gap-6 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredSubmissions
                                    .filter(s => s.status === 'APPROVED')
                                    .map((submission, index) => (
                                        <motion.div
                                            key={submission.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <SubmissionCard
                                                submission={submission}
                                                onView={setSelectedSubmission}
                                            />
                                        </motion.div>
                                    ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="REJECTED" className="mt-6">
                        {isLoading ? (
                            <Loader />
                        ) : filteredSubmissions.filter(s => s.status === 'REJECTED').length === 0 ? (
                            <EmptyState
                                icon={ThumbsUp}
                                title="No denied submissions"
                                description="No submissions have been denied"
                            />
                        ) : (
                            <div className="grid gap-6 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredSubmissions
                                    .filter(s => s.status === 'REJECTED')
                                    .map((submission, index) => (
                                        <motion.div
                                            key={submission.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <SubmissionCard
                                                submission={submission}
                                                onView={setSelectedSubmission}
                                            />
                                        </motion.div>
                                    ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Submission Detail Modal */}
            {selectedSubmission && (
                <SubmissionDetailModal
                    submission={selectedSubmission}
                    onClose={() => setSelectedSubmission(null)}
                    onApprove={handleApprove}
                    onDeny={handleDeny}
                />
            )}
        </div>
    );
};