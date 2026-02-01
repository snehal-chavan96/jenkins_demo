import { useState } from "react";
import { motion } from "motion/react";
import { Camera, School, Mail, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";

export const TeacherProfile = () => {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] transition-colors duration-300">
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Cover Banner */}
          <div className="h-48 rounded-3xl bg-gradient-to-r from-[#3FB984] via-[#3069F0] to-[#FFD166] relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-3xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                >
                  {["🌿", "📚", "🌱", "⭐"][i % 4]}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Profile Card */}
          <Card className="glass-card border-2 border-white/20 dark:border-white/10 -mt-20 mx-4 relative z-10 rounded-3xl shadow-2xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">

                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-xl">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-[#3FB984] to-[#2d8a5f] text-white text-4xl">
                      {user?.name?.charAt(0) || "T"}
                    </AvatarFallback>
                  </Avatar>

                  <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#3FB984] to-[#2d8a5f] flex items-center justify-center shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <h1 className="text-3xl text-foreground">{formData.name}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {formData.email}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-purple-600">
                      🎓 Teacher
                    </Badge>
                    {/* <Badge variant="outline">
                      <School className="w-3 h-3 mr-1" />
                      {formData.school}
                    </Badge> */}
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <Label>Name</Label>
                  <Input
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                {/* <div> */}
                  {/* <Label>School</Label>
                  <Input
                    disabled={!isEditing}
                    value={formData.school}
                    onChange={(e) => handleChange("school", e.target.value)}
                  /> */}
                {/* </div> */}
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="rounded-xl"
                >
                  {isEditing ? "Save Profile" : "Edit Profile"}
                </Button>
              </div>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
