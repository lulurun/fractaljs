let topics = {}, seq = 0;

export default {
  publish: function(topic, data, publisher) {
    var subscribers = topics[topic];
    for (var i in subscribers) subscribers[i].cb(topic, data, publisher);
  },
  subscribe: function(topic, cb, subscriber) {
    console.debug("subscribe", topic);
    if (!topics[topic]) topics[topic] = [];
    var token = ++seq;
    topics[topic].push({
      token: token,
      subscriber: subscriber,
      cb: cb
    });
    return token;
  },
  unsubscribe: function(topic, token) {
    console.debug("unsubscribe", topic);
    if (!(topic in topics)) return;
    var subscribers = topics[topic];
    for (var i in subscribers) {
      if (subscribers[i].token === token) {
        subscribers.splice(i, 1);
        break;
      }
    }
    if (subscribers.length === 0) delete topics[topic];
  },
  getSubscribers: function(topic) {
    if (!(topic in topics)) return [];
    return topics[topic].map(function(v){ return v.subscriber; });
  },
};

