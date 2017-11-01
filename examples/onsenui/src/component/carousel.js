const B = '&#9679;';
const W = '&#9675;';
const DOTS = [B, W, W, W];

F.component('carousel', {
  data: {
    dots: DOTS
  },
  swipe: function(num){
    this.carousel.setActiveIndex(num);
  },
  rendered: function(cb){
    const carousel = this.carousel = this.el.querySelector('#carousel');
    carousel.addEventListener('postchange', () => {
      var index = carousel.getActiveIndex();
      for (let i=0; i<DOTS.length; i++) {
          DOTS[i] = (i === index) ? B : W;
          this.update({dots: DOTS});
      }
    });
  }
}, 'Base');
