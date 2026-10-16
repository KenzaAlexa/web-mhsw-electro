/**
 * ⚡ INTERACTIVE OHM'S LAW & POWER ANALYZER
 * Live circuit calculations with SVG dial meter visualization
 */

class CircuitSimulator {
  constructor() {
    this.voltageSlider = document.getElementById('sim-voltage-slider');
    this.currentSlider = document.getElementById('sim-current-slider');
    this.voltageVal = document.getElementById('sim-voltage-val');
    this.currentVal = document.getElementById('sim-current-val');
    this.wattsReadout = document.getElementById('sim-watts-readout');
    this.resistanceReadout = document.getElementById('sim-resistance-readout');
    this.hpReadout = document.getElementById('sim-hp-readout');
    this.gaugeCircle = document.getElementById('sim-gauge-circle');
    this.safetyStatus = document.getElementById('sim-safety-status');

    if (!this.voltageSlider || !this.currentSlider) return;

    this.voltageSlider.addEventListener('input', () => this.update());
    this.currentSlider.addEventListener('input', () => this.update());

    this.update();
  }

  update() {
    const voltage = parseFloat(this.voltageSlider.value);
    const current = parseFloat(this.currentSlider.value);

    // Ohm's Law & Power Calculations
    const watts = voltage * current;
    const resistance = (voltage / current).toFixed(2);
    const hp = (watts / 746).toFixed(2);

    // Update Text Displays
    if (this.voltageVal) this.voltageVal.textContent = `${voltage} V`;
    if (this.currentVal) this.currentVal.textContent = `${current} A`;
    if (this.wattsReadout) this.wattsReadout.textContent = Math.round(watts);
    if (this.resistanceReadout) this.resistanceReadout.textContent = `${resistance} Ω`;
    if (this.hpReadout) this.hpReadout.textContent = `${hp} HP`;

    // Update Circular Gauge
    // Max Watts = 400V * 32A = 12,800 W. Circumference ~ 565.
    const maxPower = 8000;
    const ratio = Math.min(1, watts / maxPower);
    const maxOffset = 565;
    const newOffset = maxOffset - (ratio * (maxOffset - 70));

    if (this.gaugeCircle) {
      this.gaugeCircle.style.strokeDashoffset = newOffset;
      if (watts > 4500) {
        this.gaugeCircle.style.stroke = '#FF3300';
      } else if (watts > 2500) {
        this.gaugeCircle.style.stroke = '#FFA000';
      } else {
        this.gaugeCircle.style.stroke = '#FFD700';
      }
    }

    // Safety Trip Indicator
    if (this.safetyStatus) {
      if (watts > 5000) {
        this.safetyStatus.textContent = '⚠️ OVERLOAD WARN';
        this.safetyStatus.style.color = '#FF3300';
      } else if (watts > 2200) {
        this.safetyStatus.textContent = '⚡ HEAVY LOAD';
        this.safetyStatus.style.color = '#FFA000';
      } else {
        this.safetyStatus.textContent = '🟢 NORMAL GRID';
        this.safetyStatus.style.color = '#00FF88';
      }
    }
  }
}

window.CircuitSimulator = CircuitSimulator;
