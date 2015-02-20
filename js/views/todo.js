var app = app || {};


//Todo Item View
//The DOM element for a todo item..
app.TodoView = Backbone.View.extend({
  //is a list tag
  tagName: 'li',
  //cache the template function for a single item
  template: _.template( $('#item-template').html() ),

  //The DOM events specific to an item
  events: {
    'dblclick label': 'edit',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  //todoview listens for changes to the model
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
  //re renders the title of the todo item
  render: function() {
    this.$el.html( this.template( this.model.attributes) );
    this.$input = this.$('.edit');
    return this;
  },

  //switch the view into edit mode, displaying the input field
  edit: function() {
    this.$el.addClass('editing');
    this.$input.focus();
  },

  //close the editing mode, saving changes to the todo
  close: function(){
    var value = this.$input.val().trim();

    if(value){
      this.model.save({ title: value});
    }
    this.$el.removeClass('editing');
  },

  //if you hit enter, we're through editing the item
  updateOnEnter: function (e){
    if (e.which === ENTER_KEY){
      this.close();
    }
  }
});