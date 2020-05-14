export default class RaphaelGraphical {
  constructor(paper) {
    this.paper = paper;
    this.beginDiamond = null;
    this.endDiamond = null;
  }

  static drawBeginDiamond(paper, measureX = 50, measureY = 100) {
    // 上三角形，原数值
    // var diamondBegin = paper.path("M10,0L20,10L10,20L0,10L10,0");

    var beginDiamond = paper.path(
      `M${measureX - 20},${measureY - 10}L${measureX},${measureY -
        10}L${measureX - 10},${measureY + 10}L${measureX - 20},${measureY - 10}`
    );
    beginDiamond.attr("stroke", "rgb(163,71,24)");
    beginDiamond.attr("fill", "rgb(232,129,61)");
    beginDiamond.attr("cursor", "pointer");
    this.beginDiamond = beginDiamond;
    return beginDiamond;
  }

  static drawEndDiamond(paper, measureX = 50, measureY = 235) {
    // 下三角形，原数值
    // var diamondEnd = paper.path("M30,265L50,265L40,235L30,265");
    var endDiamond = paper.path(
      `M${measureX - 20},${measureY + 30}L${measureX},${measureY +
        30}L${measureX - 10},${measureY}L${measureX - 20},${measureY + 30}`
    );
    endDiamond.attr("stroke", "rgb(163,71,24)");
    endDiamond.attr("fill", "rgba(232,129,61,0.7)");
    endDiamond.attr("cursor", "pointer");
    this.endDiamond = endDiamond;
    return endDiamond;
  }

  static drawMiddleLine(paper, measureX = 50, measureY = 100) {
    // 中间线条，原数值
    var line = paper.path("M40,110L40,245");
    // var line = paper.path(
    //   `M${measureX - 10},${measureY + 10}L${measureX-10},${measureY + 10}`
    // );
    line.attr("stroke", "rgb(232,129,61)");
    line.attr("stroke-width", 2);
    this.middleLine = line;
    return line;
  }

  static drawLineStart(paper, measureX = 50, measureY = 100) {
    // 线条，原数值
    var line = paper.path(`M${measureX},${measureY -50}L${measureX},${measureY + 180}`);
    // var line = paper.path("M40,50L40,280");
    line.attr("stroke", "rgba(118,196,181,0.6)");
    line.attr("stroke-width", 12);
    return line;
  }
  static drawLineEnd(paper, measureX = 50, measureY = 100) {
    // 线条，原数值
    var line = paper.path(`M${measureX},${measureY -50}L${measureX},${measureY + 180}`);
    // var line = paper.path("M40,50L40,280");
    line.attr("stroke", "rgba(241,131,127,0.6)");
    line.attr("stroke-width", 12);
    return line;
  }

  static drawRect(paper) {
    var line = paper.path("M40,50L40,60");
    line.attr("stroke", "rgba(241,131,127,0.6)");
    line.attr("stroke-width", 12);
    return line;
  }

}
