define(["UTILS/utils_string", "UTILS/utils_regex", "./solver"], 
function( Utils_string, Utils_regex, Solver )
{
	/**
	 * Parse/decompose formula into operations with dynamic variables and solve them ( without using eval + regex )
	 * @exports FormuleParser
	 */

	var FormuleParser  = (function ( ) {});	
	/** Parsers container   */
	var parsers = {};
	/**
	 * @method Dipatch to internal Parser
	 * @param {string} formula is the string to parse
	 * @param {object} meta contain informations for the parser ( not really used here )
	 * @return Ordered array of operations or an instance of solver depending on meta.instantiateSolver.
	 */
	FormuleParser.parse = function( formula, meta )
	{		
		var parser = parsers[ meta.type ];
		if ( parser )
		{
			return parser( formula, meta );
		}
		else
		{
			return formula;
		}
	}

//****RESOLVE MAKER---------------------------------------------------------------------------------------------

    //KEEP PLUS/MINUS IN ORDER TO KEEP OPERATORS AND NUMBERS ORDER IN SYNC
    /** Regular expression to get "-+/*" operators  */
	var regexOperators	= /[-\+\/\*]/g;// /[0-9]\-|[\+\/\*]/g;
	/** Regular expression to get the terms : a, 1a, 1 , -1, -1a, -a, 1.5, -1.5*/
	var regexTerms = /-[0-9.]+[a-z_]+|-[0-9.]+|-[a-z_]+|[0-9.]+[a-z_]+|[0-9.]+|[a-z_]+/gi ;///-[0-9]+[a-z_]+|-[0-9]+|-[a-z_]+|[0-9]+[a-z_]+|[0-9]+|[a-z_]+/gi; // /-[0-9]+|[0-9]+/g;
	/** ENUM used when calling createOperations for expressiveness  */
	var ENUMisFirstCall = Object.freeze( { "YES" : true, "NO" : false } );

	/**
	 * @method Proxy for parsers.createOperations ( can be easily referenced by a string in FormuleParser.parse's meta)
	 * @param {string} formula is the string to parse
	 * @return Ordered array of operations or an instance of solver depending on meta.instantiateSolver.
	*/
    parsers.formulas = function( formula, meta )
	{
		var operations = parsers.createOperations( formula, ENUMisFirstCall.YES )

		if ( meta.instantiateSolver )
			return new Solver( operations );

		else
			return operations;
	}

	/**
	 * @method Decompose formula into an array of 2 terms operations ( is recursive in order to handle parenthesis )
	 * Result of operation become term in later operation using id property.
	 * Example: for "1+4/2"
	 			"[
	 				{"term1":"4","operator":"/","term2":"2","id":"a"},
	 				{"term1":"1","operator":"+","term2":"a","id":"b"}
	 			]" 
	 * @param {string} formula is the string to parse
	 * @param {boolean} isFirstCall is used to differentiate initial call to recursive one ( change the return value )
	 * @return {[operation]} Return an array of operations
	*/
    parsers.createOperations = function( formula, isFirstCall, operations, currentId )
	{
		operations = operations || [];
		currentId = currentId || { id:"a" };
		//RECURSIVLY RESOLVE PARENTESIS------------------------------------------------------------------------------
		// Find parenthesis and call createOperations with their content (one by one )
			formula = formula.replace(" ", "");
			var indexOfParentesis = 0, start;
			do 
			{
				// Find the first "(" 
				indexOfParentesis = formula.indexOf("(", start );
				// If found one
				if ( indexOfParentesis != -1 )
				{
					// Get the content of this parenthesis
	        		var contentParenthesis = Utils_string.getEnclosed( formula, indexOfParentesis, "(", ")");
	        		// Create operations from the content of the parenthesis
	        		// termId will be used to include the term in another operation
	        		var termId = parsers.createOperations( contentParenthesis.str, ENUMisFirstCall.NO, operations, currentId );
	        		// Replace the content of the parenthesis with the termId in the formule
	        		formula = Utils_string.replaceUsingIndex( formula, termId, contentParenthesis.start, contentParenthesis.end );
	        		// DEBUG PURPOSE
					//	start = contentParenthesis.start + termId.toString().length;
				}
			}
			while ( indexOfParentesis != -1 );

		//GET OPERATORS AND TERMS------------------------------------------------------------------------------

			var terms 		= Utils_regex.makeArray( formula, regexTerms );
			var operators 	= Utils_regex.makeArray( formula, regexOperators );

		//Resolve Division or Multiply------------------------------------------------------------------------------
			var operation_done = 0;
			operators.forEach( function( operator, index )
			{
				if ( operator == "*" || operator == "/" )
				{
					createAndPushOperation( terms, index -operation_done++ , operator,operations, currentId, formula );
				}
			});

		//Resolve ADD ( will also solve sub )------------------------------------------------------------------------------
			
			while( terms.length > 1 )
			{
				createAndPushOperation( terms, 0, "+", operations, currentId, formula);
			}
	
		//Return from the isFirstCall call
		if ( isFirstCall )
		{
			return operations;
		}

		//Return from the recursive call ( Parentesis )
		else
		{
			return terms[0];
		}
    }

    function createAndPushOperation( terms, index, operator, operations, currentId, formula )
	{
		var op = operationFabrick( terms, index, operator, currentId )
		operations.push( op );
	}

	/**
	 * @method Create an object literal who encapsulate informations of the operation
	 * Example for "4/2" :
	 * Example: {"term1":"4","operator":"/","term2":"2","id":"a"}
	 * @param {string[]} terms contain all terms used in the currents createOperations iteration
	 * @param {number} index point to the terms it will works with
	 * @param {string} operator can be ( +, -, *, /)
	 * @param {object} currentId is the last termId used
	 * @return {operation} return the operation object
	*/
    function operationFabrick( terms, index, operator, currentId )
	{
		var term1 = terms[index], 
		term2 = terms[index + 1];
		var op = 
		{
			term1,
			operator,
			term2,
			id: currentId.id,
		};

		// Get the id by incrementing currentId 
		currentId.id = String.fromCharCode( currentId.id.charCodeAt(0) + 1 );
		// Replace term1/term2 in terms by their id ( will be referenced in next operation by this id)
		terms.splice( index, 2, op.id );

		return op;
	}



    parsers.equation = function( equation )
	{
		var result = { left:"", rigth:"", operator:"=" };
		if ( !equation )
			return result;

		var formule_parts = equation.split(/[=><!]+/);
		result.left = formule_parts[0] || "";
		result.rigth = formule_parts[1] || "";
		var operator = equation.match(/[=><!]+/);
		result.operator = (operator.length > 0 )?  operator[0] : "=" ;

		return result;
	}

	return FormuleParser;
});