import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Play, 
  Square, 
  ChevronRight, 
  BarChart3, 
  Settings, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Trophy,
  BookOpen,
  RefreshCw
} from 'lucide-react';

const QUESTIONS = [
  { id: 1, type: 'Technical', text: "Can you explain the difference between virtual DOM and real DOM in React?" },
  { id: 2, type: 'Behavioral', text: "Tell me about a time you faced a significant challenge at work and how you handled it." },
  { id: 3, type: 'Technical', text: "What are the advantages and disadvantages of using Microservices architecture?" },
  { id: 4, type: 'HR', text: "Where do you see yourself in five years?" },
  { id: 5, type: 'Technical', text: "How does prototypal inheritance work in JavaScript?" },
  { id: 6, type: 'Behavioral', text: "Describe a situation where you had to work with a difficult team member." },
  { id: 7, type: 'Technical', text: "What is the CAP theorem and how does it apply to distributed systems?" },
  { id: 8, type: 'HR', text: "Why should we hire you over other candidates?" },
];

export default function App() {
  const [stage, setStage] = useState('setup'); // 'setup', 'interview', 'summary'
  const [settings, setSettings] = useState({
    type: 'Mixed',
    difficulty: 'Intermediate',
    domain: 'Frontend',
    duration: 15,
    cameraEnabled: true,
    micEnabled: true
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.duration * 60);
  const [isRecording, setIsRecording] = useState(false);
  const [metrics, setMetrics] = useState({
    eyeContact: 85,
    confidence: 70,
    clarity: 75,
    accuracy: 80,
    overall: 78
  });

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  // Handle Media Stream
  useEffect(() => {
    if (stage === 'interview' && settings.cameraEnabled) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [stage]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: settings.cameraEnabled, 
        audio: settings.micEnabled 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Could not access camera or microphone. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  // Timer Logic
  useEffect(() => {
    if (stage === 'interview' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleEndInterview();
    }
    return () => clearInterval(timerRef.current);
  }, [stage, timeLeft]);

  // Simulated Metrics Update
  useEffect(() => {
    if (stage === 'interview') {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          eyeContact: Math.min(100, Math.max(0, prev.eyeContact + (Math.random() * 10 - 5))),
          confidence: Math.min(100, Math.max(0, prev.confidence + (Math.random() * 10 - 5))),
          clarity: Math.min(100, Math.max(0, prev.clarity + (Math.random() * 10 - 5))),
          accuracy: Math.min(100, Math.max(0, prev.accuracy + (Math.random() * 10 - 5))),
          overall: Math.min(100, Math.max(0, (prev.eyeContact + prev.confidence + prev.clarity + prev.accuracy) / 4))
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleStartInterview = () => {
    setTimeLeft(settings.duration * 60);
    setStage('interview');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleEndInterview();
    }
  };

  const handleEndInterview = () => {
    stopCamera();
    setStage('summary');
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setStage('setup');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const ProgressBar = ({ label, value, color = "bg-indigo-600" }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${color}`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Trophy className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">AI Mock Interview</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <User className="w-4 h-4" />
            <span>Candidate Mode</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {stage === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel: Settings */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">Interview Settings</h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Interview Type</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={settings.type}
                    onChange={(e) => setSettings({...settings, type: e.target.value})}
                  >
                    <option>Technical</option>
                    <option>HR</option>
                    <option>Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Basic', 'Intermediate', 'Advanced'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSettings({...settings, difficulty: level})}
                        className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                          settings.difficulty === level 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Domain</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={settings.domain}
                    onChange={(e) => setSettings({...settings, domain: e.target.value})}
                  >
                    <option>Frontend</option>
                    <option>Backend</option>
                    <option>Data Science</option>
                    <option>DSA</option>
                    <option>Full Stack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (Minutes)</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={settings.duration}
                    onChange={(e) => setSettings({...settings, duration: parseInt(e.target.value)})}
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                  </select>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Enable Camera</span>
                    </div>
                    <button 
                      onClick={() => setSettings({...settings, cameraEnabled: !settings.cameraEnabled})}
                      className={`w-11 h-6 rounded-full transition-colors relative ${settings.cameraEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.cameraEnabled ? 'translate-x-5' : ''}`}></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Enable Microphone</span>
                    </div>
                    <button 
                      onClick={() => setSettings({...settings, micEnabled: !settings.micEnabled})}
                      className={`w-11 h-6 rounded-full transition-colors relative ${settings.micEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.micEnabled ? 'translate-x-5' : ''}`}></div>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleStartInterview}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 mt-4"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Start Interview
                </button>
              </div>
            </div>

            {/* Center: Welcome/Intro */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-4">Ready to ace your next interview?</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our AI-powered mock interview system simulates a real-world environment. 
                  You'll receive technical and behavioral questions tailored to your domain. 
                  We track your performance in real-time to provide actionable feedback.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-semibold">Real-time Analysis</h3>
                    </div>
                    <p className="text-sm text-gray-500">Instant feedback on eye contact, confidence, and clarity.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold">Detailed Summary</h3>
                    </div>
                    <p className="text-sm text-gray-500">Comprehensive report with strengths and weaknesses.</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Pro Tip</h3>
                  <p className="text-indigo-100 opacity-90">
                    Ensure you are in a well-lit room and speaking clearly. 
                    The AI evaluates your non-verbal cues just as much as your answers.
                  </p>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-10">
                  <Trophy className="w-48 h-48" />
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left: Question & Controls */}
            <div className="lg:col-span-3 space-y-6">
              {/* Question Area */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {QUESTIONS.length}
                  </span>
                  <div className="flex items-center gap-2 text-gray-500 font-mono text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                  {QUESTIONS[currentQuestionIndex].text}
                </h2>
              </div>

              {/* Video Feed Area */}
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group">
                {settings.cameraEnabled ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-900">
                    <VideoOff className="w-16 h-16 mb-4 opacity-20" />
                    <p>Camera is disabled</p>
                  </div>
                )}
                
                {/* Overlay Indicators */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {isRecording && (
                    <div className="flex items-center gap-2 bg-red-600/90 text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      REC
                    </div>
                  )}
                  <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-2">
                    {settings.micEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3 text-red-400" />}
                    {settings.micEnabled ? 'Audio Active' : 'Muted'}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/20">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={handleEndInterview}
                  className="px-6 py-3 bg-white border border-gray-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all flex items-center gap-2"
                >
                  <Square className="w-4 h-4 fill-current" />
                  End Interview
                </button>
                <button 
                  onClick={handleNextQuestion}
                  className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
                >
                  {currentQuestionIndex === QUESTIONS.length - 1 ? 'Finish' : 'Next Question'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Live Metrics */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold">Live Performance</h2>
                </div>

                <div className="space-y-6">
                  <ProgressBar label="Eye Contact" value={metrics.eyeContact} />
                  <ProgressBar label="Speaking Confidence" value={metrics.confidence} color="bg-blue-500" />
                  <ProgressBar label="Answer Clarity" value={metrics.clarity} color="bg-emerald-500" />
                  <ProgressBar label="Technical Accuracy" value={metrics.accuracy} color="bg-amber-500" />
                  
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32 flex items-center justify-center mb-2">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-100"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364.4}
                            strokeDashoffset={364.4 - (364.4 * metrics.overall) / 100}
                            className="text-indigo-600 transition-all duration-1000"
                          />
                        </svg>
                        <span className="absolute text-2xl font-bold">{Math.round(metrics.overall)}%</span>
                      </div>
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Overall Score</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === 'summary' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
              
              <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-50 rounded-full mb-6">
                <Trophy className="w-12 h-12 text-indigo-600" />
              </div>
              
              <h2 className="text-3xl font-bold mb-2">Interview Complete!</h2>
              <p className="text-gray-500 mb-8">Great job! Here is your performance breakdown.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                  { label: 'Overall Score', value: `${Math.round(metrics.overall)}%`, color: 'text-indigo-600' },
                  { label: 'Questions', value: QUESTIONS.length, color: 'text-gray-800' },
                  { label: 'Duration', value: `${settings.duration}m`, color: 'text-gray-800' },
                  { label: 'Status', value: 'Completed', color: 'text-green-600' }
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-bold text-gray-800">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-xl border border-green-100">
                      <span className="mt-1 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                      Excellent eye contact throughout the technical section.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-xl border border-green-100">
                      <span className="mt-1 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                      Strong conceptual understanding of {settings.domain} fundamentals.
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-bold text-gray-800">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                      <span className="mt-1 w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></span>
                      Work on reducing filler words during behavioral questions.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                      <span className="mt-1 w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></span>
                      Try to provide more structured answers using the STAR method.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-6">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Recommended Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Mastering the STAR Method', type: 'Article', time: '5 min' },
                  { title: 'Advanced React Patterns', type: 'Course', time: '2 hours' },
                  { title: 'System Design Fundamentals', type: 'Video', time: '15 min' }
                ].map((resource, i) => (
                  <div key={i} className="group p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer">
                    <p className="text-xs font-bold text-indigo-600 mb-1">{resource.type} • {resource.time}</p>
                    <h4 className="font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">{resource.title}</h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button 
                onClick={handleRetake}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-indigo-100"
              >
                <RefreshCw className="w-5 h-5" />
                Retake Interview
              </button>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-bottom-4 {
          from { transform: translateY(1rem); }
          to { transform: translateY(0); }
        }
        .animate-in {
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .slide-in-from-bottom-4 {
          animation-name: slide-in-from-bottom-4;
        }
        .duration-700 {
          animation-duration: 700ms;
        }
      `}</style>
    </div>
  );
}
