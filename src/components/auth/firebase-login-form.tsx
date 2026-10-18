'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, LogIn, Github, Chrome } from 'lucide-react';
import { toast } from 'sonner';

export default function FirebaseLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
        // Create mock session
        await fetch('/api/auth/session', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ idToken: 'mock-token' }),
        });
        window.location.href = '/';
        return;
      }

      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back!');
      }

      // Sync with server session
      const idToken = await userCredential.user.getIdToken();
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        throw new Error('Failed to establish server session');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
         // Create mock session
         await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: 'mock-token' }),
         });
         window.location.href = '/';
         return;
      }

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        toast.success('Signed in with Google');
        window.location.href = '/';
      } else {
        throw new Error('Failed to establish server session');
      }
    } catch (error: any) {
      toast.error(error.message || 'Google sign-in failed');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-fuchsia-500/20">
          <LogIn className="text-white w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-zinc-400 mt-2 text-center text-sm">
          {isRegistering 
            ? 'Join the autonomous marketing swarm today' 
            : 'Access your Pixalified AI Marketing OS'}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-fuchsia-400 transition-colors w-5 h-5" />
          <Input
            type="email"
            placeholder="Work Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-zinc-950/50 border-zinc-800 focus:border-fuchsia-500/50 focus:ring-fuchsia-500/20 text-white h-12"
            required
          />
        </div>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-fuchsia-400 transition-colors w-5 h-5" />
          <Input
            type="password"
            placeholder="Secure Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 bg-zinc-950/50 border-zinc-800 focus:border-fuchsia-500/50 focus:ring-fuchsia-500/20 text-white h-12"
            required
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-fuchsia-500/20"
        >
          {isLoading ? 'Processing...' : isRegistering ? 'Register Agent' : 'Launch Console'}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-800"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#09090b] px-2 text-zinc-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={handleGoogleSignIn}
          className="bg-zinc-950/50 border-zinc-800 hover:bg-zinc-800 text-white h-12 rounded-xl"
        >
          <Chrome className="mr-2 w-4 h-4 text-orange-500" /> Google
        </Button>
        <Button 
          variant="outline" 
          className="bg-zinc-950/50 border-zinc-800 hover:bg-zinc-800 text-white h-12 rounded-xl"
        >
          <Github className="mr-2 w-4 h-4" /> GitHub
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-zinc-500">
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-fuchsia-400 hover:text-fuchsia-300 font-medium transition-colors"
        >
          {isRegistering ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </motion.div>
  );
}
