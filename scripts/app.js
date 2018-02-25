/** データvalidationが責務 */
// attrsにはvalidationの情報が入っている
function AppModel(attrs) {
  /** フォームが持っているvalue */
  this.value = '';

  /** バリデーションの機能 */
  this.attrs = {
    required: attrs.required || false,
    maxlength: attrs.maxlength || 8,
    minlength: attrs.minlength || 4
  };


}

AppModel.prototype.set = function(val) {
  /** 値をupdate */
  this.value = val;
  console.log(this);
}


/** viewの操作・viewからの値の取得が責務 */
function AppView(el) {
  this.$el = $(el);

  var self = this;
  var obj = this.$el.data();

  if (this.$el.prop('required')) {
    obj['required'] = true;
  }
  this.model = new AppModel(obj);

  /**
   * フォームの値が変わった時の動作
   * viewはviewの変更をmodelに伝える
   */
  this.$el.on('keyup', function(e) {
    var $target = $(e.currentTarget);
    self.model.set($target.val());
  });
}

/** この書き方、だいぶスッキリするなぁ */
/** しかも、フォーム系で結構使えるのではないか？ */
$("input").each(function() {
  /** dom要素を渡している */
  new AppView(this);
});
