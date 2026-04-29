import { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/InterviewPage.css';

const API_BASE = 'http://localhost:3000/api/interview-ai';

function InterviewPage() {
  const [step, setStep] = useState('setup'); // setup | interview | complete
  const [jobRole, setJobRole] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [currentEmotion, setCurrentEmotion] = useState({ emotion: 'NEUTRAL', confidence: 0 });
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [emotionDetectionActive, setEmotionDetectionActive] = useState(false);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const emotionIntervalRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (emotionIntervalRef.current) clearInterval(emotionIntervalRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setEmotionDetectionActive(true);
    } catch (err) {
      console.warn('Camera not available:', err.message);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setEmotionDetectionActive(false);
  };

  const captureFrameBase64 = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth || 320;
    canvas.height = videoRef.current.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
  }, []);

  const runEmotionDetection = useCallback(async (sid) => {
    const frameBase64 = captureFrameBase64();
    if (!frameBase64 || !sid) return;

    try {
      const resp = await fetch(`${API_BASE}/emotion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid, imageBase64: frameBase64 }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setCurrentEmotion({ emotion: data.emotion, confidence: data.confidence });
        setEmotionHistory(prev => [...prev.slice(-19), data]);
      }
    } catch {
      // Emotion detection is best-effort
    }
  }, [captureFrameBase64]);

  const startInterview = async () => {
    if (!jobRole.trim()) {
      setError('Please enter a job role.');
      return;
    }
    setError('');

    try {
      const resp = await fetch(`${API_BASE}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRole: jobRole.trim(), candidateName: candidateName.trim() || undefined }),
      });

      if (!resp.ok) throw new Error('Failed to start session');
      const session = await resp.json();
      setSessionId(session.id);
      setStep('interview');

      // Start camera and emotion detection
      await startCamera();

      // Send initial greeting message
      setIsThinking(true);
      const chatResp = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, message: 'The candidate has just joined the interview. Please greet them and begin.' }),
      });
      if (chatResp.ok) {
        const chatData = await chatResp.json();
        setTranscript([{ role: 'HR Manager', content: chatData.reply, timestamp: new Date().toISOString() }]);
        if (chatData.reply.includes('[INTERVIEW COMPLETE]')) {
          setInterviewComplete(true);
        }
      }
      setIsThinking(false);

      // Start periodic emotion detection every 3 seconds
      emotionIntervalRef.current = setInterval(() => runEmotionDetection(session.id), 3000);

    } catch (err) {
      setError(`Error: ${err.message}`);
      setIsThinking(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !sessionId || isThinking) return;

    const userMessage = inputText.trim();
    setInputText('');
    setTranscript(prev => [...prev, { role: 'Candidate', content: userMessage, timestamp: new Date().toISOString() }]);
    setIsThinking(true);

    try {
      const resp = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: userMessage }),
      });

      if (!resp.ok) throw new Error('Chat failed');
      const data = await resp.json();
      setTranscript(prev => [...prev, { role: 'HR Manager', content: data.reply, timestamp: new Date().toISOString() }]);

      if (data.reply.includes('[INTERVIEW COMPLETE]')) {
        setInterviewComplete(true);
      }
    } catch (err) {
      setError(`Chat error: ${err.message}`);
    } finally {
      setIsThinking(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

        setIsThinking(true);
        try {
          const resp = await fetch(`${API_BASE}/transcribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, audioBase64: base64 }),
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data.text) {
              setInputText(data.text);
            }
          }
        } catch (err) {
          setError(`Transcription error: ${err.message}`);
        } finally {
          setIsThinking(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      setError(`Microphone error: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const completeInterview = async () => {
    if (!sessionId) return;
    setIsThinking(true);
    if (emotionIntervalRef.current) clearInterval(emotionIntervalRef.current);
    stopCamera();

    try {
      const resp = await fetch(`${API_BASE}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!resp.ok) throw new Error('Failed to complete interview');
      const data = await resp.json();
      setResume(data.resume);
      setStep('complete');
    } catch (err) {
      setError(`Completion error: ${err.message}`);
    } finally {
      setIsThinking(false);
    }
  };

  const getEmotionColor = (emotion) => {
    return emotion === 'IRRITATED' ? '#e74c3c' : '#27ae60';
  };

  const getEmotionEmoji = (emotion) => {
    return emotion === 'IRRITATED' ? '😠' : '😊';
  };

  if (step === 'setup') {
    return (
      <div className="interview-page">
        <div className="interview-setup">
          <h1>🤖 AI Interview Session</h1>
          <p className="subtitle">
            Start an AI-powered HR interview with real-time emotion detection and speech transcription.
          </p>

          {error && <div className="error-banner">{error}</div>}

          <div className="setup-form">
            <div className="form-group">
              <label>Job Role *</label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g., Software Engineer, Product Manager"
                onKeyDown={(e) => e.key === 'Enter' && startInterview()}
              />
            </div>

            <div className="form-group">
              <label>Your Name (optional)</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g., John Smith"
                onKeyDown={(e) => e.key === 'Enter' && startInterview()}
              />
            </div>

            <button className="btn-primary btn-large" onClick={startInterview}>
              🚀 Start Interview
            </button>
          </div>

          <div className="features-info">
            <h3>What to expect:</h3>
            <ul>
              <li>🎙️ Voice recording with automatic transcription (Whisper)</li>
              <li>😊 Real-time emotion detection via webcam</li>
              <li>🤖 AI interviewer powered by Ollama (llama3)</li>
              <li>📄 Auto-generated resume at completion</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="interview-page">
        <div className="interview-complete">
          <h1>✅ Interview Complete</h1>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">{transcript.length}</span>
              <span className="stat-label">Messages</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{emotionHistory.length}</span>
              <span className="stat-label">Emotion Readings</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {emotionHistory.filter(e => e.emotion === 'IRRITATED').length}
              </span>
              <span className="stat-label">Stressed Moments</span>
            </div>
          </div>

          {resume && (
            <div className="resume-section">
              <h2>📄 Generated Resume</h2>
              <pre className="resume-json">{JSON.stringify(resume, null, 2)}</pre>
            </div>
          )}

          <div className="transcript-review">
            <h2>📝 Interview Transcript</h2>
            <div className="transcript-list">
              {transcript.map((entry, i) => (
                <div key={i} className={`transcript-entry ${entry.role === 'Candidate' ? 'candidate' : 'hr'}`}>
                  <strong>{entry.role}:</strong> {entry.content}
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={() => { setStep('setup'); setTranscript([]); setSessionId(null); setResume(null); setEmotionHistory([]); setInterviewComplete(false); }}>
            🔄 Start New Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-page interview-active">
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="interview-layout">
        {/* Left: Video + Emotion */}
        <div className="interview-sidebar">
          <div className="video-container">
            <video ref={videoRef} autoPlay muted playsInline className="video-feed" />
            {!emotionDetectionActive && (
              <div className="video-placeholder">📷 Camera not available</div>
            )}
          </div>

          <div className="emotion-display" style={{ borderColor: getEmotionColor(currentEmotion.emotion) }}>
            <span className="emotion-emoji">{getEmotionEmoji(currentEmotion.emotion)}</span>
            <div>
              <div className="emotion-label" style={{ color: getEmotionColor(currentEmotion.emotion) }}>
                {currentEmotion.emotion}
              </div>
              <div className="emotion-confidence">
                {(currentEmotion.confidence * 100).toFixed(0)}% confidence
              </div>
            </div>
          </div>

          <div className="emotion-history">
            <h4>Recent Emotions</h4>
            <div className="emotion-bars">
              {emotionHistory.slice(-10).map((e, i) => (
                <div
                  key={i}
                  className="emotion-bar-item"
                  title={`${e.emotion} (${(e.confidence * 100).toFixed(0)}%)`}
                  style={{ backgroundColor: getEmotionColor(e.emotion) }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Chat */}
        <div className="interview-main">
          <div className="interview-header">
            <h2>🎤 Interview: <em>{jobRole}</em></h2>
            {candidateName && <span className="candidate-badge">👤 {candidateName}</span>}
          </div>

          {error && <div className="error-banner">{error}</div>}

          <div className="transcript-window">
            {transcript.map((entry, i) => (
              <div key={i} className={`message ${entry.role === 'Candidate' ? 'message-user' : 'message-hr'}`}>
                <div className="message-role">{entry.role}</div>
                <div className="message-content">{entry.content.replace('[INTERVIEW COMPLETE]', '').trim()}</div>
              </div>
            ))}
            {isThinking && (
              <div className="message message-hr">
                <div className="message-role">HR Manager</div>
                <div className="message-content thinking">Thinking…</div>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>

          <div className="input-area">
            <div className="input-row">
              <textarea
                className="message-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your answer or use the microphone…"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isThinking || interviewComplete}
              />
            </div>

            <div className="action-buttons">
              <button
                className={`btn-record ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isThinking || interviewComplete}
                title={isRecording ? 'Stop recording' : 'Record audio answer'}
              >
                {isRecording ? '⏹ Stop' : '🎙 Record'}
              </button>

              <button
                className="btn-primary"
                onClick={sendMessage}
                disabled={isThinking || !inputText.trim() || interviewComplete}
              >
                Send ➤
              </button>

              {interviewComplete && (
                <button className="btn-complete" onClick={completeInterview} disabled={isThinking}>
                  {isThinking ? 'Generating…' : '📄 Generate Resume & Finish'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;
