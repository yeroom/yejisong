// 스크롤 유무
$.fn.hasVerticalScrollbar = function() {
    return this.get(0).scrollHeight > this.height();
}

// Scroll End
var ignoreScroll = false;
var ns = (new Date).getTime();
var special = $.event.special;
var dispatch = $.event.handle || $.event.dispatch;
var scroll = 'scroll';
var scrollEnd = scroll + 'end';
var nsScrollEnd = scroll + '.' + scrollEnd + ns
special.scrollend = {
    delay: 300,
    setup: function() {
        var pid, handler = function(e) {
            var _this = this,
                args = arguments;

            clearTimeout(pid);
            pid = setTimeout(function() {
                e.type = scrollEnd;
                dispatch.apply(_this, args);
            }, special.scrollend.delay);
        };

        $(this).on(nsScrollEnd, handler);
    },
    teardown: function() {
        $(this).off(nsScrollEnd);
    }
};

// Touch Prevent
function lockTouch(e) {
    e.stopImmediatePropagation();
}

// is Mobile
function _isMobile() {
    var isMobile = (/iphone|ipod|android|blackberry|fennec/).test(navigator.userAgent.toLowerCase());
    return isMobile;
}

// Responsive 이미지 변환
function ResponsiveImagesNew() {
    $(".imgResponsive").each(function() {
        var winW = window.innerWidth;
        if (winW > 1023 && $(this).attr("data-media-type") != "pc") {
            var url = $(this).attr("data-src-pc");
            $(this).attr("data-media-type", "pc");
            chgImg($(this), url, "pc");
        }
        if (winW <= 1023 && $(this).attr("data-media-type") != "mobile") {
            var url = $(this).attr("data-src-mobile");
            $(this).attr("data-media-type", "mobile");
            chgImg($(this), url, "mobile");
        }
    });

    function chgImg($target, url, type) {
        $target.attr("src", url);
        $target.attr("data-media-type", type);
    }
}

// allmenuUI
function allmenuUI(){
	var el = $('.layerAllmenu');
	var header = $('#header');
	var dscrollTop;

	if(el.length <= 0){
		return;
	}

	// Open
	$(document).on('click' , '.btnHeadAllmenu', function(e){
		e.preventDefault();
		dscrollTop = $(document).scrollTop();

		el.after('<div class="layerAllmenuBg"></div');

		el.addClass('open');
		TweenMax.to(el.next('.layerAllmenuBg') , 0.3 , {display : 'block' , opacity : 1});
		document.addEventListener('touchmove' , lockTouch, false);

		el.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
			$('html').addClass('closeHidden');
			$('html').css({height : $('.wrap').outerHeight(true)});
			$('html, body').scrollTop(dscrollTop);
		});

		 // 타켓이 바깥일 경우
		 $(document).off('click.closeAllmenu touchmove.closeAllmenu touchend.closeAllmenu').on('click.closeAllmenu touchmove.closeAllmenu touchend.closeAllmenu' ,'.layerAllmenuBg',  function(e){
			el.removeClass('open');
			$('html').removeClass('closeHidden');
			$('html').css({height : ''});

			el.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
				el.next('.layerAllmenuBg').stop().fadeOut(function(){
					$(this).remove();
				});
				document.removeEventListener('touchmove' , lockTouch, false);
			});
        });
	});

	// Close
	el.find('.btnAllmenuClose').on('click' , function(e){
		e.preventDefault();

		el.removeClass('open');
		$('html').removeClass('closeHidden');
		$('html').css({height : ''});

		el.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
			el.next('.layerAllmenuBg').stop().fadeOut(function(){
				$(this).remove();
			});
			document.removeEventListener('touchmove' , lockTouch, false);

		});
	});
}

