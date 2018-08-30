'use strict';

var express=require('express');
var fs=require('fs');
var request=require('request');

var cheerio=require('cheerio');

var app=express();


app.get('/scrape',function(req,res){


	var url="https://medium.com/";

	var pagesVisited={};
	var pagesToVisit=[];
	pagesToVisit.push(url);
	scraping();
	function scraping(){

		var newPage=pagesToVisit.pop();
		
		

		if(newPage in pagesVisited){
			//already visited the page
			//console.log(newPage);
			scraping();
			//return;
		}
		else{
			visitPage(newPage);
		}

	}

	function visitPage(page){

		pagesVisited[page]=true;//page added
		//console.log(page);

	

		request(page,function(error,response,html){
			
			console.log(page);
		if(!error && response.statusCode==200){
			
			var $=cheerio.load(html);

			var links=$('a');
			//console.log(links);
			$(links).each(function(i,link){
				//json.content=$(link).text();
				var a=$(link).attr('href');
				if(a.indexOf("medium")!==-1){
				pagesToVisit.push(a);					
				}
				
			});

			scraping();
		}
		else{
			scraping();
		}
		});
	}








		// fs.writeFile('Links.json',JSON.stringify(pagesVisited,null,4),function(err){
		// 	if(!err){
		// 		res.send("File written successfully!!!!")
		// 	}
		// })

	


});


app.listen(8006,function(){

	console.log("App is running on port 8006");
});