define(["formuleParser"], function(formuleParser) {

    describe('formuleParser', function() {

        it('should parse operations', function() {
            var meta = { type:"formulas", instantiateSolver:false};
            var operations = formuleParser.parse("1+10", meta);
            expect(operations.length).toEqual(1);

            var op = operations[0];
            expect(op.term1).toEqual("1");
            expect(op.term2).toEqual("10");
            expect(op.operator).toEqual("+");

        });

        it('should parse substractions', function() {
            var meta = { type:"formulas", instantiateSolver:false};
            var operations = formuleParser.parse("1-10", meta);
            expect(operations.length).toEqual(1);

            var op = operations[0];
            expect(op.term1).toEqual("1");
            expect(op.term2).toEqual("-10");
            expect(op.operator).toEqual("+");

        });

        it('should parse multiplications', function() {
            var meta = { type:"formulas", instantiateSolver:false};
            var operations = formuleParser.parse("1*10", meta);
            expect(operations.length).toEqual(1);

            var op = operations[0];
            expect(op.term1).toEqual("1");
            expect(op.term2).toEqual("10");
            expect(op.operator).toEqual("*");

        });

        it('should parse divisions', function() {
            var meta = { type:"formulas", instantiateSolver:false};
            var operations = formuleParser.parse("1/10", meta);
            expect(operations.length).toEqual(1);

            var op = operations[0];
            expect(op.term1).toEqual("1");
            expect(op.term2).toEqual("10");
            expect(op.operator).toEqual("/");

        });

        it('should parse decimal', function() {
            var meta = { type:"formulas", instantiateSolver:false};
            var operations = formuleParser.parse("1.1*10", meta);
            expect(operations.length).toEqual(1);

            var op = operations[0];
            expect(op.term1).toEqual("1.1");
            expect(op.term2).toEqual("10");
            expect(op.operator).toEqual("*");

        });

        it('should parse decimal ( .1 for 0.1 )', function() {
            var meta = { type:"formulas", instantiateSolver:false};
            var operations = formuleParser.parse(".1*10", meta);
            expect(operations.length).toEqual(1);

            var op = operations[0];
            expect(op.term1).toEqual(".1");
            expect(op.term2).toEqual("10");
            expect(op.operator).toEqual("*");

        });

        it('should parse parenthese', function() {
            var meta = { type:"formulas", instantiateSolver:false};
            var operations = formuleParser.parse("(1+1)", meta);
            expect(operations.length).toEqual(1);

            var op = operations[0];
            expect(op.term1).toEqual("1");
            expect(op.term2).toEqual("1");
            expect(op.operator).toEqual("+");

        });

        it('should parse several parentheses', function() {
            var meta = { type:"formulas", instantiateSolver:false};
            var operations = formuleParser.parse("(1+1) * (2+5)", meta);
            expect(operations.length).toEqual(3);

            var op = operations[0];
            expect(op.term1).toEqual("1");
            expect(op.term2).toEqual("1");
            expect(op.operator).toEqual("+");

            var op2 = operations[1];
            expect(op2.term1).toEqual("2");
            expect(op2.term2).toEqual("5");
            expect(op2.operator).toEqual("+");

            var op3 = operations[2];
            expect(op3.term1).toEqual("a");
            expect(op3.term2).toEqual("b");
            expect(op3.operator).toEqual("*");

        });

        it('should order operations by priority', function() {
            var meta = { type:"formulas", instantiateSolver:false};
            var operations = formuleParser.parse("1+1 * (2+2)", meta);
            expect(operations.length).toEqual(3);

            var op = operations[0];
            expect(op.term1).toEqual("2");
            expect(op.term2).toEqual("2");
            expect(op.operator).toEqual("+");

            var op2 = operations[1];
            expect(op2.term1).toEqual("1");
            expect(op2.term2).toEqual("a");
            expect(op2.operator).toEqual("*");

            var op3 = operations[2];
            expect(op3.term1).toEqual("1");
            expect(op3.term2).toEqual("b");
            expect(op3.operator).toEqual("+");

        });

    });

});