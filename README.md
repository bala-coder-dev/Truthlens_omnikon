🔍 TruthLens — AI Deepfake & Manipulated Media Forensic Detector
VERIFY • ANALYZE • REVEAL
An explainable multimodal forensic inspection platform engineered to detect synthetic manipulation, latent diffusion artifacts, face-swaps, and neural voice clones across images, videos, and audio.
📖 Overview
As synthetic media generation advances, distinguishing authentic captures from generated deepfakes requires more than simple binary classifiers. TruthLens delivers an explainable forensic auditing suite combining:
Multimodal Forensic AI Reasoning Engine: Performs multi-dimensional signal analysis evaluating optical physics, biological continuity, sensor noise floors, and spectral acoustic acoustics.
Interactive Visual Forensic Sandbox: Live in-browser hardware-accelerated canvas filters including Laplacian Edge Seam Detection, Thermal/Noise Heatmaps, Solarization, and a 2.5x Loupe Magnifier.
Video Keyframe Scrubber: Frame-by-frame timestamp stepping (-1s, -0.2s, +0.2s, +1s) with automated keyframe locking for targeted spatial inspection.
Acoustic Waveform Analysis: Real-time Web Audio API amplitude peak extraction, interactive playhead seeking, vocoder frequency analysis, and live microphone voice recording.
Explainable Diagnostic Reports: Calibrated certainty ratings, 4-pillar technical scoring breakdowns, and 1-click clipboard forensic certificates.
✨ Key Features
🖼️ 1. Image Forensic Inspection
Optical & Physical Coherence: Audits corneal specular reflections, depth-of-field consistency, and ambient light vector alignment.
Anatomical Geometry: Inspects complex structural generation failure points (hands, ear cartilage, teeth alignment, micro-textures).
Sensor Noise & Bayer Patterns: Analyzes camera sensor noise floors and high-frequency pixel distribution for diffusion anomalies.
🎬 2. Video Keyframe Timeline Inspector
Sub-Second Precision Scrubbing: Step forward and backward through video streams to catch transient single-frame face-swap glitches.
Instant Frame Lock: Extracts lossless keyframes directly from the video stream with exact timestamp metadata attached to the forensic report.
Supported Video Formats: .mp4, .webm, .mov, .mkv, .avi, .m4v, .3gp, .ogv.
🎙️ 3. Voice & Audio Clone Forensics
Neural Vocoder Fingerprinting: Identifies phase rigidity, high-frequency robotic buzz (>14 kHz), and unnatural pitch quantization.
Biological Breath Acoustics: Checks for missing natural respiratory dynamics, chest resonance, and abrupt digital silence gating between phonemes.
Live Microphone Recording: Capture voice notes directly from your browser to test voice authenticity in real time.
Supported Audio Formats: .mp3, .wav, .m4a, .aac, .ogg, .flac, .weba, .opus.
🔬 4. Real-Time Forensic Filter Suite
Laplacian Edge Seam Detector: Identifies boundary feathering, haloing, and face-swap blending seams around facial perimeters and jawlines.
Thermal / Noise Inconsistency Heatmap: Highlights unnatural variances in high-frequency pixel noise between foreground subjects and backgrounds.
Solarize / Invert: Enhances subtle contrast gradients to reveal digital compression cuts and retouching boundaries.
2.5x Precision Loupe Magnifier: Enables granular zoom inspection of hair strands, pupils, and edge transitions.
🏗️ System Architecture
code
Code
+-------------------------------------------------------------+
                                  |                     CLIENT BROWSER (UI)                     |
                                  +-------------------------------------------------------------+
                                                                 |
                                       +-------------------------+-------------------------+
                                       |                                                   |
                             [ Media Ingestion Engine ]                           [ Interactive Sandbox ]
                             * Drag & Drop / Auto Type Sniffing                   * 2.5x Loupe Magnifier
                             * Live Microphone Recorder (WAV)                     * Laplacian Edge Seam Filter
                             * Frame Scrubber & Stepper (Video)                   * Thermal / Noise Heatmap
                             * Web Audio Waveform Peak Analyzer                   * Solarize / Invert Visualizer
                                       |                                                   |
                                       +-------------------------+-------------------------+
                                                                 |
                                                    [ Client Payload Dispatch ]
                                                    * Base64 / ArrayBuffer Encoding
                                                    * MIME Sniffing & Context Payload
                                                                 |
                                                                 v  HTTPS / JSON POST (/api/analyze)
