import * as dat from "dat.gui";

export class Clock {
  constructor(id) {
    this.canvas = document.getElementById(id);
    const dpr = window.devicePixelRatio || 1;
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width = window.innerWidth * dpr;
    this.height = this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.ctx.scale(dpr, dpr);
    this.centerX = this.width / 2 / dpr;
    this.centerY = this.height / 2 / dpr;
    this.clockRadius = ((Math.min(this.width, this.height) / 2) * 0.8) / dpr;

    this.parameters = [
      { angle: 0, length: 100, color: "blue", velocity: 0 },
      { angle: 0, length: 150, color: "blue", velocity: 0 },
      { angle: 0, length: 200, color: "white", velocity: 0 },
    ];
    this.timeSpeed = 1;

    const gui = new dat.GUI();
    const temps = ["Heures", "Minutes", "Secondes"];
    this.parameters.forEach((hand, i) => {
      gui.add(hand, "length", 0, 200).name(`${temps[i]}`);
    });
    gui.add(this, "timeSpeed", 0, 10).name("Vitesse du temps");
  }

  drawHand(hand) {
    const handX = this.centerX + Math.cos(hand.angle) * hand.length;
    const handY = this.centerY + Math.sin(hand.angle) * hand.length;

    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.centerY);
    this.ctx.lineTo(handX, handY);
    this.ctx.strokeStyle = hand.color;
    this.ctx.lineWidth = 30;
    this.ctx.lineCap = "round";
    this.ctx.stroke();
  }

  drawArcBetweenHands(hand1, hand2) {
    const hand1X = this.centerX + Math.cos(hand1.angle) * hand1.length;
    const hand1Y = this.centerY + Math.sin(hand1.angle) * hand1.length;
    const hand2X = this.centerX + Math.cos(hand2.angle) * hand2.length;
    const hand2Y = this.centerY + Math.sin(hand2.angle) * hand2.length;

    const radius =
      Math.sqrt(Math.pow(hand2X - hand1X, 2) + Math.pow(hand2Y - hand1Y, 2)) /
      2;
    const centerX = (hand1X + hand2X) / 2;
    const centerY = (hand1Y + hand2Y) / 2;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "purple";
    this.ctx.fill();
    this.ctx.globalCompositeOperation = "multiply";
  }

  drawClock() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.clockRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = "blue";
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();

    const now = new Date();
    const hours = now.getHours() * this.timeSpeed;
    const minutes = now.getMinutes() * this.timeSpeed;
    const seconds = now.getSeconds() * this.timeSpeed;
    const milliseconds = now.getMilliseconds() * this.timeSpeed;
    this.parameters[0].angle =
      ((hours % 12) * Math.PI * 2) / 12 + (minutes * Math.PI) / 6 / 60;
    this.parameters[1].angle =
      (minutes * Math.PI * 2) / 60 + (seconds * Math.PI) / 30 / 60;
    this.parameters[2].angle =
      ((seconds * 1000 + milliseconds) * Math.PI * 2) / 60000;

    this.parameters.forEach((hand, i) => {
      this.drawHand(hand);
      if (i < this.parameters.length - 1) {
        this.drawArcBetweenHands(hand, this.parameters[i + 1]);
      }
    });
  }

  update() {
    const gravity = 0.1;
    this.parameters.forEach((hand) => {
      hand.velocity += gravity;
      hand.angle += hand.velocity;
    });
  }

  start() {
    const animate = () => {
      this.update();
      this.drawClock();
      requestAnimationFrame(animate);
    };
    animate();
    window.addEventListener("resize", () => {
      const dpr = window.devicePixelRatio || 1;
      this.width = this.canvas.width = window.innerWidth * dpr;
      this.height = this.canvas.height = window.innerHeight * dpr;
      this.canvas.style.width = `${window.innerWidth}px`;
      this.canvas.style.height = `${window.innerHeight}px`;
      this.ctx.scale(dpr, dpr);
      this.centerX = this.width / 2 / dpr;
      this.centerY = this.height / 2 / dpr;
      this.clockRadius = ((Math.min(this.width, this.height) / 2) * 0.8) / dpr;
    });
  }
}

window.onload = function () {
  const clock = new Clock("canvas-scene");
  clock.start();
};

export default Clock