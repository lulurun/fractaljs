import {Component, build, createComponent} from './component'
import Pubsub from './pubsub'

window.onpopstate = function () {
  Pubsub.publish("onpopstate", location.hash);
};

export default {
  build: build,
  component: createComponent,
  Component: Component,
}
