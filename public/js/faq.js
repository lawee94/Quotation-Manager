
$(document).ready(function(){

  $(function(){
	$("#id_query").autocomplete({
    minLength: 1,
    source: "search/",
    });
  });

});