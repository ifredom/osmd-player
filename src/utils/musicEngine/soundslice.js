var Raphael = require("raphael");
// 本地项目：soundslice-svg-master
export default class Soundslice {
  constructor(el, openSheetMusicDisplay) {
    this.el = el;
    this.osmd = openSheetMusicDisplay;
    this.animating = false;
    this.animateDx = 10;
    this.xmin = 10;
    this.timer = null;
    this.xmax = this.osmd.container.clientWidth - 45; // 拖动界限 - 滚动条
    this.initStave(el);
    this.startAnimate();
  }

  startAnimate() {
    if (!this.animating) {
      clearInterval(this.timer);
      return
    };
    this.timer = setInterval(() => {
      this.animate();
    }, 1000/60);

    // requestAnimationFrame(this.animate.bind(this));
    // if (!this.animating) return;
    // this.animate();
  }

  toggleAnimation() {
    this.animating = !this.animating;
    console.log(this.animating);
    this.startAnimate();
  }
  createStave(container) {
    const dom = document.createElement("div");
    dom.id = "raphael-container";
    dom.style.position = "absolute";
    dom.style.left = 0;
    dom.style.top = 0;
    dom.style.zIndex = "10";
    dom.style.width = this.osmd.container.clientWidth + "px";
    dom.style.height = 320;
    // dom.style.background = "rgba(81, 81, 91, 0.3)";
    // container.appendChild(dom)
    return dom;
  }
  show(){
    this.el.appendChild(this.container);
  }

  initStave(el) {
    this.container = this.createStave(el);
    var paper = Raphael(this.container);

    this.set = paper.set();
    var diamond = paper.path("M10,0L20,10L10,20L0,10L10,0");
    diamond.attr("stroke", "rgb(163,71,24)");
    diamond.attr("fill", "rgb(232,129,61)");
    diamond.attr("cursor", "pointer");
    this.set.push(diamond);
    this.diamond = diamond;

    var line = paper.path("M10,20L10,370");
    line.attr("stroke", "rgb(232,129,61)");
    line.attr("stroke-width", 2);
    this.set.push(line);
    this.line = line;

    var glow = this.set.glow({
      swidth: 8,
      fill: true,
      color: "rgb(232,129,61)"
    });
    glow.hide();
    this.set.push(glow);
    this.glow = glow;

    // 拖动事件.
    this.x = 10;
    this.y0 = 10;
    this.dx = 0;

    this.set.drag(this.onmove.bind(this), this.onstart.bind(this));

    // 悬浮事件
    diamond.hover(this.hoverin.bind(this), this.hoverout.bind(this));

    this.update();
  }

  onmove(dx, dy, x, y) {
    this.dx = dx;
    this.update();
  }
  onstart() {
    this.x += this.dx;
    this.dx = 0;
  }
  update() {
    var x = Math.min(Math.max(this.x + this.dx, this.xmin), this.xmax);
    this.set.transform("T" + x + "," + this.y0);
  }
  hoverin() {
    this.glow.show();
  }
  hoverout() {
    this.glow.hide();
  }

  animate() {
    this.dx += this.animateDx;
    if (this.x + this.dx > this.xmax || this.x + this.dx < this.xmin) {
      this.animateDx *= -1;
    }
    this.update();
  }
}
