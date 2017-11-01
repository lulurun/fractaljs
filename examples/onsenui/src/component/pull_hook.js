var getRandomName = function () {
  const names = ['Oscar', 'Max', 'Tiger', 'Sam', 'Misty', 'Simba', 'Coco', 'Chloe', 'Lucy', 'Missy'];
  return names[Math.floor(Math.random() * names.length)];
};
var getRandomUrl = function () {
  const width = 40 + Math.floor(20 * Math.random());
  const height = 40 + Math.floor(20 * Math.random());
  return `https://placekitten.com/g/${width}/${height}`;
};
var getRandomKitten = function () {
  return {
    name: getRandomName(),
    url: getRandomUrl()
  };
};
var getRandomData = function () {
  const data = [];
  for (let i = 0; i < 8; i++) {
    data.push(getRandomKitten());
  }
  return data;
};

const pullHookIconStates = {
  initial: {
    icon: 'fa-arrow-down',
    spin: false,
  },
  preaction: {
    icon: 'fa-arrow-up',
    spin: false,
  },
  action: {
    icon: 'fa-spinner',
    spin: true,
  },
}

F.component('pull_hook', {
  data: {
    state: pullHookIconStates.initial,
    items: getRandomData(),
  },
  getNewData: function(cb, param){
    setTimeout(() => {
      this.update({
        items: getRandomData()
      });
      cb();
    }, 400);
  },
  rendered: function(cb, param) {
    const pullHook = this.el.querySelector('ons-pull-hook');
    pullHook.onAction = cb => {
      this.getNewData(cb);
    };

    pullHook.addEventListener('changestate', ev => {
      this.update({state: pullHookIconStates[ev.state]});
    });
  },
}, 'Base');
