define([], function()
{
	var Utils_regex = {};

	Utils_regex.iterator = function(str, regex, payload ) 
	{
		while ((m = regex.exec(str)) !== null) 
		{
		    if (m.index === regex.lastIndex) 
		    {
		        regex.lastIndex++;
		    }
		    
		    m.forEach((match, groupIndex) => 
		    {
		    	payload( match, groupIndex );
		    });
		}
	}

	Utils_regex.makeArray = function( str, regex )
	{
		var arr = [];
		Utils_regex.iterator( str, regex, (match)=> arr.push(match) );

		return arr;
	}

	return Utils_regex;
});