/**
 * ⚡ PROCEDURAL LIGHTNING GENERATOR (CANVAS API)
 * High-voltage recursive branch generation with realistic luminescence
 */

class LightningEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.bolts = [];
    this.lastTime = 0;
    this.ambientInterval = 2800; // ms
    this.nextStrikeTime = Date.now() + 1000;
    this.voltageMultiplier = 1;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Interactive Strike on Click
    window.addEventListener('click', (e) => {
      // Don't trigger if clicking interactive buttons or inputs
      if (e.target.closest('button, a, input, textarea, select')) return;
      this.strikeToPoint(e.clientX, e.clientY);
    });

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  setVoltageMode(mode) {
    if (mode === '500kV') {
      this.ambientInterval = 1200;
      this.voltageMultiplier = 1.8;
    } else if (mode === '380V') {
      this.ambientInterval = 2000;
      this.voltageMultiplier = 1.3;
    } else {
      this.ambientInterval = 2800;
      this.voltageMultiplier = 1.0;
    }
  }

  strikeToPoint(targetX, targetY) {
    const startX = targetX + (Math.random() * 200 - 100);
    const startY = 0;
    this.createBolt(startX, startY, targetX, targetY, 3, true);
    
    // Trigger screen flash effect
    this.flashScreen();
  }

  createBolt(x1, y1, x2, y2, branchDepth = 2, isMain = true) {
    const segments = [];
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(6, Math.floor(dist / 30));

    let currentX = x1;
    let currentY = y1;
    segments.push({ x: currentX, y: currentY });

    for (let i = 1; i <= steps; i++) {
      const progress = i / steps;
      const targetSubX = x1 + (x2 - x1) * progress;
      const targetSubY = y1 + (y2 - y1) * progress;

      // Random jitter perpendicular to trajectory
      const jitter = (Math.random() - 0.5) * (40 * this.voltageMultiplier);
      const nextX = targetSubX + jitter;
      const nextY = targetSubY + (Math.random() - 0.5) * 15;

      segments.push({ x: nextX, y: nextY });

      // Spontaneous branch off
      if (branchDepth > 0 && Math.random() < 0.28) {
        const branchAngle = Math.atan2(y2 - y1, x2 - x1) + (Math.random() - 0.5) * 1.2;
        const branchLength = (dist * (0.3 + Math.random() * 0.4)) / (4 - branchDepth);
        const bx2 = nextX + Math.cos(branchAngle) * branchLength;
        const by2 = nextY + Math.sin(branchAngle) * branchLength;
        this.createBolt(nextX, nextY, bx2, by2, branchDepth - 1, false);
      }
    }

    this.bolts.push({
      segments,
      alpha: 1.0,
      width: (isMain ? 2.5 : 1.2) * this.voltageMultiplier,
      decay: 0.045 + Math.random() * 0.03,
      color: Math.random() > 0.4 ? '#FFD700' : '#FFF9A6'
    });
  }

  flashScreen() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    hero.classList.add('electric-shock-hit');
    setTimeout(() => hero.classList.remove('electric-shock-hit'), 350);
  }

  spontaneousStrike() {
    const startX = Math.random() * this.width;
    const endX = startX + (Math.random() * 300 - 150);
    const endY = this.height * (0.4 + Math.random() * 0.5);
    this.createBolt(startX, 0, endX, endY, 2, true);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const now = Date.now();
    if (now > this.nextStrikeTime) {
      this.spontaneousStrike();
      this.nextStrikeTime = now + (this.ambientInterval * (0.6 + Math.random() * 0.8));
    }

    // Draw active lightning bolts
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const bolt = this.bolts[i];
      if (bolt.alpha <= 0) {
        this.bolts.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = bolt.alpha;
      this.ctx.strokeStyle = bolt.color;
      this.ctx.lineWidth = bolt.width;
      this.ctx.shadowColor = '#FFD700';
      this.ctx.shadowBlur = 18 * this.voltageMultiplier;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'miter';

      this.ctx.beginPath();
      for (let j = 0; j < bolt.segments.length; j++) {
        const pt = bolt.segments[j];
        if (j === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      }
      this.ctx.stroke();

      // Inner white core for blinding luminescence
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = Math.max(1, bolt.width * 0.4);
      this.ctx.shadowBlur = 6;
      this.ctx.stroke();

      this.ctx.restore();

      bolt.alpha -= bolt.decay;
    }

    requestAnimationFrame(this.animate);
  }
}

window.LightningEngine = LightningEngine;
