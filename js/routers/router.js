var Workspace = Backbone.Router.extend({
  routes: {
    //haha uses SPLAT, creates a default route after #/
    '*filter': 'setFilter'
  }

  ,setFilter: function(param){
    if (param){
      param = param.trim();
    }
    app.TodoFilter = param || '';
    app.Todos.trigger('filter');
  }
});

app.TodoRouter = new Workspace();
// routes the initial URL durring page load
Backbone.history.start();