import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Classes = () => {
  const navigate = useNavigate();

  const classes = [
    { id: 1, name: 'Class A', students: 20 },
    { id: 2, name: 'Class B', students: 18 },
    { id: 3, name: 'Class C', students: 22 },
  ];

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:px-12 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
          Classes
        </h1>
        <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white">
          <Plus className="h-4 w-4" /> Add Class
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <motion.div key={cls.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Card className="rounded-2xl shadow-xl border-2 border-green-200 dark:border-green-700">
              <CardHeader>
                <CardTitle>{cls.name}</CardTitle>
                <CardDescription>{cls.students} students</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full text-sm sm:text-base rounded-xl border-2 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                  onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                >
                  View Class
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
