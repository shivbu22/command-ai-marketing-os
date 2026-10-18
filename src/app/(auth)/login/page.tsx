import FirebaseLoginForm from '@/components/auth/firebase-login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full" />
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      
      <div className="relative z-10 w-full flex justify-center">
        <FirebaseLoginForm />
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 text-zinc-600 text-xs font-medium tracking-widest uppercase">
        Powered by Pixalified Intelligence Swarm
      </div>
    </div>
  );
}
