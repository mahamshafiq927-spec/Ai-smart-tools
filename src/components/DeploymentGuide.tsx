import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Key, 
  Terminal, 
  Globe, 
  Smartphone,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface DeploymentGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuide: React.FC<DeploymentGuideProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const steps = [
    {
      num: 1,
      title: 'Firebase Project Creation',
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>Create a dedicated Firebase project to manage user accounts securely:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Visit the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-medium">Firebase Console</a> and log in with your Google account.</li>
            <li>Click <strong>Add project</strong> (or <em>Create a project</em>).</li>
            <li>Name your project (e.g., <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded text-xs">magicai-tools</code>) and continue.</li>
            <li>Google Analytics is optional — you can disable it or link your analytics account, then click <strong>Create project</strong>.</li>
          </ol>
        </div>
      )
    },
    {
      num: 2,
      title: 'Enabling Google Authentication',
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>Enable native Google OAuth authentication:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>In the left sidebar, navigate to <strong>Build &gt; Authentication</strong> and click <strong>Get started</strong>.</li>
            <li>Under the <strong>Sign-in method</strong> tab, choose <strong>Google</strong> from the provider list.</li>
            <li>Toggle the <strong>Enable</strong> switch to ON.</li>
            <li>Select your project support email address from the dropdown.</li>
            <li>Click <strong>Save</strong>. Google Sign-In is now provisioned for your project.</li>
          </ol>
        </div>
      )
    },
    {
      num: 3,
      title: 'Enabling Email / Password Authentication',
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>Activate email & password authentication and password reset flows:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Still in <strong>Authentication &gt; Sign-in method</strong>, click <strong>Add new provider</strong>.</li>
            <li>Select <strong>Email/Password</strong>.</li>
            <li>Toggle <strong>Email/Password</strong> to <strong>Enabled</strong>. (Leave Email link/passwordless off unless desired).</li>
            <li>Click <strong>Save</strong>.</li>
            <li>To customize password reset emails, navigate to the <strong>Templates</strong> tab under Authentication and edit the <em>Password reset</em> template.</li>
          </ol>
        </div>
      )
    },
    {
      num: 4,
      title: 'Adding the Firebase Configuration',
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>Register a Web App in Firebase to get your API keys:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>In the Firebase project overview, click the <strong>Web icon (&lt;/&gt;)</strong> to register an app.</li>
            <li>Enter an app nickname (e.g., <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded text-xs">MagicAI Web</code>) and click <strong>Register app</strong>.</li>
            <li>Copy the generated <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded text-xs">firebaseConfig</code> object values.</li>
          </ol>
          <div className="relative mt-2">
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-mono overflow-x-auto">
{`# Add to your .env or Vercel Environment Variables:
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="magicai-tools.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="magicai-tools"
VITE_FIREBASE_STORAGE_BUCKET="magicai-tools.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"`}
            </pre>
            <button
              onClick={() => copyToClipboard(`VITE_FIREBASE_API_KEY="your_api_key"\nVITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"\nVITE_FIREBASE_PROJECT_ID="your_project"\nVITE_FIREBASE_APP_ID="your_app_id"`, 'env-config')}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              {copiedKey === 'env-config' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )
    },
    {
      num: 5,
      title: 'Setting Authorized Domains',
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>Whitelist your production URLs so Firebase allows Google OAuth sign-in:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>In Firebase Console, go to <strong>Authentication &gt; Settings &gt; Authorized domains</strong>.</li>
            <li>By default, <code className="text-slate-400">localhost</code> and <code className="text-slate-400">*.firebaseapp.com</code> are already added.</li>
            <li>Click <strong>Add domain</strong> and add:
              <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-400 text-xs">
                <li>Your Vercel domain: <code className="text-emerald-400">your-app.vercel.app</code></li>
                <li>Your custom domain: <code className="text-emerald-400">magicai.yourdomain.com</code></li>
                <li>AI Studio preview domain (if running inside AI Studio)</li>
              </ul>
            </li>
            <li>Click <strong>Save</strong>.</li>
          </ol>
        </div>
      )
    },
    {
      num: 6,
      title: 'Connecting Firebase Authentication to the App',
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>MagicAI includes a unified Authentication Controller in <code className="text-indigo-400">src/lib/authService.ts</code> that automatically detects Firebase:</p>
          <div className="relative mt-2">
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto">
{`// When VITE_FIREBASE_API_KEY is defined:
// signInWithPopup(auth, googleProvider) executes real Google OAuth
// signInWithEmailAndPassword executes real Email/Password Auth
// sendPasswordResetEmail dispatches real reset emails to user inboxes`}
            </pre>
          </div>
          <p className="text-xs text-slate-400">
            If deployed without environment variables, the app safely runs with its built-in cryptographic session provider so testing is instant and never breaks!
          </p>
        </div>
      )
    },
    {
      num: 7,
      title: 'Connecting Gemini API Securely Through the Backend',
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>Security Architecture: The Gemini API key is <strong>strictly server-side</strong>.</p>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Client Secret Exposure</span>
            </div>
            <div>The frontend calls <code className="bg-emerald-950 px-1.5 py-0.5 rounded font-mono">/api/generate</code> with an <code className="font-mono">Authorization: Bearer &lt;token&gt;</code> header.</div>
          </div>
          <div className="relative mt-2">
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-mono overflow-x-auto">
{`// server/apiMiddleware.ts
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: contextualPrompt,
  config: { systemInstruction }
});`}
            </pre>
          </div>
        </div>
      )
    },
    {
      num: 8,
      title: 'Adding GEMINI_API_KEY to Vercel Environment Variables',
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>Only the application owner sets the key in Vercel project settings:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Go to <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-medium">Vercel Dashboard</a> and open your project.</li>
            <li>Go to <strong>Settings &gt; Environment Variables</strong>.</li>
            <li>Add the key:
              <div className="mt-1 p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs">
                Key: <strong className="text-white">GEMINI_API_KEY</strong><br />
                Value: <span className="text-indigo-300">AIzaSy...YourGeminiKey</span>
              </div>
            </li>
            <li>Check all environments (<strong>Production, Preview, Development</strong>).</li>
            <li>Click <strong>Save</strong>.</li>
          </ol>
        </div>
      )
    },
    {
      num: 9,
      title: 'Deploying the Complete App to Vercel',
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>Deploy with one command or via GitHub:</p>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-200">Method A: Vercel CLI</p>
            <div className="relative">
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-mono">
{`npm install -g vercel
vercel login
vercel --prod`}
              </pre>
              <button
                onClick={() => copyToClipboard('vercel --prod', 'cli-deploy')}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                {copiedKey === 'cli-deploy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs font-semibold text-slate-200 mt-3">Method B: GitHub Push</p>
            <p className="text-xs text-slate-400">Push this repo to GitHub and import it on Vercel. Vercel automatically detects the Vite build command (<code className="font-mono text-indigo-300">npm run build</code>) and serverless functions in <code className="font-mono text-indigo-300">api/</code>.</p>
          </div>
        </div>
      )
    },
    {
      num: 10,
      title: 'Testing Google Login & Email Login on Mobile',
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>Verify authentication on iPhone, Android, and mobile browsers:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span><strong>Google Sign-In Popup:</strong> Mobile browsers (Safari on iOS, Chrome on Android) will trigger the native Google account selector or redirect popup smoothly.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Session Persistence:</strong> When users refresh or close and re-open the browser tab, the session remains active without prompting them to sign in again.</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Tool Access:</strong> Unauthenticated users attempting to click "Generate" will be prompted with the Auth modal. Once logged in, generation proceeds with 0 friction.</span>
            </li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Complete Setup & Deployment Guide
              </h2>
              <p className="text-xs text-slate-400">
                10-Step Guide for Firebase, Gemini API, and Vercel Production
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Selector Horizontal Bar */}
        <div className="py-4 border-b border-slate-800 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
          {steps.map(s => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeStep === s.num
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                activeStep === s.num ? 'bg-white text-indigo-700' : 'bg-slate-800 text-slate-300'
              }`}>
                {s.num}
              </span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Active Step Content Body */}
        <div className="flex-1 overflow-y-auto py-6 pr-2">
          {steps.map(s => {
            if (s.num !== activeStep) return null;
            return (
              <div key={s.num} className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
                    Step {s.num} of 10
                  </span>
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  {s.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
          >
            Previous Step
          </button>

          <span className="text-xs text-slate-500">
            Step {activeStep} of 10
          </span>

          {activeStep < 10 ? (
            <button
              onClick={() => setActiveStep(Math.min(10, activeStep + 1))}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1.5 transition-colors"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              Finish & Start Using MagicAI
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
