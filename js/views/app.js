var app = app || {};

//our overall appview is the top-level piece of UI
app.AppView = Backbone.View.extend({
  //binds to existing app skeleton
  el: '#todoapp',
  //template for the stats at the bottom of the app
  statsTemplate: _.template( $('#stats-template').html() ),

  //when initialized, bind to relevant events on the Todos collection
  initialize: function() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);
  },

  //adds a single todo item by creating a view for it and appending element to the <ul>
  addOne: function(todo) {
    var view = new app.TodoView({ model: todo });
    $('#todo-list').append( view.render().el );
  },

  //add all items to todo
  addAll: function() {
    this.$('#todo-list').html('');
    app.Todos.each(this.addOne, this);
  }

});