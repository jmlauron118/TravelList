const fs = require('tns-core-modules/file-system');
const Sqlite = require("nativescript-sqlite");
const appSettings = require("../appSettings.json");
const appFolder  = fs.knownFolders.currentApp();
const baseFolder = appSettings.sqlFolder + "/";

const storedProcedure = {
    execute : function (pkgStoredProc,param) {  
          // Execute non-query statement against SQLite database
        return new Promise(function(resolve,reject) {                   
            let file =  appFolder.getFile(baseFolder + pkgStoredProc);
            file.readText().then(fileVal => {    
                (new Sqlite(appSettings.database)).then(database => {
                    database.execSQL(fileVal, param).then(id => {       
                        resolve(id);            
                        database.close();
                    }).catch(sqlError => {
                    //    throw sqlError;
                        reject(sqlError);
                    });
                }).catch( dbError => {
                    // throw dbError;
                    reject(dbError);
                });
            }).catch(error => {                
                reject("ERROR", error);
            });            
        });
    },
    getData : function (pkgStoredProc,param) {
          // Get data as object array against SQLite database
        return new Promise(function(resolve,reject) {                   
            let file =  appFolder.getFile(baseFolder + pkgStoredProc);
            file.readText().then(fileVal => {      
                (new Sqlite(appSettings.database)).then(database => {
                    database.all(fileVal, param).then(rows => {  
                        database.close();
                        resolve(rows);
                    }).catch(sqlError => {
                        database.close();
                        reject(sqlError);
                    }); 
                }).catch( dbError => {
                    reject(dbError);
                });
            }).catch(error => {
                reject("ERROR", error);
            });          
        });
    },
    getValue : function (pkgStoredProc,param) { 
        // Get single value against SQLite database
        return new Promise(function(resolve,reject) {                   
            let file =  appFolder.getFile(baseFolder + pkgStoredProc);
            file.readText().then(fileVal => {  
                (new Sqlite(appSettings.database)).then(database => {
                    database.get(fileVal, param).then(row => {    
                        resolve(row);
                        database.close();
                    }).catch(sqlError => {
                        reject(sqlError);
                    });
                }).catch( dbError => {
                    reject(dbError);
                });
            }).catch(error => {
                reject("ERROR", error);
            });            
        });
    },
    executeTextQry : function(qryString, param){
        return new Promise((resolve, reject) =>{
            new Sqlite(appSettings.database).then((database) =>{
                database.all(qryString, param).then((row) =>{
                    resolve(row);
                    database.close();
                }).catch((sqlError) =>{
                    reject(sqlError);
                });
            }).catch((dbError) =>{
                reject(dbError);
            });
        }).catch((error) =>{
            reject(error);
        });
    },
    dynamicExecute : function(pkgStoredProc, sql) {
        return new Promise(function(resolve,reject) {                   
            let file =  appFolder.getFile(baseFolder + pkgStoredProc);
            file.readText().then(fileVal => {  
                (new Sqlite(appSettings.database)).then(async database => {
                    await database.execSQL(fileVal + sql).then(id => {    
                        resolve(id);
                        database.close();
                    }).catch(sqlError => {
                        reject(sqlError) ;
                    });
                }).catch( dbError => {
                    reject(dbError);
                });
            }).catch(error => {
                reject("ERROR", error);
            });            
        });
    }
}


module.exports = storedProcedure;