// 아코디언
function accodianUI() {
    var el = $('.accordianList');

    if (el.length <= 0) {
        return;
    }

    el.find('>ul>li').removeClass('on');

    bindEvents();

    function bindEvents() {
        el.find('>ul>li>dl>dt>a').off('click.accodianEvt').on('click.accodianEvt', function(e) {
            e.preventDefault();

            var index = $(this).closest('li').index();

            $(this).closest(el).find('>ul>li').each(function(idx, obj) {
                if (idx == index) {
                    if ($(obj).hasClass('on')) {
                        $(obj).removeClass('on');
                    } else {
                        $(obj).addClass('on');
                    }
                } else {
                    $(obj).removeClass('on');
                }
            });

        });
    }
}

// 탭 메뉴
function tabUI() {
	var el = $('.tabsGroup');

	if(el.length <= 0){
		return;
	}

	el.each(function(idx, obj){
		if($(obj).find('.tabs > li').hasClass('on')){
			$(obj).find('.tabs > li').each(function(){
				var idx = $(this).filter('.on').index();
				if(idx >= 0){
					$(obj).find('.tabs > li').eq(idx).addClass('on').siblings().removeClass('on');
					$(obj).find('> .tabsCont').hide().eq(idx).show();
				}

			});
		}
		else{
			$(obj).find('.tabs > li').eq(0).addClass('on').siblings().removeClass('on');
			$(obj).find('> .tabsCont').hide().eq(0).show();
		}

		bindEvents(obj);
	});


	function bindEvents(obj){
		var $this = $(obj);

		$this.find('.tabs > li > a').on('click', function(e){
			e.preventDefault();

			var index = $(this).closest('li').index();

			if($this.find('> .tabsCont').eq(index).length <= 0){
				return;
			}

			$(this).closest(el).find('.tabs > li').eq(index).addClass('on').siblings().removeClass('on');
			$(this).closest(el).find('> .tabsCont').hide().eq(index).show();
		});

	}
}

// scrollAnimation
function scrollAnimation(){
	var lastScroll = 0;
	var ignoreScroll = false;
	$(document).off('scroll.scrollEvent').on('scroll.scrollEvent', function(e){
		var sct = $(this).scrollTop();

		if(ignoreScroll){
			return;
		}

		$('[data-motion="bottom-fade-in"]').each(function(idx, obj){
			if(sct + window.innerHeight <= $(obj).offset().top + 10){
				$(obj).removeClass('is-fade');
			}
			else{
				$(obj).addClass('is-fade');
			}

			if(sct + window.innerHeight  >= $('#footer').offset().top + $('#footer').outerHeight(true) - 100){
				$(obj).addClass('is-fade');
			}

			/*
			if(sct <= 100){
				$(obj).removeClass('is-fade');
			}
			*/

		});

		var objPoint = ($('html').hasClass('ui-w')) ? window.innerHeight / 2 : window.innerHeight - 100;

		if(sct + objPoint >= $('.mainSec.portfolio').offset().top && sct + objPoint <= $('#footer').offset().top){
			$('.btnPdfWrap').addClass('white');
		}
		else{
			$('.btnPdfWrap').removeClass('white');
		}

		if(sct + 100 >= $('.mainSec.portfolio').offset().top && sct + 100 <= $('#footer').offset().top){
			$('#header').addClass('white');
		}
		else{
			$('#header').removeClass('white');
		}

		lastScroll = sct + window.innerHeight;

	}).trigger('scroll.scrollEvent');
}

