define(["solver"], function(Solver) {

    describe('Solver', function() {

        it('should solve operations', function() {
            var operations = JSON.parse( '['
                +'{"term1":"4","operator":"+","term2":"2","id":"a"}'
                +']' );

            expect(new Solver( operations ).solve()).toEqual(6);
            // 4 + -2
            operations[0].term2 *= -1;
            expect(new Solver( operations ).solve()).toEqual(2);
        });


        it('should solve substraction', function() {
            var operations = JSON.parse( '['
                +'{"term1":"4","operator":"-","term2":"2","id":"a"}'
                +']' );

            expect(new Solver( operations ).solve()).toEqual(2);

            //-4-2
            operations[0].term1 *= -1;
            expect(new Solver( operations ).solve()).toEqual(-6);
            //-4 - -2
            operations[0].term2 *= -1;
            expect(new Solver( operations ).solve()).toEqual(-2);
        });


        it('should solve multiplication', function() {
            var operations = JSON.parse( '['
                +'{"term1":"4","operator":"*","term2":"2","id":"a"}'
                +']' );
            expect(new Solver( operations ).solve()).toEqual(8);
            // 4 * -2
            operations[0].term2 *= -1;
            expect(new Solver( operations ).solve()).toEqual(-8);
        });


        it('should solve division', function() {
            var operations = JSON.parse( '['
                +'{"term1":"4","operator":"/","term2":"2","id":"a"}'
                +']' );

            expect(new Solver( operations ).solve()).toEqual(2);
            // 4 / -2
            operations[0].term2 *= -1;
            expect(new Solver( operations ).solve()).toEqual(-2);
        });


        it('should solve comnbined operations ', function() {
            //((5+5)/10-1+6*(10+10)-1.5)
            var operations = JSON.parse( '['
                +'{"term1":"5",     "operator":"+",     "term2":"5",     "id":"a"},'
                +'{"term1":"10",    "operator":"+",     "term2":"10",    "id":"b"},'
                +'{"term1":"a",     "operator":"/",     "term2":"10",    "id":"c"},'
                +'{"term1":"6",     "operator":"*",     "term2":"b",     "id":"d"},'
                +'{"term1":"c",     "operator":"+",     "term2":"-1",    "id":"e"},'
                +'{"term1":"e",     "operator":"+",     "term2":"d",     "id":"f"},'
                +'{"term1":"f",     "operator":"+",     "term2":"-1.5",  "id":"g"}'
                +']' );

            expect(new Solver( operations ).solve()).toEqual(118.5);
        });


        it('should solve operations with variables', function() {
            var dynamic_variables = 
            [{
                termId  :"a", 
                obj     :{x:26}, 
                path    :"x"
             }
            ];
            var operations = JSON.parse( '['
                +'{"term1":"1","operator":"+","term2":"-a","id":"a"}'
                +']' );

            expect(new Solver( operations ).solve( dynamic_variables )).toEqual(-25);
        });


        it('should solve operations with multiples variables', function() {
            var dynamic_variables = 
            [
                {
                    termId  :"x", 
                    obj     :{x:26}, 
                    path    :"x"
                },
                {
                    termId  :"y", 
                    obj     :{y:100}, 
                    path    :"y"
                }
            ];
            //1-x+y
            var operations = JSON.parse( '['
                +'{"term1":"1","operator":"+","term2":"-x","id":"a"},'
                +'{"term1":"a","operator":"+","term2":"y","id":"b"}'
                +']' );

            expect(new Solver( operations ).solve( dynamic_variables )).toEqual(75);
        });
    });

});