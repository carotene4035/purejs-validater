function AppModel(attrs) {
  /** フォームの値を持つ */
  this.val = "";
  this.attrs = {
    required: attrs.required || false,
    maxlength: attrs.maxlength || 8,
    minlength: attrs.minlength || 4
  };
  this.listeners = {
    valid: [],
    invalid: []
  };
}


/** setした時にvalidateする */
AppModel.prototype.set = function(val) {
  if (this.val === val) return;
  this.val = val;
  this.validate();
};

AppModel.prototype.validate = function() {
  var val;
  this.errors = [];

  console.log(this);
  for (var key in this.attrs) {
    val = this.attrs[key];
    console.log(this);
    if (val && !this[key](val)) this.errors.push(key);
  }

  /** errorの長さが1以上のときは、invalidを呼び出す */
  this.trigger(!this.errors.length ? "valid" : "invalid");
};

AppModel.prototype.on = function(event, func) {
  this.listeners[event].push(func);
};

AppModel.prototype.trigger = function(event) {
  $.each(this.listeners[event], function() {
    this();
  });
};

AppModel.prototype.required = function() {
  return this.val !== "";
};

AppModel.prototype.maxlength = function(num) {
  return num >= this.val.length;
};

AppModel.prototype.minlength = function(num) {
  return num <= this.val.length;
};

function AppView(el) {
  this.initialize(el);
  this.handleEvents();
}

AppView.prototype.initialize = function(el) {
  this.$el = $(el);
  this.$list = this.$el.next().children();

  var obj = this.$el.data();

  if (this.$el.prop("required")) {
    obj["required"] = true;
  }

  /** モデルにvalidationの情報を渡す */
  this.model = new AppModel(obj);
};

AppView.prototype.handleEvents = function() {
  var self = this;

  /** listenするイベントを登録する */
  this.$el.on("keyup", function(e) {
    self.onKeyup(e);
  });

  this.model.on("valid", function() {
    /** validが呼ばれた場合のviewの処理を登録 */
    self.onValid();
  });

  this.model.on("invalid", function() {
    /** invalidが呼ばれた場合のviewの処理を登録 */
    self.onInvalid();
  });

};

AppView.prototype.onKeyup = function(e) {
  /** modelにvalueを登録 */
  var $target = $(e.currentTarget);
  this.model.set($target.val());
};

/** validが呼ばれた時のview側の処理 */
AppView.prototype.onValid = function() {
  this.$el.removeClass("error");
  this.$list.hide();
};

/** invalidが呼ばれた時のview側の処理 */
AppView.prototype.onInvalid = function() {
  var self = this;
  this.$el.addClass("error");
  this.$list.hide();

  $.each(this.model.errors, function(index, val) {
    self.$list.filter("[data-error=\"" + val + "\"]").show();
  });
};


$("input").each(function() {
  /** dom要素を渡している */
  new AppView(this);
});
