
const setWidth = Symbol('setWidth'); // 使用sumbol创建私有方法
export default class Stave {
  constructor(el) {
    this.instance = null;
    this.container = this.createContainer(el);
  }
  // 构造一个广为人知的接口，供用户对该类进行实例化
  static getInstance(el) {

    if (!this.instance) {
      this.instance = new Stave(el);
    }
    return this.instance;
  }

  setWidth(width) {
    this.container.style.width = width + "px";
  }
  setHeight(height) {
    this.container.style.height = height + "px";
  }
  show() {
    this.container.style.diaplay = "block";
  }
  hide() {
    this.container.style.diaplay = "none";
  }

  // 创建舞台
  createContainer(container) {
    const dom = document.createElement("div");
    dom.id = "raphael-container";
    dom.style.position = "absolute";
    dom.style.left = 0;
    dom.style.top = 0;
    dom.style.zIndex = "10";
    dom.style.display = "";
    // dom.style.width =
    //   this.currentMeasure.end_x - this.currentMeasure.start_x - +"px";
    // dom.style.width = this.osmd.container.clientWidth + "px";
    dom.style.width = container.clientWidth + "px";
    dom.style.height = container.clientHeight + "px";
    // dom.style.height = 320 + "px";
    dom.style.background = "rgba(81, 81, 91, 0.3)";
    return dom;
  }
}
