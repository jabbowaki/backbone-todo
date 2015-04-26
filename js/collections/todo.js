var app = app || {};

//Todo collection


//todo collection is backed by localStorage instead of remote
var TodoList = Backbone.Collection.extend({
  //references this collection model
  model: app.Todo,
  //save all of the todo items under 'todos-backbone' namespace
  localStorage: new Backbone.LocalStorage('todos-backbone'),

  //filter down the list of all todo items that are finished
  completed: function() {
    return this.filter(function(todo) {
      return todo.get('completed');
    });
  },

  //filters unfinished
  remaining: function() {
    return this.without.apply( this, this.completed() );
  },

  //todos are unordered in db, but this generates sequential order
  nextOrder: function() {
    if (!this.length) {
      return 1;
    }
    return this.last().get('order') + 1;
  },

  //todos are sorted by insertion order
  comparator: function(todo) {
    return todo.get('order');
  }
});

//create our global collection of todos
app.Todos = new TodoList();