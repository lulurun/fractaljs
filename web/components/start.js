F('start', function(env, cb){
  env.getComponentClass('MarkDownDoc', function(md){
    cb(md.extend({}));
  });
});
