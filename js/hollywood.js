$(document).ready(function(){
	
	var movie_data;

	var h = 700;
	var w = 700;
	
	var x_margin_left = 120;
	var x_margin_right = 50;
	var y_margin_top = 30;
	var y_margin_bottom = 120;
	
	var inner_h = h - (y_margin_top + y_margin_bottom);
	var inner_w = w - (x_margin_left + x_margin_right);
	
	var chart;
	var g;
	var x_percent;
	var x_opening;
	var x_view;
	var y_view;
	var colour;
	var size;
	var last_r;
	
	var x_bars;

	var budget_min = 0;
	var budget_max = 350;

	var y_gross;
	var y_percent ;
	var y_profit_log;
	var y_pl;
	var y_opening;
	var y_budget;
	var r_budget;
	var x_hide;
	
	var	xaxis_percent;
	var xaxis_opening;
	
	var yaxis_gross;
	var yaxis_percent;
	var yaxis_profit;
	var yaxis_hide;
	var yaxis_pl;
	var yaxis_opening;
	
	var tmp_selected;
	var tmp_selected_inverse;
	
	var	y_axis_gross_g;
	
	$("#about_header").click(function(){
		
		$('#about').modal();
		
	});
	
	$("#help_header").click(function(){
		
		$('#help').modal();
		
	});
	
	
	var formatNumber = d3.format(",.0f"), // for formatting integers
	formatNone = function(d){return ""},
	    formatCurrency = function(d) { return "$" + formatNumber(d); },
		formatPercent = function(d) {return formatNumber(d) + "% "};
		
	var formatGenreColour = function(d) {
			
			if(d.genre == "Action"){
				
				return "#FB000D";
				
			}else if(d.genre == "Adventure"){

				return "#00B32D";

			}else if(d.genre == "Animation"){

				return "#003366";

			}else if(d.genre == "Biography"){

				return "#FF8C00";

			}else if(d.genre == "Biopic"){

				return "#7FFF00";

			}else if(d.genre == "Comedy"){

				return "#1E90FF";

			}else if(d.genre == "Crime"){

				return "#006363";

			}else if(d.genre == "Documentary"){

				return "#006400";

			}else if(d.genre == "Drama"){

				return "#7FFF00";

			}else if(d.genre == "Fantasy"){

				return "#6E0069";

			}else if(d.genre == "Horror"){

				return "#000";

			}else if(d.genre == "Musical"){

				return "#FF6EB4";

			}else if(d.genre == "Mystery"){

				return "#3E0038";
			
			}else if(d.genre == "Romance"){

				return "#FFBB73";

			}else if(d.genre == "Thriller"){

				return "#FFCC00";

			}else{

				return "#FF0000"

			}
			
		};
		
		var formatYearColour =  function(d) {
			
			if(d.year == "2007"){
				
				return "#FF0000";
				
			}else if(d.year == "2008"){

				return "#003366";

			}else if(d.year == "2009"){

				return "#FFCC00";

			}else if(d.year == "2010"){

				return "#FF8C00";

			}else if(d.year == "2011"){

				return "#006363";

			}else {

				return "#7FFF00";

			}
			
		};
		
	var selected;	
	
		
	d3.json("data/hw_all.json", function(new_data){

			movie_data = new_data;

			for(var i=0;i<movie_data.length;i++){

				movie_data[i].label = movie_data[i].film;

			}
			
			for(var i=0;i<movie_data.length;i++){

				movie_data[i].pl = movie_data[i].ww_gross -movie_data[i].budget ;

			}
			
			$(function(){
			
				setup();
				init();	
				
			});
		
		$("#reset_search").click(function(){
		
			$( "#search" ).val("");
			search_deselect();
			//alert("empty");
		
		});
		
		
		/*Genres Checkbox Stuff
		*/
		
		//init array
	

		var years = new Array();
		$(".year").each(function(){

			years.push($(this).val());

		});

		//Select All
		$('#all_years').click(function(){
			
			$(".year").each(function(){
				
				$(this).prop('checked', true);
				
				var year_match = 0;
				
				for(var z = 0; z < years.length; z++){
					
					if(years[z] == $(this).val()){
						
						year_match = 1;
					}
				
				}
				
				if(year_match == 0){
							
					years.push($(this).val());	
					
				}

				
			});
			
			filter_multi(genres, years, budget_min,budget_max);
		});
		
		//Select None
		$('#no_years').click(function(){

			$(".year").each(function(){

				$(this).prop('checked', false);
				years = [];

			});
			
				filter_multi(genres, years, budget_min,budget_max);
		});
		
		
		//Per Year selection
		$(".year").change(function(){

			if( $(this).attr('checked') == 'checked'){

				years.push($(this).val());

			}else{

				for(var i=0;i<years.length;i++){

					if($(this).val() == years[i]){

						years.splice(i, 1);

					}
				}			
			}

			filter_multi(genres, years, budget_min,budget_max);

		});
		
		/*Genres Checkbox Stuff
		*/
		
		var genres = new Array();
				
		$(".genre").each(function(){

			genres.push($(this).val());

		});
				
		
		//Select All
		$('#all_genres').click(function(){
			
			$(".genre").each(function(){
				
				$(this).prop('checked', true);
				
				
					var genre_match = 0;

					for(var z = 0; z < genres.length; z++){

						if(genres[z] == $(this).val()){

							genre_match = 1;
						}

					}

					if(genre_match == 0){

						genres.push($(this).val());
						

					}
				

			
			});
			
			filter_multi(genres, years, budget_min,budget_max);

		});
		
		//Select None
		$('#no_genres').click(function(){

			$(".genre").each(function(){

				$(this).prop('checked', false);
				genres = [];

			});
			
				filter_multi(genres, years, budget_min,budget_max);
		});
		
		//Per Checkbox Selection
		$(".genre").change(function(){
			
			if( $(this).attr('checked') == 'checked'){
					
				genres.push($(this).val());
					
			}else{
					
				for(var i=0;i<genres.length;i++){
						
					if($(this).val() == genres[i]){
							
						genres.splice(i, 1);
							
					}
				}			
			}
			
							filter_multi(genres, years, budget_min,budget_max);

		});
		
		//Autocomplete Stuff
		$("#search").autocomplete({

			source: movie_data,
			select:function( event, ui){
			
				//$("#search").val(ui.item.label);
				search_deselect();
				search_select(ui.item);
				return false;
			
			},
			focus:function( event, ui){
			
				$("#search").val(ui.item.label);
			
				search_deselect();
				search_select(ui.item);
				return false;
			
			}
		});
		
		$( "#slider1" ).slider({

			range: true,
			min:0,
			max: 350,
			values: [0, 350],
			slide: function( event, ui ) {
							$( "#budget_range" ).html( "Budget: $" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );

							budget_min = ui.values[ 0 ];
							budget_max = ui.values[ 1 ];
							
							filter_multi(genres, years, budget_min,budget_max);
							
							//alert(budget_min);
							
						}				

		});
		
		$("#reset").click(function(){

			$( "#slider1" ).slider({values:[0, 350]});
			
				budget_min = 0;
				budget_max = 350;
				$( "#budget_range" ).html( "Budget: $" + budget_min + " - $" + budget_max );
			filter_multi(genres, years, budget_min, budget_max);	

		});

		
		//X-Axis
		//Button classing
		$(".x_view").click(function(event){
	
			$(".x_view").removeClass("btn-primary");
			
			$("#" + event.target.id).addClass("btn-primary");
				
		});
		
		$("#x_opening").click(function(){ ax_x_opening();});	
		$("#x_budget").click(function(){ ax_x_budget();});	
		$("#x_rating_rt").click(function(){ ax_x_rating_rt();});
		$("#x_rating_aud").click(function(){ ax_x_rating_aud();});
		$("#x_film").click(function(){ ax_x_film();});
		

		//Y-Axis
		//Button classing
		$(".y_view").click(function(event){
			
			$(".y_view").removeClass("btn-primary");
			
			$("#" + event.target.id).addClass("btn-primary");
				
		});
		
		$("#y_profit").click(function(){ ax_y_profit();});	
		$("#y_pl").click(function(){ ax_y_pl();});
		$("#y_rating_aud").click(function(){ ax_y_rating_aud();});
		$("#y_opening").click(function(){ ax_y_opening();});
		$("#y_gross").click(function(){ ax_y_gross();});
		
		//Button classing
		$(".r_view").click(function(event){
			
			$(".r_view").removeClass("btn-primary");
			
			$("#" + event.target.id).addClass("btn-primary");
				
		});
		
		$("#r_pl").click(function(){ size_pl();});
		$("#r_rating").click(function(){ size_rating();});
		$("#r_budget").click(function(){ size_budget();});
		$("#r_none").click(function(){ size_none();});
		
		//Button classing
		$(".c_view").click(function(event){
			
			$(".c_view").removeClass("btn-primary");
			
			$("#" + event.target.id).addClass("btn-primary");
				
		});
		
		$("#c_genre").click(function(){ colour_genre();});
		$("#c_year").click(function(){ colour_year();});
		$("#c_none").click(function(){ colour_none();});
				
	//D3 stuff starts
	
	function setup(){
		
		//Add svg - width/height
		chart = d3.select("#chart_container").append("svg:svg")
			.attr("class", "chart")
			.attr("width", w)
			.attr("height", h);

			//use g element for offset...not needed yet
		g = chart.append("svg:g").attr("transform", "translate(" + x_margin_left + "," + y_margin_top + ")");

		//All the different scales we want to use
		//X scales
		x_percent = d3.scale.linear()
				.domain([0, 100 ])
				.range([0, inner_w]);
			
		x_opening = d3.scale.linear()
				.domain([0, d3.max(movie_data, function(d){return parseFloat(d.opening);}) ])
				.range([0, inner_w]);
				
		x_budget = d3.scale.linear()
				.domain([0, d3.max(movie_data, function(d){return parseFloat(d.budget);}) ])
				.range([0, inner_w]);
					
		x_f_gross = d3.scale.linear()
				//.domain([0, d3.max(movie_data, function(d){return parseFloat(d.f_gross);}) ])
				.domain([0, 1000 ])
				.range([0, inner_w]);

		x_d_gross = d3.scale.linear()
				//.domain([0, d3.max(movie_data, function(d){return parseFloat(d.d_gross);}) ])
				.domain([0, 1000 ])
				.range([0, inner_w]);

		//Y scales

		y_gross = d3.scale.linear()
				.domain([0, d3.max(movie_data, function(d){return parseFloat(d.ww_gross);}) ])
				.range([inner_h, 0]);

		y_percent = d3.scale.linear()
				.domain([0, 100 ])
				.range([inner_h, 0]);

		y_profit_log = d3.scale.log()
				.domain([1, d3.max(movie_data, function(d){return parseFloat(d.profit);}) ])
				.range([inner_h, 0]);

		y_pl = d3.scale.linear()
				.domain([d3.min(movie_data, function(d){return parseFloat(d.pl);}), d3.max(movie_data, function(d){return parseFloat(d.pl);}) ])
				.range([inner_h, 0]);
				
		y_opening = d3.scale.linear()
			.domain([0, d3.max(movie_data, function(d){return parseFloat(d.opening);}) ])
			.range([inner_h, 0]);
			
		y_budget = d3.scale.linear()
				.domain([0, d3.max(movie_data, function(d){return parseFloat(d.budget);}) ])
				.range([inner_h,0]);

		//Circle Radius?
		r_budget = d3.scale.linear()
			.domain([0, d3.max(movie_data, function(d){return parseFloat(d.budget);}) ])
			.range([2,20]);
		
		r_rating = d3.scale.linear()
			.domain([0, 100])
			.range([1,12]);
				
		r_pl = d3.scale.linear()
			.domain([0, d3.max(movie_data, function(d){return parseFloat(d.pl);}) ])
			.range([2,26]);	
			
		//bar chart
		
		x_bars = d3.scale.linear()
				.domain([0, movie_data.length ])
				.range([0, inner_w]);

			
		//new axis

		xaxis_percent = d3.svg.axis().scale(x_percent).ticks(10).orient("bottom").tickFormat(formatPercent);
		xaxis_percent_ticks = d3.svg.axis().scale(x_percent).ticks(10).orient("bottom").tickFormat(formatNone).tickSize(-inner_h);
		
		xaxis_opening = d3.svg.axis().scale(x_opening).orient("bottom").ticks(10).tickFormat(formatCurrency);
		xaxis_opening_ticks = d3.svg.axis().scale(x_opening).orient("bottom").tickFormat(formatNone).ticks(10).tickSize(-inner_h);
		
		xaxis_budget = d3.svg.axis().scale(x_budget).orient("bottom").ticks(10).tickFormat(formatCurrency);
		xaxis_budget_ticks = d3.svg.axis().scale(x_budget).orient("bottom").tickFormat(formatNone).ticks(10).tickSize(-inner_h);		
		
		yaxis_gross = d3.svg.axis().scale(y_gross).orient("left").tickFormat(formatCurrency).ticks(10);
		yaxis_gross_ticks = d3.svg.axis().scale(y_gross).orient("left").tickFormat(formatNone).ticks(10).tickSize(-inner_w);
		
		yaxis_percent = d3.svg.axis().scale(y_percent).orient("left").ticks(10).tickFormat(formatPercent);
		yaxis_percent_ticks = d3.svg.axis().scale(y_percent).orient("left").tickFormat(formatNone).ticks(10).tickSize(-inner_w);	
				
		yaxis_profit = d3.svg.axis().scale(y_profit_log).orient("left").ticks(15, formatPercent);
		yaxis_profit_ticks = d3.svg.axis().scale(y_profit_log).orient("left").tickFormat(formatNone).ticks(10).tickSize(-inner_w);
		
		yaxis_pl = d3.svg.axis().scale(y_pl).orient("left").ticks(15).tickFormat(formatCurrency);
		yaxis_pl_ticks = d3.svg.axis().scale(y_pl).orient("left").tickFormat(formatNone).ticks(10).tickSize(-inner_w);
		
		yaxis_opening = d3.svg.axis().scale(y_opening).orient("left").ticks(15).tickFormat(formatCurrency);
		yaxis_opening_ticks = d3.svg.axis().scale(y_opening).orient("left").tickFormat(formatNone).ticks(10).tickSize(-inner_w);
		
		yaxis_budget = d3.svg.axis().scale(y_budget).orient("left").ticks(15).tickFormat(formatCurrency);
		yaxis_budget_ticks = d3.svg.axis().scale(y_budget).orient("left").tickFormat(formatNone).ticks(10).tickSize(-inner_w);
		
		xaxis_percent = d3.svg.axis().scale(x_percent).ticks(10).orient("bottom").tickFormat(formatPercent);
		xaxis_percent_ticks = d3.svg.axis().scale(x_percent).ticks(10).orient("bottom").tickFormat(formatNone).tickSize(-inner_h);
	
		x_hide = d3.scale.linear()
				.domain([0, 0])
				.range([0, 0]);
		
		xaxis_hide	= d3.svg.axis().scale(x_hide).orient("bottom").tickSize(-inner_w);	
		
	}
	
	function init(){
	
		x_axis_init();
		x_axis_rating_rt();
		
		y_axis_init();
		y_axis_gross();
		
		init_prof_log();
		init_xy();
	
		g.selectAll("circle")
			.data(movie_data)
			.enter().append("circle")
			.attr("cy", function(d) { return y_gross(parseFloat(d.ww_gross)); })
			.attr("cx", function(d) { return x_percent(d.rt_rating); })
			.attr("r", function(d) {return r_budget(d.budget); })
			.attr("stroke", "#FFF")
		 	.on("mouseover", hover_title)
			.on("mouseout", hover_clear_title)
			.on("mousedown",lock);
			
			size = "budget";
			x_view = "rating_rt";
			y_view = "gross";
			colour = "none";		
	}
	

	function size_budget(){

			g.selectAll("circle")
				.transition()
				.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
				.duration(700)
				.ease("poly", 5)
				.attr("r", function(d) {return r_budget(d.budget); });
		
			size = "budget";	
	}
	
	function size_none(){

			g.selectAll("circle")
				.transition()
				.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
				.duration(700)
				.ease("poly", 5)
				.attr("r", 3);
		
			size = "none";
	}
	
	function size_pl(){

			g.selectAll("circle")
				.transition()
				.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
				.duration(700)
				.ease("poly", 5)
				.attr("r", function(d) {return r_pl(parseFloat(d.pl)); });
				
			size = "pl";
	}
	
	
	function size_rating(){

			g.selectAll("circle")
				.transition()
				.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
				.duration(700)
				.ease("poly", 5)
				.attr("r", function(d) {return r_rating(d.rt_rating); });
			
			size = "rating";
		
	}
	
	function colour_none(){
		
			g.selectAll("circle")
				.transition()
				.delay(function(d) {return parseFloat(d.ww_gross)/6 ; })
				.duration(700)
				.style("fill", "#000");
		
			colour = "none";
			
			$(".genre_label").each(function(){


			$(this).css("color", "#333");

			});
			
			$(".year_label").each(function(){


				$(this).css("color", "#333");

			});
		
		
	}
	
	function colour_genre(){
		
			g.selectAll("circle")
				.transition()
				.delay(function(d) {return parseFloat(d.ww_gross)/6 ; })
				.duration(700)
				.style("fill", formatGenreColour);
					
			colour = "genre";
			
			$(".genre_label").each(function(){
				
				
				var this_id=new Object();
				this_id.genre = $(this).html();//("value");
			
					$(this).css("color", formatGenreColour(this_id));
				
			});
			
			$(".year_label").each(function(){


				$(this).css("color", "#333");

			});
		
	}	
	
	function colour_year(){
		
			g.selectAll("circle")
				.transition()
				.delay(function(d) {return parseFloat(d.ww_gross)/6 ; })
				.duration(700)
				.style("fill", formatYearColour);
					
			colour = "year";
			
			$(".year_label").each(function(){
				
				var this_id = new Object();
				this_id.year = $(this).html();//("value");
			
					$(this).css("color", formatYearColour(this_id));
				
			});
			
			$(".genre_label").each(function(){


				$(this).css("color", "#333");

			});
			
	}
	
	function ax_x_film(){
		
		hide_prof_log();
		hide_xy();
		
		x_axis_film();	
		
		x_view = "film";
		
		if(y_view == "gross"){
			
			g.selectAll("circle")
				.sort(function(x,y){return parseFloat(x.ww_gross) - parseFloat(y.ww_gross)})
				.transition()
				.delay(function(d, i) {return i ; })
				.duration(1000)
				.ease("poly", 5)	
				.attr("cx", function(d, i) { return x_bars(i); });
			
		}else if(y_view == "rating_aud"){

				g.selectAll("circle")
					.sort(function(x,y){return x.aud_rating - y.aud_rating})
					.transition()
					.delay(function(d, i) {return i ; })
					.duration(1000)
					.ease("poly", 5)	
					.attr("cx", function(d, i) { return x_bars(i); });
					
		}else if(y_view == "profit"){

				g.selectAll("circle")
					.sort(function(x,y){return x.profit - y.profit})
					.transition()
					.delay(function(d, i) {return i ; })
					.duration(1000)
					.ease("poly", 5)	
					.attr("cx", function(d, i) { return x_bars(i); });
					
		}else if(y_view == "pl"){

				g.selectAll("circle")
					.sort(function(x,y){return x.pl - y.pl})
					.transition()
					.delay(function(d, i) {return i ; })
					.duration(1000)
					.ease("poly", 5)	
					.attr("cx", function(d, i) { return x_bars(i); });
					
		}else if(y_view == "opening"){

				g.selectAll("circle")
					.sort(function(x,y){return x.opening - y.opening})
					.transition()
					.delay(function(d, i) {return i ; })
					.duration(1000)
					.ease("poly", 5)	
					.attr("cx", function(d, i) { return x_bars(i); });
					
		}

	}
	
	function ax_x_rating_rt(){
		
		hide_xy();
		hide_prof_log();
		
		if(y_view == "rating_aud"){
			
			show_xy();
			
		}
		

		
		x_axis_rating_rt();
		
		g.selectAll("circle")
			.transition()
			.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
			.duration(700)
			.style("fill", formatYearColour);
		
		g.selectAll("circle")
			.transition()
			.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
			.duration(700)
			.ease("poly", 5)
			.attr("cx", function(d) { return x_percent(d.rt_rating); });
				
			x_view = "rating_rt";
	}
	
	function ax_x_rating_aud(){
		
		hide_xy();
		hide_prof_log();
		
		x_axis_rating_aud();
		
		g.selectAll("circle")
			.transition()
			.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
			.duration(700)
			.ease("poly", 5)
			.attr("cx", function(d) { return x_percent(d.aud_rating); });
			
			x_view = "rating_aud";
	}
	
	function ax_x_opening(){
		
		hide_xy();
		hide_prof_log();
		
		x_axis_opening();
		
		g.selectAll("circle")
			.transition()
			.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
			.duration(700)
			.ease("poly", 5)
			.attr("cx", function(d) { return x_opening(d.opening); });
			
			x_view = "opening";
	}
	
	function ax_x_budget(){
		
		hide_xy();
		hide_prof_log();
		
		x_axis_budget();
		
		g.selectAll("circle")
			.transition()
			.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
			.duration(700)
			.ease("poly", 5)
			.attr("cx", function(d) { return x_budget(d.budget); });
			
			x_view = "budget";
	}
	
	function ax_y_rating_aud(){
		
		hide_xy();
		hide_prof_log();
		
		if(x_view == "rating_rt"){
			
			show_xy();
			
		}
		
		y_axis_rating_aud();
		
		if(x_view == "film"){
			
				g.selectAll("circle")
					.sort(function(x,y){return x.aud_rating - y.aud_rating})
					.transition()
					.delay(function(d, i) {return i ; })
					.duration(1000)
					.ease("poly", 5)	
					.attr("cx", function(d, i) { return x_bars(i); })
					.attr("cy", function(d) { return y_percent(parseFloat(d.aud_rating)); });

			
		}else{
			
				g.selectAll("circle")
					.transition()
					.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
					.duration(700)
					.ease("poly", 5)
					.attr("cy", function(d) { return y_percent(parseFloat(d.aud_rating)); });
			
		}
	
			y_view = "rating_aud";
	}
	
	function ax_y_gross(){
		
		hide_xy();
		hide_prof_log();
		
		y_axis_gross();
		
			if(x_view == "film"){

					g.selectAll("circle")
						.sort(function(x,y){return x.ww_gross - y.ww_gross})
						.transition()
						.delay(function(d, i) {return i ; })
						.duration(1000)
						.ease("poly", 5)	
						.attr("cx", function(d, i) { return x_bars(i); })
						.attr("cy", function(d) { return y_gross(parseFloat(d.ww_gross)); });


			}else{
		
				g.selectAll("circle")
					.transition()
					.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
					.duration(700)
					.ease("poly", 5)
					.attr("cy", function(d) { return y_gross(parseFloat(d.ww_gross)); });

			}
		
			
			y_view = "gross";
	}
	
	function ax_y_profit(){
		
		hide_xy();
		show_prof_log();
		
		y_axis_profit();
		
			if(x_view == "film"){

					g.selectAll("circle")
						.sort(function(x,y){return x.profit - y.profit})
						.transition()
						.delay(function(d, i) {return i ; })
						.duration(1000)
						.ease("poly", 5)	
						.attr("cx", function(d, i) { return x_bars(i); })
						.attr("cy", function(d) { return y_profit_log(parseFloat(d.profit)); });


			}else{
		
		

					g.selectAll("circle")
						.transition()
						.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
						.duration(700)
						.ease("poly", 5)
						.attr("cy", function(d) { return y_profit_log(parseFloat(d.profit)); });

			}
			
			y_view = "profit";
	}
	
	function ax_y_pl(){
		
		hide_xy();
		hide_prof_log();
		
		y_axis_pl();
		
			if(x_view == "film"){

					g.selectAll("circle")
						.sort(function(x,y){return x.pl - y.pl})
						.transition()
						.delay(function(d, i) {return i ; })
						.duration(1000)
						.ease("poly", 5)	
						.attr("cx", function(d, i) { return x_bars(i); })
						.attr("cy", function(d) { return y_pl(parseFloat(d.pl)); });


			}else{
		
		
		
			g.selectAll("circle")
					.transition()
					.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
					.duration(700)
					.ease("poly", 5)
					.attr("cy", function(d) { return y_pl(parseFloat(d.pl)); });
		
			}
			
			y_view = "pl";
	}
	
	function ax_y_budget(){
		
		hide_xy();
		hide_prof_log();
		
		y_axis_budget();
		
		g.selectAll("circle")
			.transition()
			.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
			.duration(700)
			.ease("poly", 5)
			.attr("cy", function(d) { return y_budget(d.budget); });
			
			y_view = "budget";
			
	}
	
	function ax_y_opening(){
		
		hide_xy();
		hide_prof_log();
		
		y_axis_opening();
		
			if(x_view == "film"){

					g.selectAll("circle")
						.sort(function(x,y){return x.opening - y.opening})
						.transition()
						.delay(function(d, i) {return i ; })
						.duration(1000)
						.ease("poly", 5)	
						.attr("cx", function(d, i) { return x_bars(i); })
				.attr("cy", function(d) { return y_opening(d.opening); });


			}else{
		
		
			g.selectAll("circle")
				.transition()
				.delay(function(d) {return parseFloat(d.ww_gross)/3 ; })
				.duration(700)
				.ease("poly", 5)
				.attr("cy", function(d) { return y_opening(d.opening); });
			
		}
			
			y_view = "opening";
			
	}
	
				
	function hover_title(bar_data){
		
		$("#movie_title").html(bar_data.film);
		$("#movie_rating").html(formatPercent(bar_data.rt_rating));
		$("#movie_gross").html(formatCurrency(bar_data.ww_gross));
		$("#movie_profit").html(formatPercent(bar_data.profit));
		$("#movie_genre").html(bar_data.genre);
		$("#movie_budget").html(formatCurrency(bar_data.budget));
		$("#movie_year").html(bar_data.year);
		
		
		
		selected = g.selectAll("circle")
					.filter(function(d){return d.film == bar_data.film;
								
			});
			
			if(selected.attr("class") == "selected"){

				selected.style("fill", "#000");

			}else{
				
				selected.style("fill", "#000");
				
				last_r = parseInt(selected.attr("r"));
				
				//alert(last_size);

				selected.transition()
					.duration(400)
					.ease("elastic",1 , .3)
					.attr("r", (last_r + 4));
					
			}

	};
	
	function hover_clear_title(bar_data){
		
		selected = g.selectAll("circle")
					.filter(function(d){return d.film == bar_data.film;
								
			});
		
		$("#movie_title").empty();
		$("#movie_rating").empty();
		$("#movie_gross").empty();
		$("#movie_profit").empty();
		$("#movie_genre").empty();
		$("#movie_budget").empty();
		$("#movie_year").empty();
		
		if(selected.attr("class") == "selected"){

			selected.style("fill", "#FF0000").style("opacity", 0.8)

		}else{
			
			if(colour == "year"){
				
				selected.style("fill", formatYearColour).style("opacity", 0.7);	
					
			}else if(colour == "genre"){
				
				selected.style("fill", formatGenreColour).style("opacity", 0.7);	
				
			}else{
				
				selected.style("fill", "#000").style("opacity", 0.7);	
				
			}
			
			if(size == "none"){
				
				selected.transition()
				.duration(400)
				.ease("elastic",1 , .3)
				.attr("r", 3);
				
				
			}else if(size == "budget"){
				selected.transition()
				.duration(400)
				.ease("elastic",1 , .3)
				.attr("r", function(d) {return r_budget(d.budget); });
				
				
			}else if(size == "rating"){
				selected.transition()
				.duration(400)
				.ease("elastic",1 , .3)
				.attr("r", function(d) {return r_rating(d.rt_rating); });
				
			}else if(size == "pl"){	
				
				selected.transition()
				.duration(400)
				.ease("elastic",1 , .3)
				.attr("r", function(d) {return r_pl(d.pl); });

			}
		}
	};
	
	function search_select(bar_data){
		
		selected = chart.selectAll("circle")
					.filter(function(d){return d.film == bar_data.film;
								
			});

		$("#movie_title").html(bar_data.film);
		$("#movie_rating").html(formatPercent(bar_data.rt_rating));
		$("#movie_gross").html(formatCurrency(bar_data.ww_gross));
		$("#movie_profit").html(formatPercent(bar_data.profit));
		$("#movie_genre").html(bar_data.genre);
		$("#movie_budget").html(formatCurrency(bar_data.budget));
		$("#movie_year").html(bar_data.year);
		
		selected.style("fill", "#FF0000").style("opacity", 0.8).attr("class", "selected");
		
		if(size == "none"){

			selected
				.transition()
				.duration(0)
				.ease("elastic",1 , .3)
				.attr("r", 8)
					.transition()
					.delay(400)
					.duration(400)
					.ease("elastic",1 , .3)
					.attr("r", 3);

		}else if(size == "budget"){
				
			selected
				.transition()
				.duration(400)
				.ease("elastic",1 , .3)
				.attr("r", function(d) {return r_budget(d.budget) + 5; })
						.transition()
						.delay(400)
						.duration(400)
						.ease("elastic",1 , .3)
						.attr("r", function(d) {return r_budget(d.budget) ; });

		}else if(size == "rating"){
				
			selected
				.transition()
				.duration(400)
				.ease("elastic",1 , .3)
				.attr("r", function(d) {return r_rating(d.rt_rating) + 5 })
					.transition()
					.delay(400)
					.duration(400)
					.ease("elastic",1 , .3)
					.attr("r", function(d) {return r_rating(d.rt_rating)  });

		}else if(size == "pl"){	

			selected
				.transition()
				.duration(400)
				.ease("elastic",1 , .3)
				.attr("r", function(d) {return r_pl(d.pl) + 5; })
					.transition()
					.delay(400)
					.duration(400)
					.ease("elastic",1 , .3)
					.attr("r", function(d) {return r_pl(d.pl) ; });
		}
		
		
		


	};
	
	function search_deselect(){
		
		$("#movie_title").empty();
		$("#movie_rating").empty();
		$("#movie_gross").empty();
		$("#movie_profit").empty();
		$("#movie_genre").empty();
		$("#movie_budget").empty();
		$("#movie_year").empty();
		
		//alert("test");
		
		//alert(colour + " " + size);
			
			if(colour == "year"){

				chart.selectAll(".selected").style("fill", formatYearColour).style("opacity", 0.7);	

			}else if(colour == "genre"){

				chart.selectAll(".selected").style("fill", formatGenreColour).style("opacity", 0.7);	

			}else{

				chart.selectAll(".selected").style("fill", "#000").style("opacity", 0.7);	

			}

			if(size == "none"){

				chart.selectAll(".selected").attr("class", "")
					// .transition()
					// .duration(0)
					// .ease("elastic",1 , .3)
					.attr("r", 3);


			}else if(size == "budget"){
					
				chart.selectAll(".selected").attr("class", "")
					//.transition()
					//.duration(0)
					//.ease("elastic",1 , .3)
					.attr("r", function(d) {return r_budget(d.budget); });


			}else if(size == "rating"){
					
				chart.selectAll(".selected").attr("class", "")
					//.transition()
					//.duration(0)
					//ease("elastic",1 , .3)
					.attr("r", function(d) {return r_rating(d.rt_rating); });
					

			}else if(size == "pl"){	

				chart.selectAll(".selected").attr("class", "")
					//.transition()
					//.duration(0)
					//.ease("elastic",1 , .3)
					.attr("r", function(d) {return r_pl(d.pl); });

			}
				
		filter_multi(genres, years, budget_min,budget_max);
	}
	
	
	function lock(bar_data){
		
		var tmp_selected = chart.selectAll("circle")
					.filter(function(d){return d.film == bar_data.film;

		});
		
		var x_orig = parseFloat(tmp_selected.attr('cx'));
		
		$( "#search" ).val(bar_data.label);
		
		var val  = $("#search").val();

		for(var i=0;i<movie_data.length;i++){
			
			if(movie_data[i].label == val){
				
				search_deselect();
				search_select(movie_data[i]);
				
			}	
		}	
						
	}
	
	
	function filter_multi(genre_list, year_list, min_in, max_in){
		
		if(genre_list == undefined || year_list == undefined){
			
			tmp_selected_inverse = g.selectAll("circle");
			
		}else{
			
			tmp_selected = g.selectAll("circle")
						.filter(function(d){
							
							var match = 0;
								
							for(var i = 0; i < genre_list.length; i++){		

								if(d.genre == genre_list[i]){

									match++;

								}

							}
							
							for(var k = 0; k < year_list.length; k++){

								if(d.year == year_list[k]){

									match++;

								}
								
							}
							
							if(d.budget >= min_in && d.budget <= max_in){
								
									match++;
									
							}
							
							
							if(match == 3){
								
								return true;
								
							}else{
								
								return false;
							}
							
						});
						
			tmp_selected_inverse = g.selectAll("circle")
						.filter(function(d){
							
								var match = 0;

								for(var i = 0; i < genre_list.length; i++){		

									if(d.genre == genre_list[i]){

										match++;

									}

								}

								for(var k = 0; k < year_list.length; k++){

									if(d.year == year_list[k]){

										match++;

									}

								}
								
								if(d.budget <= min_in || d.budget >= max_in){
									
										return true;
										
								}
						

							if(match < 2){

								return true;

							}else{

								return false;
							}

						});
			
		}

			tmp_selected_inverse.transition().duration(0).attr("visibility", "hidden");
			tmp_selected.transition().duration(0).attr("visibility", "none");
		
	}
	
	function y_axis_init(){

		// Add the y-axis.
		y_axis_gross_g = g.append("svg:g")
		    	.attr("class", "y axis")
		    	.attr("transform", "translate(" + 0 + ",0)");
		
		y_axis_gross_g = g.append("svg:g")
		    	.attr("class", "y axis_ticks")
		    	.attr("transform", "translate(" + 0 + ",0)");
		
		g.select(".y.axis")
			.append("text")
			.attr("class", "y axis_label")
			.attr("transform", "rotate(-90)")
			.attr("y", -90)
			.attr("x", -325);

	}

	function x_axis_init(){

		// Add the x-axis.
		g.append("svg:g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + inner_h + ")");
		
			g.append("svg:g")
			    .attr("class", "x axis_ticks")
			    .attr("transform", "translate(0," + inner_h + ")");
			
		g.select(".x.axis")
			.append("text")
			.attr("class", "x axis_label")
			.attr("x", 160)
			.attr("y", 45);

	}
	
	function x_axis_percent(){

		g.selectAll(".x.axis").transition().duration(1000).call(xaxis_percent);
		g.selectAll(".x.axis_ticks").transition().duration(1000).call(xaxis_percent_ticks);
		
		g.selectAll(".x.axis_label")
			.transition().duration(1000)
			.attr("x", 200)
			.text("Percent");

	}
	
	function x_axis_budget(){

		g.selectAll(".x.axis").transition().duration(1000).call(xaxis_budget);
		g.selectAll(".x.axis_ticks").transition().duration(1000).call(xaxis_budget_ticks);
		
		g.selectAll(".x.axis_label")
			.transition().duration(1000)
			.attr("x", 215)
			.text("Budget ($m)");
	}
	
	
	function x_axis_rating_rt(){

		g.selectAll(".x.axis").transition().duration(1000).call(xaxis_percent);
		g.selectAll(".x.axis_ticks").transition().duration(1000).call(xaxis_percent_ticks);
		
		g.selectAll(".x.axis_label")
			.transition().duration(1000)
			.attr("x", 160)
			.text("Rotten Tomatoes Rating");
		
		

	}
	
	function x_axis_d_gross(){

		g.selectAll(".x.axis").transition().duration(1000).call(xaxis_d_gross);
		g.selectAll(".x.axis_ticks").transition().duration(1000).call(xaxis_d_gross_ticks);
		
		g.selectAll(".x.axis_label")
			.transition().duration(1000)
			.attr("x", 200)
			.text("Domestic Gross ($m)");
		
		

	}
	
	function x_axis_film(){

		g.selectAll(".x.axis").transition().duration(1000).call(xaxis_hide);
		g.selectAll(".x.axis_ticks").transition().duration(1000).call(xaxis_hide);
		
		g.selectAll(".x.axis_label")
			.transition().duration(1000)
			.attr("x", 180)
			.text("Film, ordered by Y-Axis");
		
		

	}
	
	function x_axis_f_gross(){

			g.selectAll(".x.axis").transition().duration(1000).call(xaxis_f_gross);
			g.selectAll(".x.axis_ticks").transition().duration(1000).call(xaxis_f_gross_ticks);

			g.selectAll(".x.axis_label")
				.transition().duration(1000)
				.attr("x", 200)
				.text("Foreign Gross ($m)");

	}
	
	
	function x_axis_rating_aud(){

		g.selectAll(".x.axis").transition().duration(1000).call(xaxis_percent);
		g.selectAll(".x.axis_ticks").transition().duration(1000).call(xaxis_percent_ticks);
		
		g.selectAll(".x.axis_label")
			.transition().duration(1000)
			.attr("x", 200)
			.text("Audience Rating");
		
		

	}
	
	function x_axis_opening(){

		g.selectAll(".x.axis").transition().duration(1000).call(xaxis_opening);
		g.selectAll(".x.axis_ticks").transition().duration(1000).call(xaxis_opening_ticks);
	
		g.selectAll(".x.axis_label")
			.transition().duration(1000)
			.attr("x", 210)
			.text("Opening ($m)");

	}

	function y_axis_gross(){

		g.selectAll(".y.axis").transition().duration(1000).call(yaxis_gross);
		g.selectAll(".y.axis_ticks").transition().duration(1000).call(yaxis_gross_ticks);
		
			g.selectAll(".y.axis_label")
				.transition().duration(1000)
				.text("Gross ($m)");

	}

	function y_axis_percent(){

		g.selectAll(".y.axis").transition().duration(1000).call(yaxis_percent);
		g.selectAll(".y.axis_ticks").transition().duration(1000).call(yaxis_percent_ticks);
		
		g.selectAll(".y.axis_label")
			.transition().duration(1000)
			.text("Audience Rating");

	}
	
	function y_axis_rating_aud(){

		g.selectAll(".y.axis").transition().duration(1000).call(yaxis_percent);
		g.selectAll(".y.axis_ticks").transition().duration(1000).call(yaxis_percent_ticks);
		
		g.selectAll(".y.axis_label")
			.transition().duration(1000)
			.text("Audience Rating");

	}

	function y_axis_profit(){

		g.selectAll(".y.axis").transition().duration(1000).call(yaxis_profit);
		g.selectAll(".y.axis_ticks").transition().duration(1000).call(yaxis_profit_ticks);
		
		g.selectAll(".y.axis_label")
			.transition().duration(1000)
			.text("Profit (%)");

	}
	
	function y_axis_pl(){

		g.selectAll(".y.axis").transition().duration(1000).call(yaxis_pl);
		g.selectAll(".y.axis_ticks").transition().duration(1000).call(yaxis_pl_ticks);
		
		g.selectAll(".y.axis_label")
			.transition().duration(1000)
			.text("Profit/Loss ($m)");

	}
	
	function y_axis_opening(){

		g.selectAll(".y.axis").transition().duration(1000).call(yaxis_opening);
		g.selectAll(".y.axis_ticks").transition().duration(1000).call(yaxis_opening_ticks);
		
		g.selectAll(".y.axis_label")
			.transition().duration(1000)
			.attr("x", -330)
			.text("Opening Weekend ($m)");

	}
	
	function y_axis_budget(){

		g.selectAll(".y.axis").transition().duration(1000).call(yaxis_budget);
		g.selectAll(".y.axis_ticks").transition().duration(1000).call(yaxis_budget_ticks);
		
		g.selectAll(".y.axis_label")
			.transition().duration(1000)
			.text("Budget ($m)");

	}


		//x=y dotted line (1:1 ratio) movement

		function init_xy(){

			g.append("line")
				.attr("class", "xy")
				.attr("x1", 0)
				.attr("x2", inner_w )
				.attr("y1", h + 20)
				.attr("y2", h + 20)
				.style("stroke", "#CCC")
				.style("stroke-width", "1px")
				.style("stroke-dasharray", "5 3");

		}

		function show_xy(){

			g.selectAll(".xy")
				.transition()
				.duration(1000)
				.attr("x1", 0)
				.attr("x2", inner_w)
				.attr("y1", inner_h)
				.attr("y2", 0)
				.style("stroke", "#666");

		}


		function hide_xy(){

			g.selectAll(".xy")
				.transition()
				.duration(1000)
				.attr("x1", 0)
				.attr("x2", inner_w)
				.attr("y1", h + 20)
				.attr("y2", h + 20)
				.style("stroke", "#CCC");

		}

		//100% profit line

		function init_prof_log(){

			g.append("line")
				.attr("class", "prof_log")
				.attr("x1", 0)
				.attr("x2", inner_w)
				.attr("y1", h + 100)
				.attr("y2", h + 100)
				.style("stroke", "#666")
				.style("stroke-width", "1px")
				.style("stroke-dasharray", "5 3");

		}

		function show_prof_log(){

			g.selectAll(".prof_log").transition()
				.duration(1000)
				.style("stroke", "#666")
				.attr("y1", y_profit_log(100))
				.attr("y2", y_profit_log(100))
				.attr("x1", 0)
				.attr("x2", inner_w);

		}


		function hide_prof_log(){

			g.selectAll(".prof_log").transition()
				.duration(1000)
				.style("stroke", "#fff")
				.attr("y1", h + 100)
				.attr("y2", h + 100)


		}

	
	
		});
	
				
});
