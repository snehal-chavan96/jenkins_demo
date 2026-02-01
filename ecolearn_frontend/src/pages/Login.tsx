import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  AlertCircle,
  Sparkles,
  User,
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
import { toast } from "sonner";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, user } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    validateEmail(email);
    validatePassword(password);

    if (emailError || passwordError) {
      setIsLoading(false);
      return;
    }


    try {
      const loggedUser = await login(email, password);   // <---- FIXED
      toast.success('Welcome back to EcoLearn! 🌱');

      if (loggedUser.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else if (loggedUser.role === 'institution') {
        navigate('/institution-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError('Invalid email or password. Please try again.');
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const checkFormValidity = (emailVal: string, passVal: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValid =
      emailRegex.test(emailVal) &&
      passVal.trim().length >= 6;

    setIsFormValid(isValid);
  };




  // Demo credentials helper
  const fillDemoCredentials = (type: "student" | "teacher" | "institution") => {
    if (type === "student") {
      setEmail("alex@ecolearn.com");
      setPassword("demo123");
    } else if (type === "teacher") {
      setEmail("teacher@ecolearn.com");
      setPassword("demo123");
    } else {
      setEmail("institution@ecolearn.com");
      setPassword("demo123");
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
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value.trim()) {
      setEmailError("Email is required.");
    } else if (!emailRegex.test(value)) {
      setEmailError("Enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) {
      setPasswordError("Password is required.");
    } else if (value.length < 6) {
      setPasswordError("🔒 A slightly longer password keeps your eco-journey safe!");
    } else {
      setPasswordError("");
    }
  };


  return (
    
    <div className="flex min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] transition-colors duration-300">
      {/* Left Side - Form */}
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
              Welcome Back, Hero! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Let's continue your eco-adventure!
            </p>
          </div>

          <Card className="glass-card border-4 border-[#3FB984]/30 dark:border-[#3FB984]/50 rounded-3xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-[#FFD166]" />
                Sign In
              </CardTitle>
              <CardDescription className="text-base">
                Enter your info to join the fun!
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
                      value={email}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value);
                        validateEmail(value);
                        checkFormValidity(value, password);
                      }}

                      className="pl-12 h-14 rounded-2xl border-2 border-[#3FB984]/30 focus:border-[#3FB984] text-base bg-background"
                      required
                    />
                    {emailError && (
                      <p className="text-sm text-red-500 mt-1">{emailError}</p>
                    )}

                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPassword(value);
                        validatePassword(value);
                        checkFormValidity(email, value);
                      }}

                      className="pl-12 h-14 rounded-2xl border-2 border-[#3FB984]/30 focus:border-[#3FB984] text-base bg-background"
                      required
                    />
                    <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-4 top-4 text-muted-foreground"
>
  {showPassword ? "🙈" : "👁"}
</button>
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                    )}

                  </div>
                </div>

                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-5 w-5 rounded-lg border-2 border-[#3FB984]/30 text-[#3FB984] focus:ring-[#3FB984]"
                    />
                    <label htmlFor="remember" className="ml-2 text-foreground">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-[#3FB984] hover:text-[#2d8a5f]">
                    Forgot password?
                  </a>
                </div> */}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                  
                    className={`w-full h-14 text-lg rounded-2xl shadow-xl transition-all
    ${!isFormValid || isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#3FB984] via-[#2d8a5f] to-[#22c55e] hover:from-[#2d8a5f] hover:via-[#3FB984] hover:to-[#2d8a5f]"
                      }`}
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
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Let's Go!
                      </>
                    )}
                  </Button>

                </motion.div>

                {/* Demo Credentials */}
                {/* <div className="border-t-2 border-border pt-5">
                  <p className="text-center text-foreground mb-4 text-base">
                    🎮 Try a demo account:
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-14 rounded-2xl border-2 border-[#3069F0]/30 hover:bg-[#3069F0]/10 flex flex-col gap-1"
                        onClick={() => fillDemoCredentials("student")}
                      >
                        <User className="h-5 w-5 text-[#3069F0]" />
                        <span className="text-sm">Student</span>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-14 rounded-2xl border-2 border-purple-500/30 hover:bg-purple-500/10 flex flex-col gap-1"
                        onClick={() => fillDemoCredentials("teacher")}
                      >
                        <GraduationCap className="h-5 w-5 text-purple-600" />
                        <span className="text-sm">Teacher</span>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-14 rounded-2xl border-2 border-[#FFD166]/30 hover:bg-[#FFD166]/10 flex flex-col gap-1"
                        onClick={() => fillDemoCredentials("institution")}
                      >
                        <Building2 className="h-5 w-5 text-[#FFD166]" />
                        <span className="text-sm">Institution</span>
                      </Button>
                    </motion.div>
                  </div>
                </div> */}
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-base">
                  New to EcoLearn?{" "}
                  <Link
                    to="/register"
                    className="text-[#3FB984] hover:text-[#2d8a5f]"
                  >
                    Join the adventure!
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3FB984] via-[#2d8a5f] to-[#22c55e]">
          {/* Decorative floating elements */}
          <FloatingElement delay={0}>
            <div className="absolute top-20 left-20 text-8xl opacity-20">
              🌳
            </div>
          </FloatingElement>
          <FloatingElement delay={1}>
            <div className="absolute top-40 right-20 text-7xl opacity-20">
              🦋
            </div>
          </FloatingElement>
          <FloatingElement delay={2}>
            <div className="absolute bottom-40 left-1/4 text-6xl opacity-20">
              ☀️
            </div>
          </FloatingElement>
          <FloatingElement delay={1.5}>
            <div className="absolute top-1/2 right-1/3 text-7xl opacity-20">
              🌍
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
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="text-9xl mb-4">🌱</div>
              </motion.div>
              <h2 className="mb-6 text-white text-4xl">
                Join the Green Revolution!
              </h2>
              <p className="text-green-50 text-xl mb-8 leading-relaxed">
                Learn cool stuff about nature, complete fun challenges, and
                become a real planet hero! 🚀
              </p>
              <div className="grid grid-cols-2 gap-6">
                <motion.div
  className="glass-card rounded-2xl p-6
             bg-white/80 dark:bg-white/10
             backdrop-blur-md
             border border-gray-200 dark:border-white/20"
  whileHover={{ scale: 1.05 }}
>
  <div className="mb-2 text-3xl font-bold
                  text-gray-900 dark:text-white">
    8 Million+
  </div>

  <div className="text-lg
                  text-gray-600 dark:text-green-100">
    Tons of Plastic Enter Oceans Every Year
  </div>
</motion.div>

<motion.div
  className="glass-card rounded-2xl p-6
             bg-white/80 dark:bg-white/10
             backdrop-blur-md
             border border-gray-200 dark:border-white/20"
  whileHover={{ scale: 1.05 }}
>
  <div className="mb-2 text-3xl font-bold
                  text-gray-900 dark:text-white">
    1 Tree
  </div>

  <div className="text-lg
                  text-gray-600 dark:text-green-100">
    Can Absorb ~22 kg of CO₂ Per Year
  </div>
</motion.div>

              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
