
// 创建模块 currency.js
var canadianDollar = 0.91;
function round2Decimals(amount) {
    return Math.round(amount * 100) /  100;
}

exports.canadian2US = function(canadian) {
    return round2Decimals( canadian * canadianDollar);
}
exports.US2Canadian = function(us) {
    return round2Decimals(us / canadianDollar);
}

// 以面向对象的方式重写
function Currency(){
    this.canadian2US = function(canadian) {
        return this.round2Decimals( canadian * this.canadianDollar);
    };
    this.US2Canadian = function(us){
        return this.round2Decimals( us * this.canadianDollar);
    }
}
Currency.prototype.canadianDollar = 0.91;
Currency.prototype.round2Decimals = function(amount) {
    return Math.round(amount * 100) / 100;
}
module.exports = Currency;





