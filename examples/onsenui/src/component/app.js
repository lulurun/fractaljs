const config = {
  Home: {
    pull_hook: 'PullHook',
    dialogs: 'Dialogs',
    buttons: 'Buttons',
    carousel: 'Carousel',
    infinite_scroll: 'Infinite Scroll',
    progress: 'Progress',
  }
}

const pages = ((config) => {
  const pages = [];
  for (let back in config) {
    for (let name in config[back]) {
      pages.push({
        name: name,
        toolbar: {
          back: back,
          title: config[back][name]
        }
      });
    }
  }
  return pages;
})(config);

F.component('app', {
  data: { pages: pages },
  init: function() {
    this.subscribe('app.nav', (topic, hash) => {
      const parts = hash.split('/');
      if (parts.length >= 2) {
        let name = parts[1];
        console.log('pushPage', name);
        this.el.pushPage(name).then(el => {
          this.addChild(name, el);
        });
      }
    });
  }
}, 'Base');