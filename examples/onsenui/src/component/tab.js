const tabs = [
  { name: 'home', label: 'Home', icon: 'ion-home' },
  { name: 'forms', label: 'Forms', icon: 'ion-edit' },
  { name: 'animations', label: 'Animations', icon: 'ion-film-marker' },
];

F.component('tab', {
  data: {
    title: 'Home',
    tabs: tabs
  },
  showTab: function(hash){
    const parts = hash.split('/');
    if (parts.length >= 3) {
      let index = tabs.findIndex(x => x.name === parts[2]);
      if (index >= 0 && index !== this.currentIndex) {
        this.$tab.setActiveTab(index);
        this.currentIndex = index;
      }
    }
  },
  init: function(){
    this.subscribe('tab.nav', (topic, hash) => {
      this.showTab(hash);
    });
    this.currentIndex = 0;
  },
  rendered: function(cb, param) {
    this.$tab = this.el.querySelector('ons-tabbar');
    (() => {
      let count = 0;
      this.$tab.addEventListener('init', ev => {
        if (++count === tabs.length) {
          cb();
        }
      });
    })();
    this.$tab.addEventListener('prechange', ev => {
      this.update({title: ev.tabItem.getAttribute('label')});
    });
    this.el.querySelector('#menuBtn').onclick = () => {
      this.publish("main.splitter.toggle");
    }
  }
}, 'Base');
