requirejs(["./FormuleParser" ], 
			
			
function( FormuleParser ){

	rm = { type:"formulas"};
	formule = "1+1";
	expression = FormuleParser.parse( formule, rm );
	window.Utils_parse = FormuleParser;

});