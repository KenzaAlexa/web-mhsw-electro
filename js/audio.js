/**
 * ⚡ WEB AUDIO API ELECTRICAL SYNTHESIZER
 * Synthesizes realistic 50Hz transformer hum & electric discharge sparks (Zero external files needed)
 */

class ElectricAudioSynth {
  constructor() {
    this.audioCtx = null;
    this.isMuted = true;
    this.humOsc = null;
    this.humGain = null;
    this.toggleBtn = document.getElementById('audio-toggle-btn');

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleAudio());
    }

    // Attach click zap sound to buttons
    document.addEventListener('click', (e) => {
      if (!this.isMuted && e.target.closest('button, .nav-link, .voltage-btn, .project-card, .curriculum-chip')) {
        this.playZap();
      }
    });
  }

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    // 50 Hz AC Transformer Mains Hum
    this.humOsc = this.audioCtx.createOscillator();
    this.humOsc.type = 'sawtooth';
    this.humOsc.frequency.setValueAtTime(50, this.audioCtx.currentTime); // 50Hz PLN frequency

    // Filter to give deep low-pass rumble
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, this.audioCtx.currentTime);

    this.humGain = this.audioCtx.createGain();
    this.humGain.gain.setValueAtTime(0, this.audioCtx.currentTime);

    this.humOsc.connect(filter);
    filter.connect(this.humGain);
    this.humGain.connect(this.audioCtx.destination);
    this.humOsc.start();
  }

  toggleAudio() {
    if (this.isMuted) {
      this.init();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      this.isMuted = false;
      this.humGain.gain.setTargetAtTime(0.04, this.audioCtx.currentTime, 0.2); // subtle background hum
      if (this.toggleBtn) {
        this.toggleBtn.classList.add('active');
        this.toggleBtn.innerHTML = `<span>🔊</span> <span>AUDIO: ON</span>`;
      }
      this.playZap();
    } else {
      this.isMuted = true;
      if (this.humGain) {
        this.humGain.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.1);
      }
      if (this.toggleBtn) {
        this.toggleBtn.classList.remove('active');
        this.toggleBtn.innerHTML = `<span>🔇</span> <span>AUDIO: OFF</span>`;
      }
    }
  }

  playZap() {
    if (this.isMuted || !this.audioCtx) return;

    const zapOsc = this.audioCtx.createOscillator();
    const zapGain = this.audioCtx.createGain();

    zapOsc.type = 'triangle';
    // Frequency sweep down from 1200Hz to 80Hz in 60ms (electric crackle)
    zapOsc.frequency.setValueAtTime(800 + Math.random() * 400, this.audioCtx.currentTime);
    zapOsc.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.08);

    zapGain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
    zapGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

    zapOsc.connect(zapGain);
    zapGain.connect(this.audioCtx.destination);

    zapOsc.start();
    zapOsc.stop(this.audioCtx.currentTime + 0.09);
  }
}

window.ElectricAudioSynth = ElectricAudioSynth;
