let progress = 0;
F.component('progress', {
  data: {
    progress: progress
  },
  rendered: function(cb){
    var intervalID = setInterval(() => {
      if (progress === 100) {
        clearInterval(intervalID);
        return;
      }
      this.update({progress: ++progress});
    }, 40);
    cb();
  }
}, 'Base');
