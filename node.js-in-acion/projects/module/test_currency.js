// 在同一目录下创建test_currency.js
// ./表示模块与当前脚本位于同一目录
var Currency = require("./currency");
var currency = new Currency();

console.log(currency.canadian2US(50));
console.log(currency.US2Canadian(30));