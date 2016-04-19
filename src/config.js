import Pubsub from './pubsub'

export default {
  $: null,
  compile: null,
  render: function(template, data) {},
  Pubsub: Pubsub,
  require: {
    component: function(){
      throw new Error('to be defined: require.component');
    },
    template: function(){
      throw new Error('to be defined: require.template');
    },
  },
}
