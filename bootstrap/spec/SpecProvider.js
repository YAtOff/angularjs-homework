describe('Provider specification', function() {

    var newTwo = function() {
        return 3;
    };

    Provider.service('OnePlusTwo', function OnePlusTwo(One, Two) {
        return function() {
            return One() + Two();
        };
    });
    Provider.service('One', function One() {
        return function() {
            return 1;
        };
    });
    Provider.service('Two', function Two() {
        return function() {
            return 2;
        };
    });
    Provider.service('TwoPlusTwo', function OnePlusTwo(Two) {
        return function() {
            return Two() + Two();
        };
    });

    it('resolves dependencies', function() {
        var onePlusTwo = Provider.get('OnePlusTwo');
        expect(onePlusTwo()).toEqual(3);
    });

    it('locals override dependencies', function() {
        var onePlusTwo = Provider.get('TwoPlusTwo', {Two: newTwo});
        expect(onePlusTwo()).toEqual(6);
    });

});
