/** データvalidationが責務 */
// attrsにはvalidationの情報が入っている
function AppModel(attrs) {
  /** フォームが持っているvalue */
  this.value = '';
}

AppModel.prototype.set = function(val) {
  /** 値をupdate */
  this.value = val;
  console.log(this);
}



/** viewの操作・viewからの値の取得が責務 */
function AppView(el) {
  this.$el = $(el);
  console.log(this.$el);

  this.model = new AppModel();

  var self = this;

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

// htmlの記述を変えれば、いろんなvalidationができるのではないか
