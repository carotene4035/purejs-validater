/** データvalidationが責務 */
// attrsにはvalidationの情報が入っている
// modelはviewのことを知らなくて良い？！
function AppModel(attrs) {
  /** フォームが持っているvalue */
  this.val = '';

  /** バリデーションの内容 */
  this.attrs = {
    required: attrs.required || false,
    maxlength: attrs.maxlength || 8,
    minlength: attrs.minlength || 4
  };

  // こう書かないと、viewのオブジェクトを持っていないといけないことになる？！
  this.listeners = {
    valid: [],
    invalid: []
  }

  /** エラーが起こったプロパティ */
  this.errors = [];
}


/** 値のupdateとvalidationの実行 */
AppModel.prototype.set = function(val) {
  if (this.val === val) return;
  /** 値をupdate */
  this.val = val;
  this.validate();
}

/** validation実行 */
AppModel.prototype.validate = function() {
  for (var key in this.attrs) {
    var val = this.attrs[key];

    /** this[key](val) で以下のvalidation関数を実行している */
    if (val && !this[key](val)) {
      this.errors.push(key);
    }
  }
  /** １つもエラーがない: validイベント通知 */
  /** １つ異常エラーがある: invalidイベント通知 */
  this.trigger(!this.errors.length ? "valid" : "invalid");
}



/** イベントを登録 */
AppModel.prototype.on = function(event, func) {
  this.listeners[event].push(func);
}

/** イベントを実行 */
AppModel.prototype.trigger = function(event) {
  $.each(this.listeners[event], function() {
    this();
  });
}

/*
 * 各種validation関数
 */
AppModel.prototype.maxlength = function(num) {
  return num >= this.val.length;
};

AppModel.prototype.minlength = function(num) {
  console.log(num <= this.val.length);
  return num <= this.val.length;
};

AppModel.prototype.required = function() {
  return this.val !== '';
};



/** viewの操作・viewからの値の取得が責務 */
function AppView(el) {
  /** viewの操作に必要なdomを取得 */
  this.$el = $(el);
  this.$list = this.$el.next().children();

  var self = this;
  var obj = this.$el.data();

  if (this.$el.prop('required')) {
    obj['required'] = true;
  }
  this.model = new AppModel(obj);

  /** modelに動かさせたいeventを登録 */
  this.model.on('valid', function() {
    self.$el.removeClass("error");
    /** 隠す */
    self.$list.hide();
  });

  /** modelに動かさせたいeventを登録 */
  this.model.on('invalid', function() {
    self.$el.addClass("error");
    self.$list.hide();

    $.each(self.model.errors, function(index, val) {
      /** errorが起こったやつだけ見せる */
      self.$list.filter("[data-error=\"" + val + "\"]").show();
    });
  });

  /**
   * フォームの値が変わった時の動作
   * viewはviewの変更をmodelに伝える
   */
  this.$el.on('keyup', function(e) {
    var $target = $(e.currentTarget);
    self.model.set($target.val());
  });

}



$("input").each(function() {
  /** dom要素を渡している */
  new AppView(this);
});
