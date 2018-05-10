function ensureEqual(val1, val2, message) {
    var flag;
    if(val1 instanceof Array){
        flag = isArrayEqual(val1, val2);
    }else if( val1 instanceof Object){
        flag = isObjectEqual(val1, val2);
    }
    else{
        flag = val1 === val2;
    }
    var info = flag ? `${message}: success，${val1} 等于 ${val2} `:`${message} : failure，${val1} 不等于 ${val2} `;
    console.warn(info);
}

function isArrayEqual(arr1, arr2) {
    if(arr1.length !== arr2.length){
        return false;
    }

    var bool = arr1.every(function(ele, index){
            if(Array.isArray(ele)){
                return isArrayEqual(ele, arr2[index])
            }else{
                return ele === arr2[index];
            }
        });
    return bool;
}

function isObjectEqual(obj1, obj2){
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);

    //键值对个数相等
    if( keys1.length !== keys2.length){
        return false;
    }

    //对应键的值相等
    var bool = keys1.every(function(key){
        return obj1[key] == obj2[key]; //基本类型值 不严格相等
    })
    return bool;
}

// 作业3
// 数值到二进制字符串
function binary(int) {
    var str = int.toString(2);
    while(str.length < 8){
        str = "0" + str;
    }
    return str;
}

function testBinary(){
    ensureEqual(binary(7), "00000111", "binary 测试1");
}
testBinary();

// 作业4
// 二进制数字字符串到数值
function int(bin) {
    return parseInt(bin, 2);
}

function testInt(){
    ensureEqual(int("00000111"), 7, "int 测试1");
}
testInt();

// 作业5
// 字符串的二进制表示
 function binaryStream(str) {
    var binStr = "";
    for( var i = 0; i < str.length; i++) {
        binStr += binary(str.charCodeAt(i));
        console.log(binary(str.charCodeAt(i)));
    }
    return binStr;
 }

 function testBinaryStream() {
    ensureEqual(binaryStream("Man"), "010011010110000101101110", "binaryStream 测试1");
 }
 testBinaryStream();

// 作业6
function stringFromBinary(bins) {
    var str = "";
    for(var i = 0;i < bins.length; i = i + 8){
        str += String.fromCharCode(int(bins.slice(i, i + 8 )));
        console.log(int(str.slice(i, i +8 )));
    }
    return str;
}

function testStringFromBinary() {
    ensureEqual(stringFromBinary('010011010110000101101110'), "Man", "stringFromBinary 测试1");
}
testStringFromBinary();

// 作业7
var base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function base64Encode(str) {
    var arr = [];
    var bins = binaryStream(str);

    var flag = 0;
    while(bins.length < 24 || bins.length % 6 !== 0) {
        bins += "0";
        flag ++;
    }
    flag = Math.floor(flag / 6);


    for(var i = 0; i < bins.length; i +=6) {
        if( i < bins.length - flag * 6){
            var num = int(bins.slice(i, i + 6));
            arr.push(num);
        }else{
            arr.push("=");
        }
    }
    // console.log(arr)
    var newArr = arr.map(function(ele) {
        if(ele === "="){
            return ele;
        }else{
            return base64[ele];
        }
    })

    return newArr.join("");
}

function testBase64Encode(){
    ensureEqual(base64Encode("Man"), "TWFu", "base64Encode 测试1");
    ensureEqual(base64Encode("M"), "TQ==", "base64Encode 测试2");
    ensureEqual(base64Encode("0"), "MA==", "测试3")
}

testBase64Encode();

// 作业8
function base64Decode(str) {
    var arr = [];
    for(var i = 0; i < str.length; i++) {
        arr.push(base64.indexOf(str[i]));
    }
    // 数值转换为二进制
    var newArr = arr.map(function(ele) {
        var newEle = ele.toString(2);
        while(newEle.length < 6){
            newEle = "0" + newEle;
        }
        return newEle;
    });
    var bins = newArr.join("");
    var str = stringFromBinary(bins);
    return str;
}
base64Decode("")

function testBase64Decode() {
    ensureEqual(base64Decode("TWFu"), "Man", "base64Encode 测试1");
}
testBase64Decode();
