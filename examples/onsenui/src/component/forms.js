F.component('forms', {
  data: {
    text_input_value: '',
    switches_value: true,
    select_value: 'FractalJS',
    radio_value: 'Oranges',
    checkbox_value: ['GREEN', 'BLUE'],
    volume_value: 25,
    volume_loud: false,
  },
  rendered: function(cb) {
    this.ractive.observe('volume_value', (newVal, oldVal) => {
      console.log(newVal, oldVal);
      this.ractive.set('volume_loud', newVal > 80);
    });
    cb();
  }
}, 'Base');
