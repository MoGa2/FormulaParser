define([], function(){
	var Utils_reflection  = {};
	
	var isNumber = function( val )
	{
		return typeof val ==  "number";
	}

	Utils_reflection.isNumber = function(n) 
	{
	  return isNumber(n) || !isNaN(parseFloat(n)) && isFinite(n);
	}

	Utils_reflection.GetField = function( root, propertyPath, isArray )
	{
		if ( !propertyPath )
			return root;

		
		var subpaths = propertyPath.split('.');
		if ( isArray )
		{
			var result = [];
			root.forEach( function( el )
			{
				var currentObj = el;
				subpaths.forEach( function ( field ) 
				{ 
					if ( !currentObj )
						return;

					currentObj =  currentObj[ field ];
				});

				result.push( currentObj );
			});

			return result;
		}
		else
		{

			var currentObj = root;
			subpaths.forEach( function ( field ) 
			{ 
				if ( !currentObj )
					return;

				currentObj =  currentObj[ field ];
			});
				
			return currentObj;
		}
	}

	return Utils_reflection ;
});