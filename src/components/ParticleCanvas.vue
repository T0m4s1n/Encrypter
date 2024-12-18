<script>
export default {
  name: 'ParticleCanvas',
  data() {
    return {
      config: {
        particleCount: 5000,
        textArray: ['Encrypt.', 'Vault.', 'Secure.', 'Protect.', 'Safe.', 'Private.', 'T0m4s1n', 'Shield.', 'Lock.', 'Guard.'],
        mouseRadius: 0.1,
        particleSize: 2,
        forceMultiplier: 0.001,
        returnSpeed: 0.005,
        velocityDamping: 0.95,
        colorMultiplier: 40000,
        saturationMultiplier: 1000,
        textChangeInterval: 10000,
        rotationForceMultiplier: 0.5
      },
      particles: [],
      currentTextIndex: 0,
      nextTextTimeout: null,
      textCoordinates: [],
      mouse: { x: -500, y: -500, radius: 0.1 },
    };
  },
  mounted() {
    this.initCanvas();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationId);
    clearTimeout(this.nextTextTimeout);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas;
      this.gl = canvas.getContext('webgl');

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.gl.viewport(0, 0, canvas.width, canvas.height);

      this.initParticles();
      this.createShaders();
      this.createParticles();

      this.gl.clearColor(0, 0, 0, 1);
      this.animate();
      this.nextTextTimeout = setTimeout(this.changeText, this.config.textChangeInterval);

      canvas.addEventListener('mousemove', this.handleMouseMove);
      canvas.addEventListener('mouseleave', this.handleMouseLeave);
    },
    initParticles() {
      for (let i = 0; i < this.config.particleCount; i++) {
        this.particles.push({ x: 0, y: 0, baseX: 0, baseY: 0, vx: 0, vy: 0 });
      }
    },
    createShaders() {
      const { gl } = this;
      const vertexShaderSource = `
        attribute vec2 a_position;
        attribute float a_hue;
        attribute float a_saturation;
        varying float v_hue;
        varying float v_saturation;
        void main() {
          gl_PointSize = ${this.config.particleSize.toFixed(1)};
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_hue = a_hue;
          v_saturation = a_saturation;
        }
      `;

      const fragmentShaderSource = `
        precision mediump float;
        varying float v_hue;
        varying float v_saturation;
        void main() {
          float c = v_hue * 6.0;
          float x = 1.0 - abs(mod(c, 2.0) - 1.0);
          vec3 color;
          if (c < 1.0) color = vec3(1.0, x, 0.0);
          else if (c < 2.0) color = vec3(x, 1.0, 0.0);
          else if (c < 3.0) color = vec3(0.0, 1.0, x);
          else if (c < 4.0) color = vec3(0.0, x, 1.0);
          else if (c < 5.0) color = vec3(x, 0.0, 1.0);
          else color = vec3(1.0, 0.0, x);
          vec3 finalColor = mix(vec3(1.0), color, v_saturation);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `;

      const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
      this.program = this.createProgram(gl, vertexShader, fragmentShader);
      gl.useProgram(this.program);

      this.positionAttributeLocation = gl.getAttribLocation(this.program, 'a_position');
      this.hueAttributeLocation = gl.getAttribLocation(this.program, 'a_hue');
      this.saturationAttributeLocation = gl.getAttribLocation(this.program, 'a_saturation');

      this.positionBuffer = gl.createBuffer();
      this.hueBuffer = gl.createBuffer();
      this.saturationBuffer = gl.createBuffer();

      this.positions = new Float32Array(this.config.particleCount * 2);
      this.hues = new Float32Array(this.config.particleCount);
      this.saturations = new Float32Array(this.config.particleCount);
    },
    createParticles() {
      this.textCoordinates = this.getTextCoordinates(this.config.textArray[this.currentTextIndex]);
      for (let i = 0; i < this.config.particleCount; i++) {
        const randomIndex = Math.floor(Math.random() * this.textCoordinates.length);
        const { x, y } = this.textCoordinates[randomIndex];
        this.particles[i].x = this.particles[i].baseX = x;
        this.particles[i].y = this.particles[i].baseY = y;
      }
    },
    getTextCoordinates(text) {
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.canvas.width = this.$refs.canvas.width;
      ctx.canvas.height = this.$refs.canvas.height;
      const fontSize = Math.min(ctx.canvas.width / 6, ctx.canvas.height / 6);
      ctx.font = `900 ${fontSize}px Arial`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2);
      const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
      const coordinates = [];
      for (let y = 0; y < ctx.canvas.height; y += 4) {
        for (let x = 0; x < ctx.canvas.width; x += 4) {
          const index = (y * ctx.canvas.width + x) * 4;
          if (imageData[index + 3] > 128) {
            coordinates.push({ x: (x / ctx.canvas.width) * 2 - 1, y: (y / ctx.canvas.height) * -2 + 1 });
          }
        }
      }
      return coordinates;
    },
    animate() {
      this.updateParticles();
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.DYNAMIC_DRAW);
      this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.positionAttributeLocation);

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.hueBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.hues, this.gl.DYNAMIC_DRAW);
      this.gl.vertexAttribPointer(this.hueAttributeLocation, 1, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.hueAttributeLocation);

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.saturationBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.saturations, this.gl.DYNAMIC_DRAW);
      this.gl.vertexAttribPointer(this.saturationAttributeLocation, 1, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.saturationAttributeLocation);

      this.gl.drawArrays(this.gl.POINTS, 0, this.config.particleCount);
      this.animationId = requestAnimationFrame(this.animate);
    },
    handleMouseMove(event) {
      const canvas = this.$refs.canvas;
      this.mouse.x = (event.clientX / canvas.width) * 2 - 1;
      this.mouse.y = (event.clientY / canvas.height) * -2 + 1;
    },
    handleMouseLeave() {
      this.mouse.x = -500;
      this.mouse.y = -500;
    },
    handleResize() {
      const canvas = this.$refs.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.gl.viewport(0, 0, canvas.width, canvas.height);
      this.createParticles();
    },
    changeText() {
      this.currentTextIndex = (this.currentTextIndex + 1) % this.config.textArray.length;
      const newCoordinates = this.getTextCoordinates(this.config.textArray[this.currentTextIndex]);
      for (let i = 0; i < this.config.particleCount; i++) {
        const randomIndex = Math.floor(Math.random() * newCoordinates.length);
        const { x, y } = newCoordinates[randomIndex];
        this.particles[i].baseX = x;
        this.particles[i].baseY = y;
      }
      this.nextTextTimeout = setTimeout(this.changeText, this.config.textChangeInterval);
    },
    createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    },
    createProgram(gl, vertexShader, fragmentShader) {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      return program;
    },
    updateParticles() {
      const { mouse, config, particles } = this;
      for (let i = 0; i < config.particleCount; i++) {
        const particle = particles[i];
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const directionX = dx / distance;
        const directionY = dy / distance;
        if (distance < mouse.radius) {
          particle.vx -= directionX * config.forceMultiplier;
          particle.vy -= directionY * config.forceMultiplier;
        }
        const homeDx = particle.baseX - particle.x;
        const homeDy = particle.baseY - particle.y;
        particle.vx += homeDx * config.returnSpeed;
        particle.vy += homeDy * config.returnSpeed;

        particle.vx *= config.velocityDamping;
        particle.vy *= config.velocityDamping;

        particle.x += particle.vx;
        particle.y += particle.vy;

        this.positions[i * 2] = particle.x;
        this.positions[i * 2 + 1] = particle.y;
        this.hues[i] = ((distance * distance) / config.colorMultiplier) % 1.0;
        this.saturations[i] = Math.exp(-distance * distance * config.saturationMultiplier);
      }
    }
  }
};
</script>
<template>
    <div ref="container">
      <canvas ref="canvas"></canvas>
    </div>
</template> 
<style scoped>
  canvas {
    position: fixed;
    z-index: -1;
    top: 0;
    left: 0;
  }
  </style>
  
