//disable scrolling for this page, only scrolling by buttons
document.body.style.overflow = 'hidden';

//scrolling to page sections from the navbar links
$(function () {
    $(".abt-link").on('click', function () {
        var position = $(".about").offset().top;
        $("HTML, BODY").animate({
            scrollTop: position
        }, 750);
    });
});
$(function () {
    $(".features-link").on('click', function () {
        var position = $(".features").offset().top;
        $("HTML, BODY").animate({
            scrollTop: position
        }, 750);
    });
});

//expand down arrow animation when mouse hovers over
$('.down-arrow').mouseenter(function () {
    $(this).css("cursor", "pointer");
    $(this).animate({ width: "50px", height: "50px" }, 'fast');
});

$('.down-arrow').mouseleave(function () {
    $(this).animate({ width: "30px", height: "30px" }, 'fast');
});

//animations for up and down arrow buttons on landing page
$(".landing-to-about").on("click", function () {
    var position = $(".about").offset().top;
    $("HTML, BODY").animate({
        scrollTop: position
    }, 750);
});

$(".about-to-features").on("click", function () {
    var position = $(".features").offset().top;
    $("HTML, BODY").animate({
        scrollTop: position
    }, 750);
});

$(".back-to-top").on("click", function () {
    var position = $(".navbar").offset().top;
    $("HTML, BODY").animate({
        scrollTop: position
    }, 750);
});

//landing button funtionality
$('.loginButton').on('click', function () {
    location.href = "./login";
});
$('.registerButton').on('click', function () {
    location.href = "./register";
});