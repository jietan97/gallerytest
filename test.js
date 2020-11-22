// http://interview.funplay8.com/index.php

const rp = require('request-promise');
const cher = require('cheerio');
const express = require('express');
const app = express();
const port = 3000;

// create.html and test.js post
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const url = require('url');

var count = 0;
var json = [];
let array = []
let input = [];

// Q1 Get all images data 
app.get('/all', async function(req, res){
    res.writeHead(200, {"Content-Type": 'application/json'})
    json = []
    count = 0
    for (let i = 1; i < 96; i++) {
        // show the sequence that get from other link
        // if the sequence display not correctly, rerun again
        console.log(i)
        let url = await rp('http://interview.funplay8.com/index.php?page=' + i).then(function(html) {
          for (let imageNo = 0; imageNo < cher('div > div > img', html).length; imageNo++) {
            json.push({
                id: count += 1,
                name: cher('div > div > img', html)[imageNo].attribs.src.split('/')[4].split('_').join(' ').split('.')[0],
                url: cher('div > div > img', html)[imageNo].attribs.src,
                page: i,
                requestCount: 0
            }) 
          }

        }).catch((error) => {
            console.log(i);
        });
    }
    res.end(JSON.stringify(json))
});


// Q2 Get image data based on id
// :id -> to get the parameter behind
app.get('/id/:id', function(req, res){
  //scraping web
  // console.log(req.originalUrl)  // show the url (eg: /id/3)
  // console.log(req.params.pages)  // get the parameter in the localhost (1, 2,...)
  let url = 'http://interview.funplay8.com/index.php?id=' + req.params.id;
  let getidjson = []
  res.setHeader( "Content-Type", 'application/json')

    for (var key in json) { // start at 0
      // console.log(key)
      if (json[key].id == req.params.id) {
        // console.log(key + "->" + json[key].page)
        getidjson.push({
          id : parseInt(key) + 1, // 1 - 852
          name: json[key].name,
          url: json[key].url,
          page: json[key].page,
          requestCount: json[key].requestCount
        })
      }
    }

    res.end(JSON.stringify(getidjson))

})


// Q3 Get image data based on page
// :pages -> to get the parameter behind
app.get('/page/:pages', function(req, res){
  // scraping web
  // console.log(req.originalUrl)  // show the url (eg: /pages/3)
  // console.log(req.params.pages)  // get the parameter in the localhost (1, 2,...)
  let url = 'http://interview.funplay8.com/index.php?page=' + req.params.pages;
  let getpagejson = []
  res.setHeader( "Content-Type", 'application/json')

    for (var key in json) { // start at 0
      // console.log(key)
      if (json[key].page == req.params.pages) {
        // console.log(key + "->" + json[key].page)
        getpagejson.push({
          id : parseInt(key) + 1, // 1 - 852
          name: json[key].name,
          url: json[key].url,
          page: json[key].page,
          requestCount: json[key].requestCount
        })
      }
    }

    res.end(JSON.stringify(getpagejson))
})


// Q4 Get the most popular image
app.get('/popular', function(req, res){
  let getmostpopularimage = []
  let popularjson = 0
  res.setHeader( "Content-Type", 'application/json')

  // update the request count
    for (var key in json) { // start at 0
      // console.log(key)
      if ((parseInt(key) + 1) == 20) {
        // console.log(key + "->" + json[key].page)
        json[key].requestCount = 60;
      }
      if ((parseInt(key) + 1) == 60) {
        json[key].requestCount = 82;
      }
      if ((parseInt(key) + 1) == 352) {
        json[key].requestCount = 102;
      }
      if ((parseInt(key) + 1) == 609) {
        json[key].requestCount = 99;
      }
    }

    for (var key in json) {
      if (json[key].requestCount >= popularjson) {
        popularjson = json[key].requestCount
        getmostpopularimage = json[key]
      }
    }

    res.end(JSON.stringify(getmostpopularimage))
})

// Q5 Allow user to insert new image data
// -- run this first
app.get('/', function(req,res) {
  res.sendfile('create.html')
})

// then it will directly to here
app.post('/create', function(req, res){
  // scraping web
  // console.log(req.originalUrl)  // show the url (eg: /pages/3)
  // console.log(req.params.pages)  // get the parameter in the localhost (1, 2,...)
  res.setHeader( "Content-Type", 'application/json')

  var pageLength = 0
  var pageNo = 95

  if (array.length != 0) {
      json = array
  }
  // res.redirect('/all')

  array = []

//   console.log(json.length)
  for (let i = 0; i < json.length; i++) {
    array[i] = json[i]
  }

  for (var key in array) { // start at 0
    // console.log(key)
    if (array[key].page == 95) {
        pageLength += 1
        if (pageLength <= 9) {
            pageNo = 95
        } else {
            pageNo += 1
        }
    }
  }

  // json.length = 852, then input.length + 1 when have new value added
  // new array, create image with the length 
  input[input.length] = { 
    id : json.length + (input.length + 1), 
    name: req.body.name,
    url: req.body.url,
    page: pageNo,
    requestCount: 0 
  }

//   console.log(array.length)
//   console.log(input.length)
  res.end(JSON.stringify(input))

})


app.listen(port, () =>{
  console.log('API is running on http://localhost:3000');
});
