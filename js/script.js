		$(function() {

			var newSelection = "";
			$(".filter").show();
			$(".current").css("background-color", "#8CD4F8");
			
			$(".filter a").click(function(){
			
				$(".filter a").removeClass("current");
				$(this).addClass("current");
				
				newSelection = $(this).attr("rel");
			$(".current").css("background-color", "#8CD4F8");
				
				$(".content__object").not("."+newSelection).fadeTo(100, 0.1);
				$(".filter__cat").not(".current").css("background-color", "rgba(39, 48, 69, .2 )");
				$("."+newSelection).fadeTo(500, 1.0);
				
			});
			
		});