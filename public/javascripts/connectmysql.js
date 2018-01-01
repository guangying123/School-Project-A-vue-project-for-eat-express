/**
 * Created by Administrator on 2017/12/31.
 */

var mysql = require('mysql');

function  my_con_mysql(sql,par) {
    return new Promise(function (resolve,reject) {
        if(!sql) {
            throw new Error('sql是个必要参数');
        }
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'eater',
            password: '123456',
            port: 3306
        });
        connection.connect();
        console.log('!!!!');
        console.log(par);
        if(!par) {
            connection.query(sql,(err,rows,fields) => {
                if(err) {
                    reject(err);
                    throw new Error('操作失败');
                }else {
                    resolve(rows);
                }
            })
        }else{
            connection.query(sql,par,(err,rows,fields) => {
                if(err) {
                    reject(err);
                    throw new Error('操作失败');
                }else {
                    resolve(rows);
                }
            })
        }
        connection.end();
    })
}

function  my_con_mysql_withcallback(sql,callback) {
    if(!sql || !callback) {
        throw new Error('sql和回调函数是两个必要参数');
    }
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'eater',
        password: '123456',
        port: 3306
    });
    connection.connect();
    connection.query(sql,(err,rows,fields) => {
        callback&callback(err,rows,fields);
    })
    connection.end();
}
function  my_con_mysql_withpara(sql,para,callback) {
    if(!sql || !callback) {
        throw new Error('sql、para和回调函数是三个必要参数');
    }
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'eater',
        password: '123456',
        port: 3306
    });
    connection.connect();
    connection.query(sql,para,(err,rows,fields) => {
        callback&callback(err,rows,fields);
    })
    connection.end();
}

module.exports = {
    my_con_mysql,
    my_con_mysql_withcallback,
    my_con_mysql_withpara
};