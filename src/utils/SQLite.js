//SQLite.js
import React, { Component } from 'react';
import {
    ToastAndroid,
} from 'react-native';

import ToastUtil from "./ToastUtil";
import SQLiteStorage from 'react-native-sqlite-storage';

SQLiteStorage.DEBUG(true);
var database_name = "shanc.db";//数据库文件
var database_version = "1.0";//版本号
var database_displayname = "shanc";
var database_size = -1;//-1应该是表示无限制
var db;

export default class SQLite extends Component {

    componentWillUnmount() {
        if (db) {
            this._successCB('close');
            db.close();
        } else {
            console.log("SQLiteStorage not open");
        }
    }
    open() {
        db = SQLiteStorage.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
            () => {
                this._successCB('open');
            },
            (err) => {
                this._errorCB('open', err);
            });
        return db;
    }
    createTable() {
        if (!db) {
            this.open();
        }
        //创建用户表
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS USER(' +
                'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +
                'name TEXT,' +
                'age TEXT,' +
                'sex TEXT,' +
                'phone TEXT,' +
                'email TEXT,' +
                'address TEXT)'
                , [], () => {
                    this._successCB('executeSql');
                }, (err) => {
                    this._errorCB('executeSql', err);
                });
        }, (err) => {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })
    }


    createNewlistTableBefore() {

        if (!db) {
            this.open();
        }

        db.transaction((tx) => {
            tx.executeSql("SELECT count(*) tatal FROM sqlite_master WHERE type='table' AND name='PUBP'", [], (tx, results) => {
                var len = results.rows.length;
                var flag = false;
                if (len > 0) {
                    var tatal = results.rows.item(0).tatal;
                    if (tatal > 0) {
                        flag = true;
                    }
                }
                if (!flag) {
                    // 如果不存在创建表
                    this.createNewlistTable();
                }
            });
        }, (err) => {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
            this._errorCB('createNewlistTableBefore', err);
        }, () => {
            this._successCB('createNewlistTableBefore');
        })
    }



    //创建列表的表
    createNewlistTable() {
        if (!db) {
            this.open();
        }

        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS PUBP(' +
                // 'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +
                'id TEXT,' +
                'fbr TEXT,' +
                'fbsj TEXT,' +
                'headpic TEXT,' +
                'hwbl TEXT,' +
                'jianjie TEXT,' +
                'ljdz TEXT,' +
                'remark2 TEXT,' +
                'remark3 TEXT,' +
                'remark4 TEXT,' +
                'remark5 TEXT,' +
                'remark6 TEXT,' +
                'uuid TEXT,' +
                'title TEXT)'
                , [], () => {
                    this._successCB('createNewlistTable');
                }, (err) => {
                    this._errorCB('createNewlistTable', err);
                });
        }, (err) => {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })
    }


    desctabel(tablename) {

        if (!db) {
            this.open();
        }

        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM sqlite_master WHERE type='table' AND name='"+tablename+"'", [], (tx, results) => {
                var len = results.rows.length;
                if (len > 0) {
                    var table = results.rows.item(0);
                }
            });
        }, (err) => {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
            this._errorCB('createNewobjTableBefore', err);
        }, () => {
            this._successCB('createNewobjTableBefore');
        })
    }



    createNewobjTableBefore() {

        if (!db) {
            this.open();
        }

        db.transaction((tx) => {
            tx.executeSql("SELECT count(*) tatal FROM sqlite_master WHERE type='table' AND name='PUBS'", [], (tx, results) => {
                var len = results.rows.length;
                var flag = false;
                if (len > 0) {
                    var tatal = results.rows.item(0).tatal;
                    if (tatal > 0) {
                        flag = true;
                    }
                }
                if (!flag) {
                    // 如果不存在创建表
                    this.createNewobjTable();
                }
            });
        }, (err) => {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
            this._errorCB('createNewobjTableBefore', err);
        }, () => {
            this._successCB('createNewobjTableBefore');
        })
    }

    //创建详情的表
    createNewobjTable() {
        if (!db) {
            this.open();
        }

        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS PUBS(' +
                // 'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +
                'id TEXT,' +
                'fileextend TEXT,' +
                'heigth TEXT,' +
                'hwbl TEXT,' +
                'pxh TEXT,' +
                'spxh TEXT,' +
                'treenodeid TEXT,' +
                'treenodename TEXT,' +
                'type TEXT,' +
                'uuid TEXT,' +
                'width TEXT,' +
                'xpxh TEXT,' +
                'zwnr TEXT,' +
                'remark1 TEXT,' +
                'remark2 TEXT,' +
                'remark3 TEXT,' +
                'remark4 TEXT,' +
                'remark5 TEXT,' +
                'remark6 TEXT)'
                , [], () => {
                    this._successCB('createNewobjTable');
                }, (err) => {
                    this._errorCB('createNewobjTable', err);
                });
        }, (err) => {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })
    }


    deleteData() {
        if (!db) {
            this.open();
        }
        db.transaction((tx) => {
            tx.executeSql('delete from PUBP', [], () => {

            });
            tx.executeSql('delete from PUBS', [], () => {

            });
        });
    }

    deleteDataBy(table, cname, cvalue) {
        if (!db) {
            this.open();
        }
        db.transaction((tx) => {
            tx.executeSql('delete from ' + table + ' where ' + cname + ' = ?', [cvalue], () => {

            });
        });
    }

    dropTable() {
        db.transaction((tx) => {
            tx.executeSql('drop table PUBS', [], () => {

            });
        }, (err) => {
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        });
    }
    insertUserData(userData) {
        let len = userData.length;
        if (!db) {
            this.open();
        }
        this.createTable();
        this.deleteData();
        db.transaction((tx) => {
            for (let i = 0; i < len; i++) {
                var user = userData[i];
                let name = user.name;
                let age = user.age;
                let sex = user.sex;
                let phone = user.phone;
                let email = user.email;
                let address = user.address;
                let sql = "INSERT INTO user(name,age,sex,phone,email,address)" +
                    "values(?,?,?,?,?,?)";
                tx.executeSql(sql, [name, age, sex, phone, email, address], () => {

                }, (err) => {
                    console.log(err);
                }
                );
            }
        }, (error) => {
            this._errorCB('transaction', error);
        }, () => {
            this._successCB('transaction insert data');
        });
    }

    // 放到业务方法中去
    // insertPubpData(obj) {
    //     if (!db) {
    //         this.open();
    //     }
    //     db.transaction((tx) => {
    //         let sql = "INSERT INTO PUBP(id,fbr,fbsj,headpic,hwbl,jianjie,ljdz,remark2,remark3,remark4,remark5,remark6, title)" +
    //             "values(?,?,?,?,?,?)";
    //         tx.executeSql(sql, [obj.id, obj.fbr, obj.fbsj, obj.headpic, obj.hwbl, obj.jianjie, obj.ljdz, obj.remark2, obj.remark3, obj.remark4, obj.remark5, obj.remark6, obj.title], () => {
    //         }, (err) => {
    //             console.log(err);
    //         }
    //         );
    //     }, (error) => {
    //         this._errorCB('transaction', error);
    //     }, () => {
    //         this._successCB('transaction insert data');
    //     });
    // }

    close() {
        if (db) {
            this._successCB('close');
            db.close();
        } else {
            console.log("SQLiteStorage not open");
        }
        db = null;
    }
    _successCB(name) {
        console.log("SQLiteStorage " + name + " success");
    }
    _errorCB(name, err) {
        console.log("SQLiteStorage " + name);
        console.log(err);
    }


    render() {
        return null;
    }
} 