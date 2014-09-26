F('doc', function(env, cb){
  env.getComponentClass('MarkDownDoc', function(md){
    cb(md.extend({}));
  });
});

