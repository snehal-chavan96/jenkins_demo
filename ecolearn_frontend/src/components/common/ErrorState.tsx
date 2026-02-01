import { motion } from 'motion/react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullPage?: boolean;
}

export const ErrorState = ({ 
  title = 'Oops! Something went wrong',
  message = 'We couldn\'t load this content. Please try again!',
  onRetry,
  fullPage = false
}: ErrorStateProps) => {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={fullPage ? 'min-h-screen flex items-center justify-center px-4' : ''}
    >
      <Card className="border-3 sm:border-4 border-red-200 rounded-2xl sm:rounded-3xl shadow-xl bg-gradient-to-br from-red-50 to-orange-50 max-w-md mx-auto">
        <CardContent className="p-6 sm:p-8 text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-6"
          >
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-orange-500 mx-auto">
              <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </motion.div>
          
          <h3 className="mb-3 text-xl sm:text-2xl text-gray-900">
            {title}
          </h3>
          
          <p className="mb-6 text-sm sm:text-base text-gray-700 leading-relaxed">
            {message}
          </p>
          
          {onRetry && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onRetry}
                className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-orange-600 hover:from-red-600 hover:via-red-700 hover:to-orange-700 shadow-xl"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Try Again
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return content;
};
