const tabs = [
  { name: 'home', label: 'HOME', icon: 'ion-home' },
  { name: 'forms', label: 'FORMS', icon: 'ion-edit' },
  { name: 'animations', label: 'ANIMATIONS', icon: 'ion-film-marker' },
];

F.component('tabbar', {
  data: {
    title: 'HOME',
    tabs: tabs
  },
  showTab: function(hash){
    const parts = hash.split('/');
    if (parts.length >= 3) {
      let index = tabs.findIndex(x => x.name === parts[2]);
      if (index >= 0 && index !== this.currentIndex) {
        this.$tabbar.setActiveTab(index);
        this.currentIndex = index;
      }
    }
  },
  init: function(){
    this.subscribe('onpopstate', (topic, hash) => {
      this.showTab(hash);
    });
  },
  loaded: function(cb, param) {
    this.showTab(location.hash);
  },
  rendered: function(cb, param) {
    this.$tabbar = this.el.querySelector('#appTabbar');
    this.$tabbar.addEventListener('init', event => {
      this.$tabbar.addEventListener('prechange', event => {
        this.update({title: event.tabItem.getAttribute('label')});
      });
      this.$tabbar.addEventListener('postchange', event => {
        if (event.index !== this.currentIndex) {
          history.pushState(null, null, '#/tabbar/' + tabs[event.index].name);
          this.currentIndex = event.index;
        }
      });
      this.el.querySelector('#appTabbarBtn').onclick = () => {
        this.publish("appSplitter.toggle");
      }
      cb();
    });
  }
}, 'base');
