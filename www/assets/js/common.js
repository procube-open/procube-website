/*-----------------------------------------
 common
-----------------------------------------*/
const tabW = 1024;
const spW = 599;
const path = location.pathname;


/*-----------------------------------------
 smoothScroll
-----------------------------------------*/
$('a').on("click", function() {
  if (($(this).attr("target") || "") === "_blank") return;

  let href = $(this).attr("href");

  if (href.includes("#")) {
    if (href.startsWith("#")) {
      let headerHeight = $(".js-headerInner").innerHeight();
      let speed = 1000;
      let target = $(href == "#" || href == "" ? "html" : href);
      let position = target.offset().top - headerHeight;

      $("body, html").animate({ scrollTop: position }, speed, "swing");
      return false;
    } else {
      setTimeout(() => location.reload(), 500);
    }
  }
});


/*-----------------------------------------
 smoothScroll（otherPage）
-----------------------------------------*/
const hash = location.hash;

if(hash){
  $("body,html").stop().scrollTop(0);
  setTimeout(function(){
    let headerHeight = $(".js-headerInner").innerHeight();
    let speed = 1000;
    let target = $(hash);
    let position = target.offset().top - headerHeight;

    $("body,html").animate({ scrollTop: position }, speed, "swing");

    history.replaceState("", document.title, window.location.pathname);
  }, 500);
}


/*-----------------------------------------
 scrolltop
-----------------------------------------*/
$(".js-scrolltop").on("click", function() {
  let speed = 1000;

  $("body, html").animate({ scrollTop: 0 }, speed, "swing");
});

$(window).on('scroll', function() {
  if($(this).scrollTop() > 100) {
    $(".js-scrolltop").fadeIn();
  } else {
    $(".js-scrolltop").fadeOut();
  }
});


/*-----------------------------------------
 slider01
-----------------------------------------*/
$(".js-slider01").each(function (index) {
  const $slider = $(this);
  const $slides = $slider.find(".splide__slide");
  const slideLength = $slides.length;

  $slides.each(function (i) {
    const num = String(i + 1).padStart(2, '0');
    $(this).attr("data-num", num);
  });

  const slider = new Splide($slider[0], {
    type: 'loop',
    rewind: true,
    autoWidth: true,
    speed: 3000,
    arrows: false,
    drag: false,
    interval: 6000,
    autoplay: true,
    trimSpace: 'move',
    updateOnMove: true,
    pauseOnHover: false,
    pauseOnFocus: false,
    resetProgress: false,
    breakpoints: {
      1023: {
        focus: 'center',
        drag: true,
      },
    },
  });

  slider.mount();
});


/*-----------------------------------------
 headerCurrent
-----------------------------------------*/
const pageType = $(".js-main").data("page");

$(".js-headerCurrent").each(function () {
  if (pageType === $(this).data("page")) {
    $(this).attr("aria-current", true);
  }
});


/*-----------------------------------------
 headerNav
-----------------------------------------*/
function headerNavBtnReset() {
  $(".js-headerNavBtn").attr("aria-expanded", false);
  $(".js-headerNavMenu").fadeOut().attr("aria-hidden", true);
  $("html").css("overflow", "visible");
}

$(".js-headerNavBtn").on("click", function() {
  if($(this).attr("aria-expanded") === "false") {
    headerNavBtnReset();

    $(this).attr("aria-expanded", true);
    $(this).next(".js-headerNavMenu").fadeIn().attr("aria-hidden", false);
    $(".js-headerBgPc").fadeIn();
    $("html").css("overflow", "hidden");
  } else {
    $(this).attr("aria-expanded", false);
    $(this).next(".js-headerNavMenu").fadeOut().attr("aria-hidden", true);
    $(".js-headerBgPc").fadeOut();
    $("html").css("overflow", "visible");
  }
});

$(".js-headerBgPc").on("click", function() {
  headerNavBtnReset();
  $(this).fadeOut();
});

$(window).on("resize", function() {
  if(window.innerWidth < tabW) {
    headerNavBtnReset();
    $(".js-headerBgPc").fadeOut();
  }
});


/*-----------------------------------------
 headerHam
-----------------------------------------*/
function headerHamReset() {
  $(".js-headerHamBtn").attr("aria-expanded", false);
  $(".js-headerHamMenu").attr("aria-hidden", true).fadeOut();
  $(".js-headerBgSp").fadeOut();
  $("html").css("overflow", "visible");
}

$(".js-headerHamBtn").on("click", function() {
  if($(this).attr("aria-expanded") === "false") {
    $(this).attr("aria-expanded", true);
    $(this).next(".js-headerHamMenu").fadeIn().attr("aria-hidden", false);
    $(".js-headerBgSp").fadeIn();
    $("html").css("overflow", "hidden");
  } else {
    $(this).attr("aria-expanded", false);
    $(this).next(".js-headerHamMenu").fadeOut().attr("aria-hidden", true);
    $(".js-headerBgSp").fadeOut();
    $("html").css("overflow", "visible");
  }
});

$(".js-headerBgSp").on("click", headerHamReset);

$(window).on("resize", function() {
  if(tabW <= window.innerWidth) {
    headerHamReset()
  }
});


/*-----------------------------------------
 headerHamMenuCatch
-----------------------------------------*/
$(".js-headerHamMenuCatchBtn").on("click", function() {
  if($(this).attr("aria-expanded") === "false") {
    $(".js-headerHamMenuCatchBtn").attr("aria-expanded", false);
    $(".js-headerHamMenuCatchRead").slideUp();
    $(".js-headerHamMenuCatchDetail").attr("aria-hidden", true).slideUp();

    $(this).attr("aria-expanded", true);
    $(this).children(".js-headerHamMenuCatchRead").slideDown();
    $(this).next(".js-headerHamMenuCatchDetail").attr("aria-hidden", false).slideDown();
  } else {
    $(this).attr("aria-expanded", false);
    $(this).children(".js-headerHamMenuCatchRead").slideUp();
    $(this).next(".js-headerHamMenuCatchDetail").attr("aria-hidden", true).slideUp();
  }
});

$(".js-headerHamMenuCatchBtn").each(function() {
  if (pageType === $(this).data("page")) {
    $(this).attr("aria-current", true);
    $(this).attr("aria-expanded", true);
    $(this).next(".js-headerHamMenuCatchDetail").attr("aria-hidden", false).slideDown();
  }
});

const currentPath = location.pathname.replace(/\/$/, "");

$(".js-headerHamMenuCatchCurrent").each(function () {
  let linkPath = $(this).attr("href").replace(/\/$/, "");

  if (currentPath === linkPath) {
    $(this).attr("aria-current", "page");
  }
});


/*-----------------------------------------
 newsMore
-----------------------------------------*/
$(".js-newsMoreList").each(function() {
  let set = 10;
  let total = $(this).children(".js-newsMoreItem").length;

  $(this).children(".js-newsMoreItem").attr("aria-hidden", true).hide();
  $(this).children(".js-newsMoreItem:lt(" + set + ")").attr("aria-hidden", false).show();

  if(set >= total) {
    $(".js-newsMoreBtnWrap").attr("aria-hidden", true).hide();
  }

  $(".js-newsMoreBtn").on("click", function() {
    set += 5;
    $(".js-newsMoreList").children(".js-newsMoreItem:lt(" + set + ")").attr("aria-hidden", false).slideDown();

    if(set >= total) {
      $(".js-newsMoreBtnWrap").attr("aria-hidden", true).slideUp();
    }
  });
});