// LayerPopup
var idxLayPop = 0;
var fscrollTop = 0;
var cursorClone;
var isitClick = false;
function modalPop(n, target, event){
	if(n == 'open'){
		fscrollTop = $(document).scrollTop();
		idxLayPop = idxLayPop + 1;

		isitClick = true;

		if(target == '#portfolioPop'){
			var pcViewUrl1 = $(event).attr('data-pc-view-url1');
			var pcViewUrl2 = $(event).attr('data-pc-view-url2');
			var pcViewUrl3 = $(event).attr('data-pc-view-url3');

			var mobileViewUrl1 = $(event).attr('data-mobile-view-url1');
			var mobileViewUrl2 = $(event).attr('data-mobile-view-url2');
			var mobileViewUrl3 = $(event).attr('data-mobile-view-url3');

			if($('html').hasClass('ui-m')){
				setTimeout(function(){
					$('html').addClass('closeHidden');
				}, 100);
			}

			$('.modalPop'+target).find('.bodyArea').find('img').remove();
			$('.modalPop'+target).find('.bodyArea').append('<img src="'+ pcViewUrl1 +'" data-src-pc="'+ pcViewUrl1 +'" data-src-mobile="'+ mobileViewUrl1 + '" alt="" class="imgResponsive">');

			if(pcViewUrl2.length >= 1 && mobileViewUrl2.length >= 1){
				$('.modalPop'+target).find('.bodyArea').append('<img src="'+ pcViewUrl2 +'" data-src-pc="'+ pcViewUrl2 +'" data-src-mobile="'+ mobileViewUrl2 + '" alt="" class="imgResponsive">');
			}

			if(pcViewUrl3.length >= 1 && mobileViewUrl3.length >= 1){
				$('.modalPop'+target).find('.bodyArea').append('<img src="'+ pcViewUrl3 +'" data-src-pc="'+ pcViewUrl3 +'" data-src-mobile="'+ mobileViewUrl3 + '" alt="" class="imgResponsive">');
			}

			$(window).trigger('resize');
		}

		if(target == '#contactPop'){
			$('.contactIntroduce .title').find('em').remove();
			setTimeout(function(){
				$('.contactIntroduce .title').typeChar({
					html: $('<em>We want<br class="wHide"> to <br class="mHide">talk<br class="wHide"> about<br>your<br class="wHide"> project.</em>'),
					completed: $.noop
				  });
			}, 100);
		}

		TweenMax.set($('.modalPop'+target), {display : 'block', zIndex : 1000 + idxLayPop});
		TweenMax.set($('.ui-w .modalPop'+target), {right : -17});
		TweenMax.set($('.modalPop'+target).find('.modalPopArea .bodyArea'), {y : 50});

		cursorClone = $('.cursor').clone(true).addClass('clone');
		$('.cursor').removeClass('is-img-hover').removeClass('is-hover');
		$('.cursor').after(cursorClone);
		$('.cursor.clone').addClass('is-popup').show();

		if(target == '#contactPop'){
			$('.cursor.clone').addClass('bgBlack');
		}

		var scaleRate = 0;
		if($('html').hasClass('ui-w')){
			scaleRate = (target == '#portfolioPop') ? 40 : 70;
		}
		else if($('html').hasClass('ui-m')){
			scaleRate = (target == '#portfolioPop') ? 20 : 30;
		}

		//$(document).trigger('mousemove');

		setTimeout(function(){
			TweenMax.set($('.modalPop'+target), {opacity : 1});
			$('.modalPop'+target).find('.modalBody').scrollTop(0);
		}, 400);

		TweenMax.to('.cursor.clone' , 0.55 , {scale : scaleRate, ease : 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'});

		TweenMax.to('.cursor.clone' , 0.55 , {delay : 0.5, opacity : 0, ease : 'cubic-bezier(0.550, 0.055, 0.675, 0.190)', onComplete : function(){
			if($('html').hasClass('ui-w')){
				$('html').addClass('closeHidden');
			}
			$('html').css({height : $(document).outerHeight(true)});

			TweenMax.set($('.ui-w .modalPop'+target), {right : 0});

			TweenMax.set('.cursor.clone' , {clearProps: "all"});
			$('.cursor.clone').remove();

			isitClick = false;
		}});


		//TweenMax.to($('.modalPop'+target), 0.5 , {delay : 0.4 , opacity : 1});
		TweenMax.to($('.modalPop'+target).find('.modalPopArea .bodyArea'), 0.5 , {delay : 0.55 , y : 0});
		document.addEventListener('touchmove' , lockTouch, false);

		if(target == '#contactPop'){
			$('.modalPop.contactSub .modalBody').trigger('scroll.contactScroll');
		}

	}else{
		if(isitClick == true){
			return;
		}

		TweenMax.set($('.modalPop'+target) , {clearProps: "all"});
		$('html').removeClass('closeHidden').css({height : ''});
		document.removeEventListener('touchmove' , lockTouch, false);

		if(target == '#contactPop'){
			$('.contactIntroduce .title').find('em').remove();
		}

		$(document).scrollTop(fscrollTop);
	}
}

// scrollState
function scrollState(){
	var wrap = $('.wrap');
	var footer = $('#footer');
	var lastScroll = 0;

	if(wrap.length <= 0){
		return;
	}

	$(document).off('scroll.commScroll touchmove.commScroll touchend.commScroll').on('scroll.commScroll touchmove.commScroll touchend.commScroll', function(){
		var sct = $(this).scrollTop();

		if(sct < lastScroll || sct == 0){
			if(sct + window.innerHeight < $('.container').offset().top + $('.container').height() ){
				wrap.addClass('scrollUp');
				wrap.removeClass('scrollDown');

				wrap.removeClass('footerHide');
			}
		}
		else{
			wrap.removeClass('scrollUp');
			wrap.addClass('scrollDown');
		}

		lastScroll = sct;
	}).trigger('scroll.commScroll').trigger('touchmove.commScroll').trigger('touchend.commScroll');
}

// portfolioHover
function portfolioHover(){
	var el = $('.portfolioList');

	if(el.length <= 0){
		return;
	}

	el.find('.item').each(function(idx, obj){
		var portfolioItem = $(obj);

		portfolioItem.on('mousemove', function(e) {
			var mouseCoords = $(this)[0].getBoundingClientRect();
			var moveX = e.clientX - mouseCoords.left - mouseCoords.width / 2;
			var moveY = e.clientY - mouseCoords.top - mouseCoords.height / 2;

			// TweenMax.to(portfolioItem.find('.itemInner'), {
			// 	x: 0.1 * moveX,
			// 	y: 0.1 * moveY,
			// 	rotateX : 0.005 * -moveY,
			// 	rotateY : 0.005 * moveX
			// });

			if(moveX >= 0){
				portfolioItem.addClass('mouseHover');
			}
			else{
				portfolioItem.removeClass('mouseHover');
			}
		});

		portfolioItem.on('mouseleave', function(e) {
			portfolioItem.removeClass('mouseHover');
			// TweenMax.to(portfolioItem.find('.itemInner'), 0.6, {
			// 	x: 0,
			// 	y: 0,
			// 	rotateX: 0,
			// 	rotateY : 0,
			// })

		});
	});
}

// listHistoryMore
function listHistoryMore(){
	var el = $('.historyList');

	if(el.length <= 0){
		return;
	}

	var listLength = el.find('.item').length;
	el.closest('.historyArea').find('.title em').text(listLength);
	
	if(el.find('.item').length >= 10){
		el.find('.item').hide();
		el.find('.item').slice(0, 10).show();

		$('.textMore').click(function(e){
			e.preventDefault();

			$('.loadingWrap').addClass('is-active');

			setTimeout(function(){
				$('.loadingWrap').removeClass('is-active');
				el.find('.item:hidden').slice(0, 10).show(); // 숨김 설정된 다음 n개 표시
				if(el.find('.item:hidden').length == 0){ // 숨겨진 DIV가 있는지 체크해서 없으면 more 버튼 숨기기
					$('.textMore').hide();
				}
			}, 1800);
		});
	}
	else {
		el.next('.btnArea').hide();
	}
}

// imgCursorHover
function imgCursorHover(){
	var cursor = document.querySelector(".cursor:not(.clone)");

	document.querySelectorAll("a, button").forEach(function (el) {
		el.addEventListener("mouseover", function () {
			cursor.classList.add('is-hover');
		});

		el.addEventListener("mouseout", function () {
			cursor.classList.remove('is-hover');
		  });
	});

	document.querySelectorAll("a img, a .thumb").forEach(function (el) {
		el.addEventListener("mouseover", function () {
			cursor.classList.add('is-img-hover');
		});

		el.addEventListener("mouseout", function () {
			cursor.classList.remove('is-img-hover');
		  });
	});

	 document.addEventListener("mouseout", () => {
      cursor.style.display = "none";
    });
}

$(function() {
    ResponsiveImagesNew();
    $(window).resize(function() {
        ResponsiveImagesNew();
    }).resize();
    accodianUI();
	scrollAnimation();
	tabUI();
	allmenuUI();
	scrollState();
	//portfolioHover();
	//listHistoryMore();
	//imgCursorHover();

	var vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty("--vh", `${vh}px`);

	window.addEventListener("resize", () => {
		var vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty("--vh", `${vh}px`);
	});

	function initDocumentMousemoveEventListener() {
		var $body = $('body')[0];
		$body.addEventListener('mousemove', documentMousemoveEventHandler, false);
		setMousePosition(window.innerWidth / 2, window.innerHeight / 2);
	}

	function documentMousemoveEventHandler(event) {
		var client_x = event.clientX;
		var client_y = event.clientY;
		setMousePosition(client_x, client_y);
	}

	function setMousePosition(client_x, client_y) {
		document.documentElement.style.setProperty('--client_x', `${client_x}px`);
		document.documentElement.style.setProperty('--client_y', `${client_y}px`);
	}

	initDocumentMousemoveEventListener();

	var cursor = document.querySelector(".cursor:not(.clone)");
	var timeout;

    document.addEventListener("mousemove", (e) => {
		var y = e.clientY
		var x = e.clientX;

      cursor.style.top = y + "px";
      cursor.style.left = x + "px";
      cursor.style.display = "block";

	  function mouseStopped(){
        cursor.style.display = "none";
      }
      clearTimeout(timeout);
      timeout = setTimeout(mouseStopped, 8000);
    });


	function loadFunc(){
		$('#header').addClass('load');
		$('.visual').addClass('load');

		setTimeout(function(){
			$('#header').removeClass('load');
			$('#header').removeClass('before');
			$('.visual').removeClass('load');
			$('.mainWrap .mainSec.visual').removeClass('before');
			$('.mainWrap .mainSec.visual .sloganArea .logo').removeClass('txtLine');
			$('.mainWrap .mainSec.visual .sloganArea .changeSlogan').removeClass('txtLine');

			StartTextAnimation(1);
		}, 2000);

		// setInterval(function(){
		// 	$('.changeSlogan span.past').removeClass('past');
		// 	$('.changeSlogan span.active').addClass('past').removeClass('active');
		// 	$('.changeSlogan span.past + span').addClass('active');
		// 	if ($('.changeSlogan span.active').length == 0){
		// 		$('.changeSlogan span:nth-child(1)').addClass('active');
		// 	}
		// }, 2400);

		var dataText = ['have' , 'will' , 'want' , 'new' , 'try' , 'on' , 'say' , 'loved' , 'with' , 'enjoy' , 'fun' , 'trust'];
		function typeWriter(text, i, fnCallback) {
			if(text == undefined){
				return;
			}

			if (i < text.length) {
				document.querySelector('.changeSlogan div span').innerHTML = text.substring(0, i+1);

				setTimeout(function() {
					typeWriter(text, i + 1, fnCallback);
				}, 200);
			}
			else if (typeof fnCallback == 'function') {
				setTimeout(fnCallback, 1000);
			}
		}

		function StartTextAnimation(i) {
			if(typeof dataText[i] == 'undefined'){
				setTimeout(function() {
					StartTextAnimation(0);
				}, 5000);
			}

			typeWriter(dataText[i], 0, function(){
				StartTextAnimation(i + 1);
			});
		}
	}

	loadFunc();

	// $('.contactSub .btnWrite').on('click' , function(e){
	// 	e.preventDefault();

	// 	$('.contactSub .modalBody').stop().animate({
	// 		scrollTop : $('.contactSub .contactWrite').position().top
	// 	});
	// });
});