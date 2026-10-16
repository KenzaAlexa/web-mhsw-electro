/**
 * ⚡ HIGH-VOLTAGE SPARK CURSOR & PARTICLE SYSTEM
 * Generates dynamic yellow/gold electrical sparks that trail the mouse and burst on click
 */

class SparkParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.sparks = [];
    this.mouse = { x: -100, y: -100, lastX: -100, lastY: -100 };
    this.isMoving = false;
    this.fadeTimer = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.lastX = this.mouse.x;
      this.mouse.lastY = this.mouse.y;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Spawn trail sparks
      this.emitTrailSparks(e.clientX, e.clientY);
    });

    window.addEventListener('click', (e) => {
      this.burstSparks(e.clientX, e.clientY, 24);
    });

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  emitTrailSparks(x, y) {
    if (Math.random() < 0.45) return;
    const count = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.5;
      this.sparks.push({
        x: x + (Math.random() * 8 - 4),
        y: y + (Math.random() * 8 - 4),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.4, // Slight gravity
        size: Math.random() * 2.2 + 0.8,
        alpha: 1,
        decay: Math.random() * 0.04 + 0.02,
        color: Math.random() > 0.3 ? '#FFD700' : '#FFF9C4'
      });
    }
  }

  burstSparks(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      this.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        alpha: 1,
        decay: Math.random() * 0.035 + 0.025,
        color: ['#FFD700', '#FFA000', '#FFFFFF', '#FFF176'][Math.floor(Math.random() * 4)]
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const p = this.sparks[i];
      if (p.alpha <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = '#FFD700';
      this.ctx.shadowBlur = 8;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06; // Gravity
      p.alpha -= p.decay;
    }

    requestAnimationFrame(this.animate);
  }
}

window.SparkParticleSystem = SparkParticleSystem;
