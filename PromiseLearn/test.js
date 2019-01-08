const async = require('async');

/**
 * 新建promise串联异步函数
 * @param {Object} params 传递的参数对象
 * @returns {Promise}
 */
function myPromise(params) {
    return new Promise(function (resolve) {
        return resolve(params);
    });
}

function test() {
    let list = [1, 2, 3, 4, 5];

    return new Promise(function (resolve, reject) {
        async.mapSeries(list, function (item, callback) {
            console.log('normal')
            callback(null, 'success')
        }, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve('string')
            }
        })
    })
}

function test2() {
    let list = [1, 2, 3, 4, 5];
    console.log('33333')

    return new Promise(function (resolve, reject) {
        async.mapSeries(list, function (item, callback) {
            if (item === 2) {
                callback(new Error('lalal'));
            } else {
                callback(null, 'success');
            }
        }, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve('string')
            }
        })
    })
}

myPromise().then(test).then(test2).then(function (data) { // test报错reject后，后面的都不会执行，直接到catch
    console.log('1111');
    console.log(data);
}).catch(function (err) {
    console.log('2222');
    console.log(err);
})
// test().then(function (data) {
//     console.log('1111');
//     console.log(data);
// }).catch(function (err) {
//     console.log('2222');
//     console.log(err);
// })