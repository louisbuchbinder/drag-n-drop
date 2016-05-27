
"use strict";

var pg = require('pg');

var conString = "postgres://postgres:password@localhost/";
 

var clean = [
  // 'DROP TABLE IF EXISTS users_quizes_join CASCADE',
  // 'DROP TABLE IF EXISTS links CASCADE',
  // 'DROP TABLE IF EXISTS answers CASCADE',
  // 'DROP TABLE IF EXISTS questions CASCADE',
  // 'DROP TABLE IF EXISTS quizes CASCADE',
  // 'DROP TABLE IF EXISTS users_links_join CASCADE',
  'DROP TABLE IF EXISTS files CASCADE',
  'DROP TABLE IF EXISTS users CASCADE'


];

var create = [
  // 'CREATE TABLE IF NOT EXISTS links (PRIMARY KEY(url), title TEXT, url TEXT UNIQUE, created TEXT)',
  'CREATE TABLE IF NOT EXISTS users (index SERIAL PRIMARY KEY, username TEXT UNIQUE, password TEXT, created TEXT)',
  'CREATE TABLE IF NOT EXISTS files (index SERIAL PRIMARY KEY, userindex INT, FOREIGN KEY (userindex) REFERENCES users(index), link TEXT UNIQUE, filename TEXT, filedata TEXT)',
  // 'CREATE TABLE IF NOT EXISTS quizes (PRIMARY KEY(title), username TEXT, title TEXT, created TEXT)',
  // 'CREATE TABLE IF NOT EXISTS answers (PRIMARY KEY(username, title), username TEXT, title TEXT, answers TEXT, created TEXT, FOREIGN KEY(username) REFERENCES users(username), FOREIGN KEY(title) REFERENCES quizes(title))',
  // 'CREATE TABLE IF NOT EXISTS questions (title TEXT, index INTEGER, question TEXT, choices TEXT, answer TEXT, FOREIGN KEY(title) REFERENCES quizes(title))',
  // 'CREATE TABLE IF NOT EXISTS users_links_join (PRIMARY KEY(username, url), username TEXT, url TEXT, FOREIGN KEY(username) REFERENCES users(username), FOREIGN KEY(url) REFERENCES links(url))',
  // 'CREATE TABLE IF NOT EXISTS users_quizes_join (PRIMARY KEY(username, title), username TEXT, title TEXT, FOREIGN KEY(username) REFERENCES users(username), FOREIGN KEY(title) REFERENCES quizes(title))'
];


const escape$ = (string) => string.split('').filter((character)=>character!=='$').join('');


function makeQueries (queries, client, done, callback) {
  client.query(queries.shift(), function (error, result) {
    if (error) { return console.log('error in query: ', error); }
    if (queries.length > 0) { return makeQueries(queries, client, done, callback); }
    done();
    callback();
  });
}


function initialize (drop, callback) {
  callback = typeof callback === 'function' ? callback : function () {};
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    if (drop) {
      makeQueries(clean.concat(create),client, done, callback);
    }
    else {
      makeQueries(create,client, done, callback);
    }
  });
}



const submitEscapedQuery = (statement, values) => {
  return new Promise(function (resolve, reject) {
    pg.connect(conString, function(error, client, done) {
      if(error) { return reject('error: ' + error); }
      client.query(statement, function (error, results) {
        if (error) { return reject('error: ' + error); }
        done();
        resolve(results);
      });
    });
  });
}





const insertInto = (table, data) => {
  // table should be a string,
  // data should be an object with keys corresponding to column names and values corresponding to data values

  const columns = Object.keys(data);
  const columnKeys = columns.join(',');
  const values =  columns
                .map(function (column) { return data[column]; })
                .map( (value) => '$$' + escape$(value) + '$$')
                .join(',');

  const statement = 'INSERT INTO ' + table + ' (' + columnKeys + ') VALUES (' + values + ')';


  return submitEscapedQuery(statement);
}


const fetch = (table, columns, where) => {
  // table should be a string of the table name
  // columns should be a string of the column names
  // where should be an object of key value pairs

  where = !where ? where : Object.keys(where)
          .map((column)=>column + '=' + '$$' + escape$(where[column]) + '$$')
          .join(' and ');

  const statement = 'SELECT ' + ( columns ? columns : '*' ) + ' FROM ' + table + ' WHERE ' + ( where ? where : '1=1');

  return submitEscapedQuery(statement);

};


const acceptableJoinTypes = [ 'JOIN', 'INNER JOIN', 'OUTER JOIN', 'LEFT OUTER JOIN', 'LEFT JOIN', 'RIGHT OUTER JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'FULL JOIN', 'NATURAL JOIN', 'CROSS JOIN', 'SELF JOIN' ];

const join = (table1, table2, conditional, joinType, columns) => {
  // table should be a string of the table name
  // columns should be a string of the column names
  // where should be a sql string of the conditional options
  joinType = joinType ? joinType : '';
  if (!acceptableJoinTypes.some((type)=>type===joinType.toUpperCase())) { return Promise.reject('incorrect join type'); }
  
  conditional = !conditional ? conditional : Object.keys(conditional)
                .map((column) => {
                  let value = escape$(conditional[column]);

                  if (value.split('').some((character)=>character==='.')) {
                    return column + '=' + value;  
                  }
                  return column + '=' + '$$' + value + '$$';
                })
                .join(' and ');

  // SELECT ... FROM table1 [INNER] JOIN table2 ON conditional_expression ...
  const statement = 'SELECT ' + ( columns ? columns : '*' ) + ' FROM ' + table1 + ' ' + joinType + ' ' + table2 + ' ON ' + ( conditional ? conditional : '1=1' );
  return submitEscapedQuery(statement);
};


module.exports = (test) => { 
  if (test) { conString += 'test'; } // any truthy value for test will result in the test db being activated
  else { conString += 'drag-n-drop'; }

  return {
    initialize: initialize,
    insertInto: insertInto,
    fetch: fetch,
    join: join
  };
};

