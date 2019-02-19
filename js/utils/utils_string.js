define([], function()
{
	var Utils_string = {};

	Utils_string.endsWith = function(str, suffix) 
	{
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}

	Utils_string.replaceUsingIndex = function(str, replacer, start, end)
	{
		return str.substr(0, start) + replacer + str.substr(end);
	}

	Utils_string.getEnclosed = function(str, start, opener, closer) 
	{
		var i =start + 1, nbr_to_find = 1, char;
		while( i < str.length )
		{
			char = str[i++];
			if ( char == opener )
				nbr_to_find++;
			else if ( char == closer )
				nbr_to_find--

			if ( nbr_to_find == 0 )
			{
				return { str :str.substring( start + 1, i- 1 ), start, end:i };
			}
		}
		console.warn( "parenthése not closed" );
		return null;
	}

	return Utils_string;
});