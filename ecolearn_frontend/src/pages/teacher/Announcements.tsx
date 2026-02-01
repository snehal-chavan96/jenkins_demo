import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Bell,
  CheckCircle,
  Circle,
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  Users,
  Pin,
  MoreVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { PageLoader } from '../../components/common/Loader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

interface Announcement {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  time: string;
  author: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'general' | 'urgent' | 'event' | 'reminder';
  isPinned: boolean;
  targetAudience: string;
  icon: string;
}

export const Announcements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterRead, setFilterRead] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Redirect if not a teacher
  useEffect(() => {
    if (user && user.role !== 'teacher') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Sample announcement data
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Climate Week Event - Registration Open',
      description: 'Join us for a special Climate Week celebration with guest speakers and interactive workshops.',
      content: 'We are excited to announce Climate Week! Students can register for workshops on renewable energy, sustainable living, and ocean conservation. Limited spots available.',
      date: 'Nov 12, 2024',
      time: '09:00 AM',
      author: 'Dr. Sarah Johnson',
      isRead: false,
      priority: 'high',
      category: 'event',
      isPinned: true,
      targetAudience: 'All Students',
      icon: '🌍'
    },
    {
      id: '2',
      title: 'Quiz Deadline Extended - Climate Change 101',
      description: 'Good news! The quiz deadline has been extended to give students more preparation time.',
      content: 'Due to popular request, we have extended the Climate Change Fundamentals quiz deadline to November 30th. Make sure to complete all modules before attempting the quiz.',
      date: 'Nov 10, 2024',
      time: '02:30 PM',
      author: 'Prof. Michael Chen',
      isRead: false,
      priority: 'high',
      category: 'urgent',
      isPinned: true,
      targetAudience: 'Grade 9 Students',
      icon: '⏰'
    },
    {
      id: '3',
      title: 'New Course Material Available',
      description: 'Fresh learning materials have been uploaded for the Renewable Energy course.',
      content: 'New video lectures and reading materials are now available in the Renewable Energy Basics course. Check out the Solar Energy module for interactive simulations.',
      date: 'Nov 9, 2024',
      time: '11:15 AM',
      author: 'Dr. Sarah Johnson',
      isRead: true,
      priority: 'medium',
      category: 'general',
      isPinned: false,
      targetAudience: 'Grade 10-11',
      icon: '📚'
    },
    {
      id: '4',
      title: 'Campus Cleanup Drive This Saturday',
      description: 'Volunteer for our campus cleanup initiative and earn extra eco-points!',
      content: 'Join us this Saturday at 8:00 AM for a campus-wide cleanup drive. Bring gloves and enthusiasm! Participants will earn 500 bonus eco-points.',
      date: 'Nov 8, 2024',
      time: '04:00 PM',
      author: 'Environmental Club',
      isRead: true,
      priority: 'medium',
      category: 'event',
      isPinned: false,
      targetAudience: 'All Students',
      icon: '🌱'
    },
    {
      id: '5',
      title: 'Assignment Submission Reminder',
      description: 'Don\'t forget to submit your Ocean Conservation project by Friday.',
      content: 'This is a friendly reminder that the Ocean Conservation research project is due this Friday at 11:59 PM. Late submissions will incur a 10% penalty per day.',
      date: 'Nov 7, 2024',
      time: '10:00 AM',
      author: 'Prof. Emma Wilson',
      isRead: true,
      priority: 'high',
      category: 'reminder',
      isPinned: false,
      targetAudience: 'Grade 10',
      icon: '📝'
    },
    {
      id: '6',
      title: 'Sustainability Workshop Success',
      description: 'Thank you to all who attended yesterday\'s sustainability workshop!',
      content: 'Over 150 students participated in our Urban Gardening workshop yesterday. Resources and presentation slides are now available in the course materials section.',
      date: 'Nov 6, 2024',
      time: '03:30 PM',
      author: 'Dr. Sarah Johnson',
      isRead: true,
      priority: 'low',
      category: 'general',
      isPinned: false,
      targetAudience: 'Workshop Attendees',
      icon: '🎉'
    },
    {
      id: '7',
      title: 'System Maintenance Notice',
      description: 'Platform will be under maintenance this Sunday from 2-4 AM.',
      content: 'The EcoLearn platform will undergo scheduled maintenance this Sunday from 2:00 AM to 4:00 AM. Please save your work before this time.',
      date: 'Nov 5, 2024',
      time: '09:00 AM',
      author: 'IT Department',
      isRead: true,
      priority: 'medium',
      category: 'general',
      isPinned: false,
      targetAudience: 'All Users',
      icon: '🔧'
    },
    {
      id: '8',
      title: 'New Achievement Badges Released',
      description: 'Check out the new environmental champion badges you can earn!',
      content: 'We\'ve released 5 new achievement badges: Carbon Warrior, Water Saver, Waste Reducer, Energy Champion, and Eco Educator. Complete special challenges to unlock them!',
      date: 'Nov 4, 2024',
      time: '01:00 PM',
      author: 'EcoLearn Team',
      isRead: true,
      priority: 'low',
      category: 'general',
      isPinned: false,
      targetAudience: 'All Students',
      icon: '🏆'
    },
  ]);

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.date.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || announcement.priority === filterPriority;
    const matchesRead = 
      filterRead === 'all' || 
      (filterRead === 'read' && announcement.isRead) ||
      (filterRead === 'unread' && !announcement.isRead);
    
    return matchesSearch && matchesPriority && matchesRead;
  });

  // Sort: pinned first, then by date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const getPriorityColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high':
        return 'from-red-400 to-pink-600';
      case 'medium':
        return 'from-yellow-400 to-orange-600';
      case 'low':
        return 'from-blue-400 to-cyan-600';
    }
  };

  const getCategoryBadge = (category: Announcement['category']) => {
    switch (category) {
      case 'urgent':
        return { label: 'Urgent', color: 'bg-red-500', icon: AlertTriangle };
      case 'event':
        return { label: 'Event', color: 'bg-purple-500', icon: Calendar };
      case 'reminder':
        return { label: 'Reminder', color: 'bg-yellow-500', icon: Bell };
      case 'general':
        return { label: 'General', color: 'bg-blue-500', icon: Info };
    }
  };

  const toggleRead = (id: string) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, isRead: !a.isRead } : a
    ));
  };

  const togglePin = (id: string) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, isPinned: !a.isPinned } : a
    ));
  };

  const handleEdit = (id: string) => {
    console.log('Edit announcement:', id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  if (isLoading) return <PageLoader />;

  // Calculate stats
  const totalAnnouncements = announcements.length;
  const unreadCount = announcements.filter(a => !a.isRead).length;
  const highPriorityCount = announcements.filter(a => a.priority === 'high').length;
  const pinnedCount = announcements.filter(a => a.isPinned).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6 sm:py-8 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Megaphone className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Announcements
                </h1>
              </div>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                Share important updates with your students
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button 
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 shadow-xl"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Announcement
              </Button>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="border-2 border-green-200 dark:border-green-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalAnnouncements}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg">
                      <Megaphone className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="border-2 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Unread</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{unreadCount}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600 text-white shadow-lg">
                      <Bell className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="border-2 border-red-200 dark:border-red-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">High Priority</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{highPriorityCount}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-pink-600 text-white shadow-lg">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="border-2 border-yellow-200 dark:border-yellow-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pinned</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{pinnedCount}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-600 text-white shadow-lg">
                      <Pin className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Search and Filter Bar */}
          <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search announcements by title or date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 transition-colors"
                  />
                </div>

                {/* Priority Filter */}
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-full lg:w-48 h-12 rounded-xl border-2">
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>

                {/* Read Status Filter */}
                <Select value={filterRead} onValueChange={setFilterRead}>
                  <SelectTrigger className="w-full lg:w-48 h-12 rounded-xl border-2">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unread">Unread Only</SelectItem>
                    <SelectItem value="read">Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Announcements List */}
        {sortedAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {sortedAnnouncements.map((announcement, index) => {
              const categoryBadge = getCategoryBadge(announcement.category);
              const CategoryIcon = categoryBadge.icon;

              return (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className={`border-3 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                    announcement.isPinned ? 'border-yellow-300 dark:border-yellow-600 ring-2 ring-yellow-200 dark:ring-yellow-800' :
                    !announcement.isRead ? 'border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' :
                    'border-green-200 dark:border-green-700'
                  } bg-white dark:bg-gray-800`}>
                    <div className="flex">
                      {/* Left Color Bar */}
                      <div className={`w-2 bg-gradient-to-b ${getPriorityColor(announcement.priority)}`} />

                      {/* Main Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Icon */}
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${getPriorityColor(announcement.priority)} text-white shadow-lg flex-shrink-0`}>
                              <span className="text-3xl">{announcement.icon}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              {/* Header */}
                              <div className="flex items-start gap-2 mb-2">
                                {announcement.isPinned && (
                                  <Pin className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                                )}
                                <h3 className={`text-xl font-bold ${!announcement.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {announcement.title}
                                </h3>
                              </div>

                              {/* Description */}
                              <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                {announcement.description}
                              </p>

                              {/* Badges */}
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge className={`${categoryBadge.color} text-white rounded-full px-3 py-1 flex items-center gap-1`}>
                                  <CategoryIcon className="h-3 w-3" />
                                  {categoryBadge.label}
                                </Badge>
                                <Badge variant="outline" className="rounded-full px-3 py-1 flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {announcement.targetAudience}
                                </Badge>
                                {!announcement.isRead && (
                                  <Badge className="bg-blue-500 text-white rounded-full px-3 py-1">
                                    New
                                  </Badge>
                                )}
                              </div>

                              {/* Meta Info */}
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {announcement.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {announcement.time}
                                </span>
                                <span>By {announcement.author}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-start gap-2 flex-shrink-0">
                            {/* Read/Unread Toggle */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRead(announcement.id)}
                              className="rounded-xl"
                              title={announcement.isRead ? 'Mark as unread' : 'Mark as read'}
                            >
                              {announcement.isRead ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400" />
                              )}
                            </Button>

                            {/* More Options */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-xl"
                                >
                                  <MoreVertical className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                <DropdownMenuItem
                                  onClick={() => togglePin(announcement.id)}
                                  className="cursor-pointer rounded-lg"
                                >
                                  <Pin className="mr-2 h-4 w-4" />
                                  {announcement.isPinned ? 'Unpin' : 'Pin'} Announcement
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEdit(announcement.id)}
                                  className="cursor-pointer rounded-lg"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toggleRead(announcement.id)}
                                  className="cursor-pointer rounded-lg"
                                >
                                  {announcement.isRead ? (
                                    <><EyeOff className="mr-2 h-4 w-4" /> Mark as Unread</>
                                  ) : (
                                    <><Eye className="mr-2 h-4 w-4" /> Mark as Read</>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(announcement.id)}
                                  className="cursor-pointer rounded-lg text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl bg-white dark:bg-gray-800">
              <CardContent className="p-12">
                <div className="text-8xl mb-6">📢</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No announcements found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating your first announcement'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="h-12 px-8 text-lg rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Announcement
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Add Announcement Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-green-200 dark:border-green-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                      Create New Announcement
                    </h2>
                    <Button
                      variant="ghost"
                      onClick={() => setShowAddModal(false)}
                      className="rounded-full"
                    >
                      <span className="text-2xl">×</span>
                    </Button>
                  </div>

                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Announcement Title
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Climate Week Event - Registration Open"
                        className="h-12 rounded-xl border-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Short Description
                      </label>
                      <Input
                        type="text"
                        placeholder="Brief summary for preview"
                        className="h-12 rounded-xl border-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Content
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Detailed announcement content..."
                        className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:border-green-500 dark:focus:border-green-500 outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <Select>
                          <SelectTrigger className="h-12 rounded-xl border-2">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="reminder">Reminder</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Priority
                        </label>
                        <Select>
                          <SelectTrigger className="h-12 rounded-xl border-2">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Target Audience
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., All Students, Grade 9, etc."
                        className="h-12 rounded-xl border-2"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 h-12 rounded-xl border-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Create Announcement
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
