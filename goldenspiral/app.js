import * as PIXI from 'pixi.js';

import city from './images/city.png';
import river from './images/river.png';
import clouds from './images/clouds.png';

// 黄金比
// 1/phi = phi/(phi+1)
// → phi^2 = phi+1
// → phi^2 - phi-1 = 0
// ↓
// (1 + sqrt(5))/2

// 黄金比(1.618033988749895) = 0.5 + Math.sqrt(5)/2;

class Sketch {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.app = new PIXI.Application({
        backgroundColor: 0xffffff,
        resolution: window.devicePixelRatio || 1,
        resizeTo: window,
        autoResize: true,
    });
    this.app.stage.interactive = true;
    document.body.appendChild(this.app.view);
    
    this.container = new PIXI.Container();
    this.containerSpiral = new PIXI.Container();
    
    this.phi = 0.5 + Math.sqrt(5)/2; //　黄金比を作成
    this.center = 0.7237; // 黄金比の真ん中（本当は計算で出したいけど変わらないのでこれで）

    this.app.stage.addChild(this.container);
    this.app.stage.addChild(this.containerSpiral);
    this.time = 0;

    this.addStuff();
    this.addLines();
    this.render();

    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener('wheel', this.scroll.bind(this));
  }

  /**
   * 黄金比の線を引く
   * 本当はひとつひとつの正方形の連鎖なので、再起的にループでかけそうだけど
   * とても複雑なので実際に毎回計算している（やり方考えたけど思い浮かばなかったらしい）
   * 
   * ここちゃんとわかってない
   */
  addLines() {
    this.ctx = new PIXI.Graphics;
    this.ctx.lineStyle(2, 0xff0000, 0.1);

    let lastRight = this.width;
    let lastBottom = lastRight / this.phi;
    let tempHorizontal,tempVertical;

    this.ctx.moveTo(0, lastBottom),
    this.ctx.lineTo(lastRight, lastBottom),
    this.ctx.moveTo(lastRight, lastBottom),
    this.ctx.arc(lastRight, lastBottom, lastRight, .5 * Math.PI, Math.PI);

    let lastLeft = lastRight / this.phi;
    this.ctx.moveTo(lastLeft, 0),
    this.ctx.lineTo(lastLeft, lastBottom),
    this.ctx.moveTo(lastLeft, lastBottom),
    this.ctx.arc(lastLeft, lastBottom, lastLeft, Math.PI, 1.5 * Math.PI);
    let lastTop = lastBottom / this.phi;

    this.ctx.moveTo(lastLeft, lastTop),
    this.ctx.lineTo(lastRight, lastTop),
    this.ctx.moveTo(lastLeft, lastTop),
    this.ctx.arc(lastLeft, lastTop, lastTop, 1.5 * Math.PI, 0);

    lastRight = lastRight - (lastRight - lastLeft) / this.phi;
    this.ctx.moveTo(lastRight, lastTop),
    this.ctx.lineTo(lastRight, lastBottom),
    this.ctx.moveTo(lastRight, lastTop),
    this.ctx.arc(lastRight, lastTop, lastBottom - lastTop, 0, .5 * Math.PI);

    tempVertical = lastBottom - (lastBottom - lastTop) / this.phi;
    this.ctx.moveTo(lastLeft, tempVertical),
    this.ctx.lineTo(lastRight, tempVertical),
    this.ctx.moveTo(lastRight, tempVertical),
    this.ctx.arc(lastRight, tempVertical, lastBottom - tempVertical, .5 * Math.PI, Math.PI);
    lastBottom = tempVertical;

    tempHorizontal = lastLeft + (lastRight - lastLeft) / this.phi;
    this.ctx.moveTo(tempHorizontal, lastTop),
    this.ctx.lineTo(tempHorizontal, lastBottom),
    this.ctx.moveTo(tempHorizontal, lastBottom),
    this.ctx.arc(tempHorizontal, lastBottom, tempHorizontal - lastLeft, Math.PI, 1.5 * Math.PI);
    lastLeft = tempHorizontal;

    tempVertical = lastTop + (lastBottom - lastTop) / this.phi;
    this.ctx.moveTo(lastLeft, tempVertical),
    this.ctx.lineTo(lastRight, tempVertical),
    this.ctx.moveTo(lastLeft, tempVertical),
    this.ctx.arc(lastLeft, tempVertical, lastRight - lastLeft, 1.5 * Math.PI, 0);
    lastTop = tempVertical;

    tempHorizontal = lastRight - (lastRight - lastLeft) / this.phi;
    this.ctx.moveTo(tempHorizontal, lastTop),
    this.ctx.lineTo(tempHorizontal, lastBottom),
    this.ctx.moveTo(tempHorizontal, lastTop),
    this.ctx.arc(tempHorizontal, lastTop, lastRight - tempHorizontal, 0, .5 * Math.PI);
    lastRight = tempHorizontal;

    tempVertical = lastBottom - (lastBottom - lastTop) / this.phi;
    this.ctx.moveTo(lastLeft, tempVertical),
    this.ctx.lineTo(lastRight, tempVertical),
    this.ctx.moveTo(lastRight, tempVertical),
    this.ctx.arc(lastRight, tempVertical, lastRight - lastLeft, .5 * Math.PI, Math.PI);
    lastBottom = tempVertical;

    tempHorizontal = lastLeft + (lastRight - lastLeft) / this.phi;
    this.ctx.moveTo(tempHorizontal, lastTop),
    this.ctx.lineTo(tempHorizontal, lastBottom),
    this.ctx.moveTo(tempHorizontal, lastBottom),
    this.ctx.arc(tempHorizontal, lastBottom, tempHorizontal - lastLeft, Math.PI, 1.5 * Math.PI);
    lastLeft = tempHorizontal;

    tempVertical = lastTop + (lastBottom - lastTop) / this.phi;
    this.ctx.moveTo(lastRight, tempVertical),
    this.ctx.lineTo(lastLeft, tempVertical),
    this.ctx.moveTo(lastLeft, tempVertical),
    this.ctx.arc(lastLeft, tempVertical, lastRight - lastLeft, 1.5 * Math.PI, 0),

    this.containerSpiral.addChild(this.ctx);
  }

  getRiver() {
    let block = new PIXI.Sprite.from(river);
    // block.tint = 0xff0000;
    // block.width = 500;
    // block.height = 500;
    return block;
  }

  getCity() {
    let block = new PIXI.Sprite.from(city);
    return block;
  }

  getClouds() {
    let block = new PIXI.Sprite.from(clouds);
    block.alpha = 0.5;
    return block;
  }

  /**
   * 画像を配置
   */
  addStuff() {
    this.centerX = this.width*this.center;
    this.centerY = this.width*this.center/this.phi;

    // 回転の基準となる位置を調整
    this.container.pivot.set(this.centerX, this.centerY);
    this.container.position.set(this.centerX, this.centerY);

    // 真ん中に確認用のブロックをおく
    // let block = new PIXI.Sprite(PIXI.Texture.WHITE);
    // block.tint = 0x00ff00;
    // block.width = 10;
    // block.height = 10;
    // block.position.set(this.centerX, this.centerY);
    // this.container.addChild(block);

    // 黄金比の正方形に一致するブロックを生成して配置（数学すげー...）
    // ブロックにピッタリ収まるように画像を設置している(getRiver)
    // マイナスから始めているのは、ゼロが左上基準の四角なので、それよりも大きいところのものを想定している
    for (let i = -20; i < 20; i++) {
      let containerRiver = new PIXI.Container();
      let containerCity = new PIXI.Container();
      let containerClouds = new PIXI.Container();
      let angle = i*Math.PI/2; // ここちゃんとわかってない
      let scale = Math.pow(1/this.phi, i); // ここちゃんとわかってない

      let bl = this.getRiver();
      bl.width = this.width/this.phi;
      bl.height = this.width/this.phi;

      let cityBl = this.getCity();
      cityBl.width = this.width/this.phi;
      cityBl.height = this.width/this.phi;

      let clouds = this.getClouds();
      clouds.width = this.width/this.phi;
      clouds.height = this.width/this.phi;

      bl.position.set(-this.centerX, -this.centerY);
      cityBl.position.set(-this.centerX, -this.centerY);
      clouds.position.set(-this.centerX, -this.centerY);

      containerRiver.position.set(this.centerX, this.centerY);
      containerRiver.rotation = angle;
      containerRiver.scale.set(scale*0.76);

      containerCity.position.set(this.centerX, this.centerY);
      containerCity.rotation = angle;
      containerCity.scale.set(scale);

      containerClouds.position.set(this.centerX, this.centerY);
      containerClouds.rotation = angle;
      containerClouds.scale.set(scale);

      containerRiver.addChild(bl);
      containerCity.addChild(cityBl);
      containerClouds.addChild(clouds);
      this.container.addChild(containerRiver);
      this.container.addChild(containerCity);
      this.container.addChild(containerClouds);
    }
  }

  render() {
    this.app.ticker.add((delta) => {
      // this.time += 0.01;
      this.container.rotation = this.time;

      //回転に合わせてスケールも変える（ここも凄すぎ...）
      this.container.scale.set(Math.pow(1/this.phi, this.time/(Math.PI/2)));  // ここちゃんとわかってない 

      // 無限ループにするために位置を戻す（違和感がないところに大体でもどししているので数字は感覚）
      if (this.time > 20) {
        this.time = -12;
      }
      if (this.time < -20) {
        this.time = 12;
      }
    });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    // 削除して再描画
    this.container.removeChildren(0, this.container.children.length);
    this.containerSpiral.removeChildren(0, this.containerSpiral.children.length);
    this.addStuff();
    this.addLines();
  }

  scroll(event) {
    this.time += event.deltaY * 0.005;
  }
}

new Sketch();