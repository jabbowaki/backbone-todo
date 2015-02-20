var app = app || {};

//our overall appview is the top-level piece of UI
app.AppView = Backbone.View.extend({
  //binds to existing app skeleton
  el: '#todoapp',
  //template for the stats at the bottom of the app
  statsTemplate: _.template( $('#stats-template').html() ),

  //delegated events for creating new items, clearing completed, and toggling all
  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all' : 'toggleAllComplete'
  },
  //when initialized, bind to relevant events on the Todos collection
  initialize: function() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);

    this.listenTo(app.Todos, 'change:completed', this.filterOne);
    this.listenTo(app.Todos, 'filter', this.filterAll);
    this.listenTo(app.Todos, 'all', this.render);

    app.Todos.fetch();
  },

  //re-rendering app means refreshing the stats
  render: function() {
    var completed = app.Todos.completed().length;
    var remaining = app.Todos.remaining().length;

    if ( app.Todos.length ){
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));
      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#' + (app.TodoFilter || "") + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }
    this.allCheckbox.checked = !remaining;
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
  },

  filterOne : function(todo){
    todo.trigger('visible');
  },

  filterAll : function() {
    app.Todos.each(this.filterOne, this);
  },

  newAttributes: function(){
    return {
      title: this.$input.val().trim(),
      order: app.Todos.nextOrder(),
      completed: false
    };
  },

  //if you hit return in the main field, it'll create new todo model in local storage
  createOnEnter: function(event) {
    if (event.which !== ENTER_KEY || !this.$input.val().trim() ){
      return;
    }
    app.Todos.create( this.newAttributes() );
    this.$input.val('');
  },

  clearCompleted: function() {
    _.invoke(app.Todos.completed(), 'destroy');
    return false;
  },

  toggleAllComplete: function() {
    var completed = this.allCheckbox.checked;

    app.Todos.each(function(todo) {
      todo.save({
        'completed' : completed
      });
    });
  }

});