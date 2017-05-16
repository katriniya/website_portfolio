
var template;
var nums;
var pages;
var date;
var jsonData;

function parse() {

	$.getJSON("data.json", function(json) {


		jsonData=json;

		Handlebars.registerHelper('num_page', function(num) {
			var number_page=json.updates.length.toString().length;
			return number_page;
		});

		Handlebars.registerHelper('t_img', function(var1) {
			return var1==0
			?'t_0'
			:var1==1
			?'t_1'
			:var1==2
			?'t_2'
			:'t_3';
		});
		Handlebars.registerHelper('number_ticket', function(var2) {
			//fixme is tickets num incremental? or just string in json
			var zeroNum=Math.max(json.updates.length.toString().length,4);
			return zeroPad(var2,zeroNum);
		});

		Handlebars.registerHelper('p_img', function(var3) {
			return var3==0
			?'p_0'
			:var3==1
			?'p_1'
			:'p_2';
		});

		Handlebars.registerHelper('date_form', function(utc) {
			var date =  Date.parse(utc).toString('dd.MM.yy');
			return date;
		});

		Handlebars.registerHelper('num_page', function() {
			return json.updates.length;
		});
		
		Handlebars.registerHelper('pages', function(data) {
			var page_num = getNum();
			var items_num = data;

			var page = page_num==0? 1: Math.floor(items_num/page_num);
			if (page_num !=0 && items_num%page_num !=0) {
				page+=1;
			}

			var result='';
			for (i=0;i<page;++i)
				result+="<span onClick='number(this.id)' id='"+(i+1)+"'"+(i==0?" class='active'":"")+">"+(i+1)+"</span>";
				
			return result;
		});
		

		template = Handlebars.compile( $('#template').html() );
		nums = Handlebars.compile( $('#nums').html() );
		pages = Handlebars.compile( $('#pages').html() );
		date = Handlebars.compile( $('#date').html() );

		setData();

	});
};

function updateData(){

	var data = getData();

	//dates filter
	var selected_date= $(".search_date_task__select option:selected").val();
	var valDate=$(".search_date_task__select option:selected").text();
	data = selected_date==-1?data:jQuery.grep(data,function(element, index){
		return Date.parse(element.date_created).toString('MMMM, yyyy') == valDate;
	});

	//paging
	var num = getNum();
	data = num==0?data: data.slice((getPageNum()-1)*num, (getPageNum())*num);


	$('.updates').empty();
	$('.updates').append( template(data));	

	$('.article__right__task__head__alltask_num').empty();	
	$('.article__right__task__head__alltask_num').append( nums(jsonData) );


}

function setData(){
	var data  = getData();
	var dateGroupped =_.groupBy(data,function(element){
		return Date.parse(element.date_created).toString('MMMM, yyyy');
	});

	$('.table_footer__page').empty();	
	$('.table_footer__page').append( pages(data.length));


	$('.search_date_task option:not(:first-child)').remove();	
	$('.search_date_task__select').append(date(dateGroupped) );

	updateData();
}

function getData() {
	var result = jsonData.updates;

	//search
	var query = $('input#search').val();
	result = query == ''?result: jQuery.grep(result,function(element, index){
		return JSON.stringify(element).toLowerCase().indexOf(query.toLowerCase()) != -1;
	});

	//state
	var state = $(".search_open_task select :selected").val();
	result = state == '-1'?result: jQuery.grep(result,function(element, index){
		return element.state == state;
	});

	return result;
}

function getPageNum(){
	var selected_id = $(".table_footer__page span.active").attr('id');  
	return selected_id;
}

function getNum(){
	var selected_id = $(".table_footer__num span.active").attr('id');  

	var num = selected_id =='task_20'
	?20
	:selected_id=='task_50'
	?50
	:selected_id=='task_100'
	?100
	: 0;
	return num;
}

function number(var5){
	$(".table_footer__page span").removeClass("active");
	$("#"+var5 ).toggleClass("active");
	updateData();
}

function num_page(var4){

	$(".table_footer__num span").removeClass("active");         
	$("#"+var4).toggleClass("active");

	setData();
}

function sort_task(task_state){

	setData(num);
}

function zeroPad (num, numZeros) {
	var an = Math.abs (num);
	var digitCount = 1 + Math.floor (Math.log (an) / Math.LN10);
	if (digitCount >= numZeros) {
		return num;
	}
	var zeroString = Math.pow (10, numZeros - digitCount).toString ().substr (1);
	return num < 0 ? '-' + zeroString + an : zeroString + an;
}

function checkSearch(e){
	if (e.keyCode ==13){
		setData();
	}
	
	return e.keyCode == 13? false:true;
}
