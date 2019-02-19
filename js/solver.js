define(["UTILS/utils_math", "UTILS/utils_reflection"], function( Utils_Math, Utils_reflection )
{
	/**
    * A module who solve/calcul operations ( with dynamics variables ) into  numeric values.
    * @param {operation[]} Array of operations.
    * @exports Solver
    * 
    */

	var Solver = function( operations )
	{
		var self = {};

		self.operations = operations;
		/**
	    * @method Method called to solve operations into a numeric value.
	    * @param {array} termsReplacer [{termId, obj, path}]is used to set dynamic variables
	    *	termId is the id of the term to replace, 
	    *	obj is the object containing the new value, 
	    *	path tell where is the property in obj
	    * @return {number} result of all operations 
	    */
		self.solve = function( termsReplacer )
		{
			if ( operations.length == 0 )
			{
				console.warn("Solver called with no operations");
				return 0;
			}

			termsReplacer = termsReplacer || [];
			if ( !Array.isArray( termsReplacer ) )
			{
				console.warn("Solver.solve : termsReplacer must be an array");
				termsReplacer = [];
			}
			operationsResults =  {};
			var result = 0;
			// Calcul all operations and store the result ( only the last iteration have the final result)
			self.operations.forEach( function( op )
			{
				result = calcul( op, operationsResults, termsReplacer );
			});

			return result;
		};
		
		/**
	    * @method Solve one operation into a numeric value and put it in operationsResults.
	    * @param {object} operationsResults is a container for intermediate results.
	    * @return {number} result of the operation
	    */	
		calcul = function( operation, operationsResults, termsReplacer )
		{
			// Get the 2 terms of the operation
			var term1 = getTerm( operation.term1, operationsResults, termsReplacer ), 
			term2 = getTerm( operation.term2, operationsResults, termsReplacer );

			// Calcul the result
			var result = Utils_Math.calcul( term1, operation.operator ,term2);
			operation.result = result;

			// Store the intermediate result
			setTerm( operation.id, result, operationsResults );
			return result;
		},

		/**
	    * @method Set an intermediate result in operationsResults ( term ).
	    * @param {string} id is the key of the new created property.
	    * @param {result} result of the operation
	    * @param {object} operationsResults is a container for intermediate results.
	    */
		setTerm = function( id, result, operationsResults )
		{
			operationsResults[ id ] = result;
		},

		/**
	    * @method Get an intermediate result from operationsResults or an already computed number .
	    * @param {string/number} term is a number or the id of the property we want to retrieve.
	    * @param {object} operationsResults is a container for intermediate results.
	    * @param {array} termsReplacer [{term, obj, path}] if used can replace terms .
	    * @result {number} return the term .
	    */
		getTerm = function( term, operationsResults, termsReplacer )
		{
			// If term is not a number it get it from operationsResults using term as a key
			if ( Utils_reflection.isNumber( term ))
			{
				return term;
			}

			// In case minus are not caught by REGEX. ( ex : -a )
			var minus_removed_term = term.replace("-",""); 
			// 	Try to retrieve the term from termsReplacer if provided
			if ( termsReplacer )
			{
				var result = getTermFromObjects( term, termsReplacer );
				if( result )
					return result;
				else
				{
					result = getTermFromObjects( minus_removed_term, termsReplacer );
					if ( result )
						return result * -1;
				}
			}

			var term_value = operationsResults[ term ];
			// If intermediate result is not on operationsResults
			// Check if it can find the term if we remove the minus 
			if ( !term_value && term_value != 0 )
			{
				term_value = operationsResults[ minus_removed_term ];
				if ( term_value || term_value == 0)
				{
					return term_value * -1;
				}
				else
				{
					console.error( "Solver.getTerm : Cant found the term : ", term );
					return term;
				}
			}
			// Return the value found in operationsResults
			else
			{
				return term_value;
			}
		};

		getTermFromObjects = function( term, termsReplacer )
		{
			var replacer = termsReplacer.find( (x)=> x.termId == term  );
			if ( replacer )
			{
				var result =  Utils_reflection.GetField( replacer.obj, replacer.path );
				if ( (result || result == 0 ) && Utils_reflection.isNumber( result ))
				{
					return result;
				}
				else
				{
					console.error( "solver.getTerm : ", result ," is not a numeric value using :", termsReplacer);
				}
			}

			return null;
		}



		return self;
	};
	
	return Solver ;
});    