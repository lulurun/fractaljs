const config = {
  Home: {
    pull_hook: 'PullHook',
    dialogs: 'Dialogs',
    buttons: 'Buttons',
    carousel: 'Carousel',
    infinite_scroll: 'Infinite Scroll',
    progress: 'Progress',
    transition: 'Transition',
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
    this.subscribe('app.nav', (topic, data) => {
      console.log(topic, data);
      let hash = '';
      let trans = 'default';
      if (typeof data === 'string') {
        hash = data;
      } else {
        hash = data.hash;
        trans = data.trans;
      }
      const parts = hash.split('/');
      if (parts.length >= 2) {
        let name = parts[1];
        console.log('pushPage', name);
        this.el.pushPage(name, {animation: trans}).then(el => {
          this.addChild(name, el);
        });
      }
    });
  }
}, 'Base');
