import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  User,
  School,
  AlertCircle,
  Sparkles,
  GraduationCap,
  Building2,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { toast } from "sonner";

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // this comes from "I am a..." radio group
    school: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  // Password validation
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  setIsLoading(true);

  try {
    // Convert role to uppercase to match backend enum
    const userType = formData.role.toUpperCase(); // STUDENT, TEACHER, INSTITUTION

    // Only send school if role is student
    const payload: any = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      userType,
    };
    if (userType === "STUDENT") {
      payload.school = formData.school;
    }

    await register(payload);

    toast.success("Registration successful! Please login. 🎉");

    // Redirect to login page
    navigate("/login");
  } catch (err) {
    const message =
      (err as Error).message || "Registration failed. Please try again.";
    setError(message);
    toast.error(message);
  } finally {
    setIsLoading(false);
  }
};
  const FloatingElement = ({
    children,
    delay,
  }: {
    children: React.ReactNode;
    delay: number;
  }) => (
    <motion.div
      className="absolute"
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] transition-colors duration-300">
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3FB984] via-[#2d8a5f] to-[#22c55e] shadow-xl"
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <Leaf className="h-9 w-9 text-white" />
              </motion.div>
              <div className="text-left">
                <span className="block bg-gradient-to-r from-[#3FB984] via-[#2d8a5f] to-[#22c55e] bg-clip-text text-2xl text-transparent">
                  EcoLearn
                </span>
                <span className="block text-xs text-[#3FB984]">
                  Save the Planet! 🌍
                </span>
              </div>
            </Link>
            <h1 className="mb-2 text-3xl text-foreground">
              Join Our Eco-Family! 🌟
            </h1>
            <p className="text-muted-foreground text-lg">
              Start your adventure to save the planet!
            </p>
          </div>

          <Card className="glass-card border-4 border-[#3FB984]/30 dark:border-[#3FB984]/50 rounded-3xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-[#FFD166]" />
                Create Account
              </CardTitle>
              <CardDescription className="text-base">
                Let's get you started on your eco-journey!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <Alert variant="destructive" className="rounded-2xl border-2">
                    <AlertCircle className="h-5 w-5" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-base">I am a...</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={(value) => handleChange("role", value)}
                    className="grid grid-cols-3 gap-3"
                  >
                    <div>
                      <RadioGroupItem
                        value="student"
                        id="student"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="student"
                        className="flex flex-col items-center justify-center rounded-2xl border-2 border-[#3069F0]/30 bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#3069F0] peer-data-[state=checked]:bg-[#3069F0]/10 [&:has([data-state=checked])]:border-[#3069F0] cursor-pointer transition-all"
                      >
                        <User className="mb-2 h-6 w-6 text-[#3069F0]" />
                        <span className="text-sm">Student</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="teacher"
                        id="teacher"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="teacher"
                        className="flex flex-col items-center justify-center rounded-2xl border-2 border-purple-500/30 bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-500/10 [&:has([data-state=checked])]:border-purple-500 cursor-pointer transition-all"
                      >
                        <GraduationCap className="mb-2 h-6 w-6 text-purple-600" />
                        <span className="text-sm">Teacher</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="institution"
                        id="institution"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="institution"
                        className="flex flex-col items-center justify-center rounded-2xl border-2 border-[#FFD166]/30 bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#FFD166] peer-data-[state=checked]:bg-[#FFD166]/10 [&:has([data-state=checked])]:border-[#FFD166] cursor-pointer transition-all"
                      >
                        <Building2 className="mb-2 h-6 w-6 text-[#FFD166]" />
                        <span className="text-sm">Institution</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your awesome name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="pl-12 h-14 rounded-2xl border-2 border-[#3FB984]/30 focus:border-[#3FB984] text-base bg-background"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="pl-12 h-14 rounded-2xl border-2 border-[#3FB984]/30 focus:border-[#3FB984] text-base bg-background"
                      required
                    />
                  </div>
                </div>
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-base">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      className="pl-12 h-14 rounded-2xl border-2 border-[#3FB984]/30 focus:border-[#3FB984] text-base bg-background"
                      required
                    />
                  </div>
                </div>

                {/* School/Institution */}
                <div className="space-y-2">
                  <Label htmlFor="school" className="text-base">
                    {formData.role === "institution"
                      ? "Institution Name"
                      : "School Name"}
                  </Label>
                  <div className="relative">
                    <School className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="school"
                      type="text"
                      placeholder={
                        formData.role === "institution"
                          ? "Your institution"
                          : "Your school"
                      }
                      value={formData.school}
                      onChange={(e) => handleChange("school", e.target.value)}
                      className="pl-12 h-14 rounded-2xl border-2 border-[#3FB984]/30 focus:border-[#3FB984] text-base bg-background"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="pl-12 h-14 rounded-2xl border-2 border-[#3FB984]/30 focus:border-[#3FB984] text-base bg-background"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-base">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                      className="pl-12 h-14 rounded-2xl border-2 border-[#3FB984]/30 focus:border-[#3FB984] text-base bg-background"
                      required
                    />
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-[#3FB984] via-[#2d8a5f] to-[#22c55e] hover:from-[#2d8a5f] hover:via-[#3FB984] hover:to-[#2d8a5f] shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="mr-2"
                        >
                          ⚡
                        </motion.div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Join EcoLearn!
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-base">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#3FB984] hover:text-[#2d8a5f]"
                  >
                    Sign in here!
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3069F0] via-[#2451c7] to-[#1e40af]">
          <FloatingElement delay={0}>
            <div className="absolute top-20 left-20 text-8xl opacity-20">
              🎯
            </div>
          </FloatingElement>
          <FloatingElement delay={1}>
            <div className="absolute top-40 right-20 text-7xl opacity-20">
              ⭐
            </div>
          </FloatingElement>
          <FloatingElement delay={2}>
            <div className="absolute bottom-40 left-1/4 text-6xl opacity-20">
              🏆
            </div>
          </FloatingElement>
          <FloatingElement delay={1.5}>
            <div className="absolute top-1/2 right-1/3 text-7xl opacity-20">
              🌈
            </div>
          </FloatingElement>

          <div className="absolute inset-0 flex items-center justify-center p-12">
            <motion.div
              className="text-white text-center max-w-lg relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                className="mb-8"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="text-9xl mb-4">🌍</div>
              </motion.div>
              <h2 className="mb-6 text-white text-4xl">
                Ready to Make a Difference?
              </h2>
              <p className="text-blue-50 text-xl mb-8 leading-relaxed">
                Join thousands of students and teachers making our planet
                better, one eco-action at a time! 🚀
              </p>
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  className="glass-card rounded-2xl p-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="mb-2 text-white text-2xl">🎮</div>
                  <div className="text-blue-50">Fun Games</div>
                </motion.div>
                <motion.div
                  className="glass-card rounded-2xl p-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="mb-2 text-white text-2xl">🏅</div>
                  <div className="text-blue-50">Rewards</div>
                </motion.div>
                <motion.div
                  className="glass-card rounded-2xl p-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="mb-2 text-white text-2xl">🌟</div>
                  <div className="text-blue-50">Achievements</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
