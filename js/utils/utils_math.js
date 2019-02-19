define([], function(){
	var Utils_Math  = {}
	
	var signToOperationName = 
	{
		"+":"add",
		"*":"mul",
		"/":"div",
		"-":"sub"
	};

	Utils_Math.calcul = function( term1, operator, term2 )
	{		
		term1 = parseFloat( term1 );
		term2 = parseFloat( term2 );

		var operation = operations[ signToOperationName[ operator ] ];
		if ( operation )
		{
			return operation( term1, term2 );
		}
		else
		{
			console.warn( "Utils_Math.calcul : can't found operations for operator : ", operator);
			return -22;
		}
	}

	var operations = {};

	operations.add = function( term1, term2 ) 
	{
		return term1 + term2;
	};	
	operations.sub = function( term1, term2 ) 
	{
		return term1 - term2;
	};
	operations.mul = function( term1, term2 )
	{
		return term1 * term2;
	};	

	operations.div = function( term1, term2 )
	{
		return term1 / term2;
	};



	return Utils_Math ;
});