+-----------------------------------------------------------------------------------------------------------------------------------+
|                                                  BACKEND SERVER (Express + Node.js)                                               |
+-----------------------------------------------------------------------------------------------------------------------------------+
|                                                                                                                                   |
|   1. Request Ingestion & Buffer Sanitization                                                                                      |
|      * Base64 Normalization & Media MIME Validation                                                                               |
|      * Remote Media Stream Proxying & URL Buffer Fetching                                                                         |
|                                                                                                                                   |
|   2. Contextual Prompt & Structured Schema Synthesis                                                                              |
|      * Visual Heuristics (Bayer Noise, Corneal Reflections, Diffusion Artifacts, Facial Blending)                                 |
|      * Acoustic Heuristics (Neural Vocoder Signatures, Robotic Quantization, Phase Buzzing, Respiration)                          |
|                                                                                                                                   |
|   3. Multi-Tier AI Forensic Reasoning Pipeline                                                                                    |
|      * High-accuracy multimodal vision & acoustic inference cascade with deterministic heuristic failover                         |
|                                                                                                                                   |
|   4. JSON Structured Forensic Parser & Sanitizer                                                                                  |
|      * Standardized Verdict: Likely Manipulated (Red) | Suspicious (Amber) | Likely Authentic (Green)                             |
|      * Confidence Score Calculation & 4-Pillar Forensic Breakdown Metric Generator                                                |
|                                                                                                                                   |
+-----------------------------------------------------------------------------------------------------------------------------------+
                                                                 |
                                                                 v  Structured JSON Response
+-----------------------------------------------------------------------------------------------------------------------------------+
|                                                  CLIENT REPORTING & STATE LAYER                                                   |
+-----------------------------------------------------------------------------------------------------------------------------------+
|   * Calibrated Confidence Gauge (Radial Arc Visualization)                                                                        |
|   * Technical Pillar Scorecard Matrix (4-Point Diagnostic Dimensions)                                                             |
|   * Bulleted Explainable Forensic Evidence Log                                                                                    |
|   * 1-Click Clipboard Forensic Certificate Generator                                                                              |
|   * Persistent Local Scan History (Indexed LocalStorage Cache)                                                                    |
+-----------------------------------------------------------------------------------------------------------------------------------+
🛠️ Technology Stack
Layer	Technologies
Frontend Framework	React 18, TypeScript, Vite
Styling & UI	Tailwind CSS, Lucide Icons, Custom Forensic Canvas Shaders
Media Processing	Web Audio API, HTML5 Canvas 2D API, MediaRecorder API
Backend Runtime	Node.js, Express, TypeScript (tsx / esbuild)
Forensics & AI Engine	Multimodal Forensic Inspection Architecture with Heuristic Failover
🚀 Getting Started
Prerequisites
Node.js (v18 or higher)
npm or bun
Installation & Local Setup
Clone the repository:
code
Bash
git clone https://github.com/your-username/truthlens.git
cd truthlens
Install dependencies:
code
Bash
npm install
Configure environment variables:
Create a .env file in the root directory (refer to .env.example):
code
Env
PORT=3000
Start the development server:
code
Bash
npm run dev
Open http://localhost:3000 in your browser.
Build for production:
code
Bash
npm run build
npm start
📋 Evaluation Verdicts & Confidence Scoring
TruthLens provides calibrated assessments categorized into three tiers:
🟢 Likely Authentic (0% - 30% Manipulation Confidence): High consistency across optical physics, continuous sensor noise, natural anatomical geometry, and organic speech intonation.
🟡 Suspicious (31% - 69% Manipulation Confidence): Ambiguous signals detected (e.g., heavy compression, lighting anomalies, or slight acoustic vocoder gating) requiring manual verification.
🔴 Likely Manipulated (70% - 100% Manipulation Confidence): Clear forensic signatures of generative diffusion models, face-swap blending seams, impossible perspective physics, or neural speech synthesis.
🛡️ License
This project is licensed under the MIT License — see the LICENSE file for details.
The following action was requested:
Running linter...The action produced the following result:
Linting completed successfully
Output:
react-example@0.0.0 lint
tsc --noEmit
