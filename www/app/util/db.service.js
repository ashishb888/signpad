(function() {
  angular.module('starter').factory('dbService', dbService);

  dbService.$inject = ['starterConfig', '$q', 'utilService'];
  function dbService(starterConfig, $q, utilService) {
    var logger = utilService.getLogger();
    var dbService = this;
    dbService.db = null;

    dbService.initDB = function() {
      logger.log("initDB service");
      //dbService.db = sqlitePlugin.openDatabase({name: starterConfig.dbConfig.dbName});
      dbService.db = openDatabase(starterConfig.dbConfig.dbName, starterConfig.dbConfig.dbVersion, starterConfig.dbConfig.dbDescription, starterConfig.dbConfig.dbSize);

      angular.forEach(starterConfig.dbConfig.tables, function(table) {
        var columns = [];

        angular.forEach(table.columns, function(column) {
          columns.push(column.name + ' ' + column.type);
        });

        var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
        dbService.dbQuery(query);
        logger.debug('Table ' + table.name + ' initialized');
      });
    };

    dbService.dbQuery = function(query, params) {
      logger.debug("selectQuery service");
      if(params == null || params == undefined){
        params = [];
      }

      var deferred = $q.defer();

      dbService.db.transaction(function(transaction) {
        transaction.executeSql(query, params, function(transaction, result) {
          deferred.resolve(result);
        }, function(transaction, error) {
          deferred.reject(error);
        });
      });

      return deferred.promise;
    };

    return dbService;

  }
})();
