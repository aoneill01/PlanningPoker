$(function () {
    for (var i = 0; i < 5; i++) {
        setTimeout(foo(i + 1), i * 200);
    }

    var picked = false;
    $('#pick').click(function () {
        if (!picked) {
            $('.hand').addClass('pick');
            $(this).html("Flip!");
            picked = true;
        } else {
            $('.hand').addClass('flip');
            $(this).css('display', 'none');
        }
    });
});

function foo(nth) {
    return function () {
        think(nth);
        setInterval(think(nth), 2000);
    }
}

function think(nth) {
    return function () {
        $('.hand .card:nth-child(' + nth + ')').addClass('think');
        setTimeout(function () {
            $('.hand .card:nth-child(' + nth + ')').removeClass('think');
        }, 500);
    };
}