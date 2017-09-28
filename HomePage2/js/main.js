/*
Theme Name: Nantria
Description: Multi-Purpose HTML Site Template
Author: Erilisdesign
Theme URI: http://erilisdesign.com/preview/themeforest/html/nantria/
Author URI: http://themeforest.net/user/Erilisdesign
Version: 1.4
*/

(function($) {
	"use strict";

	// Vars
	var body = $('body'),
		preloader = $('#preloader'),
		preloaderDelay = 350,
		preloaderFadeOutTime = 800,
		animated = $('.animated'),
		countdown = $('.countdown[data-countdown]'),
		mainHeader = $('.main-header');
	
	// Mobile
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		body.addClass('mobile');
	}

	function detectIE() {
		if (navigator.userAgent.indexOf('MSIE') != -1)
			var detectIEregexp = /MSIE (\d+\.\d+);/ // test for MSIE x.x
		else // if no "MSIE" string in userAgent
			var detectIEregexp = /Trident.*rv[ :]*(\d+\.\d+)/ // test for rv:x.x or rv x.x where Trident string exists

		if (detectIEregexp.test(navigator.userAgent)){ // if some form of IE
			var ieversion=new Number(RegExp.$1) // capture x.x portion and store as a number
			if (ieversion >= 9) {
				return true;
			}
		}
		return false;
	}

	function getWindowWidth() {
		return Math.max( $(window).width(), window.innerWidth);
	}
	
	jQuery.fn.setAllToMaxHeight = function(){
		return this.css({ 'height' : '' }).outerHeight( Math.max.apply(this, jQuery.map( this , function(e){ return jQuery(e).outerHeight() }) ) );
	};
	

	// Preloader
	function initPreloader() {
		
		// Hide Preloader
		preloader.delay(preloaderDelay).fadeOut(preloaderFadeOutTime);
		
	}


	// Refresh Waypoints
	var refreshWaypoints_timeout;

	function refreshWaypoints() {
		clearTimeout(refreshWaypoints_timeout);
		refreshWaypoints_timeout = setTimeout(function() {
			Waypoint.refreshAll();
		}, 1000);
	}


	// Animations
	function initAnimations() {
		if( !body.hasClass('mobile') ) {

			animated.appear();

			if( detectIE() ) {
				animated.css({
					'display':'block',
					'visibility':'visible'
				});
			} else {
				animated.on('appear', function(event, $all_appeared_elements) {
					var elem = $(this);
					var animation = elem.data('animation');
					
					if(elem.parents('.swiper-slider').length>0 || elem.parents('.flexslider').length>0){
						return true;
					}
					
					if ( !elem.hasClass('visible') ) {
						var animationDelay = elem.data('animation-delay');
						if ( animationDelay ) {
							setTimeout(function(){
								elem.addClass( animation + ' visible' );
							}, animationDelay);
						} else {
							elem.addClass( animation + ' visible' );
						}
					}
				});
				
				/* Starting Animation on Load */
				$(window).on('load', function() {
					$('.onstart').each( function() {
						var elem = $(this);
						if ( !elem.hasClass('visible') ) {
							var animationDelay = elem.data('animation-delay');
							var animation = elem.data('animation');
							if ( animationDelay ) {
								setTimeout(function(){
									elem.addClass( animation + " visible" );
								}, animationDelay);
							} else {
								elem.addClass( animation + " visible" );
							}
						}
					});
				});
			}
		}
	}
	

	//	Backgrounds
	function initPageBackground() {
		
		$('.player').each(function() {
			$('.player').mb_YTPlayer();
		});
		
		if(body.hasClass('mobile')) {
			$('.video-wrapper, .player').css('display', 'none');	
		}
		
	}

	
	// Parallax
	function parallaxInit() {
		var windowHeight = window.innerHeight || document.documentElement.clientHeight,
			scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop),
			bottomWindow = scrollTop + windowHeight,
			speedDivider = 0.25;
		
		$('.parallax-background').each(function() {
			var parallaxElement = $(this),
				parallaxHeight = parallaxElement.outerHeight(),
				parallaxTop = parallaxElement.offset().top,
				parallaxBottom = parallaxTop + parallaxHeight,
				parallaxWrapper = parallaxElement.parents('.overlay-wrapper'),
				
				section = parallaxElement.parents('section'),
				sectionHeight = parallaxElement.parents('section').outerHeight(),
				offSetTop = scrollTop + section[0].getBoundingClientRect().top,
				offSetPosition = windowHeight + scrollTop - offSetTop;
				
			if (offSetPosition > 0 && offSetPosition < (sectionHeight + windowHeight)) {
				var value = ((offSetPosition - windowHeight) * speedDivider);

				if (Math.abs(value) < (parallaxHeight - sectionHeight)) {
					parallaxElement.css({
						"transform" : "translate3d(0px, " + value + "px, 0px)",
						"-webkit-transform" : "translate3d(0px, " + value + "px, 0px)"
					});
				} else {
					parallaxElement.css({
						"transform" : "translate3d(0px, " + parallaxHeight - sectionHeight + "px, 0px)",
						"-webkit-transform" : "translate3d(0px, " + parallaxHeight - sectionHeight + "px, 0px)"
					});
				}
			}
		});
	};
	
	
	// Navigation
	function initNavigation() {
		
		function navClearEvents() {
			$(document)
				.off('click', '.nav-toggle')
				.off('click', '.header-widget > a')
				.off('click', '.header-widget[data-trigger="click"] > a')
				.off('click', 'ul.menu li.bt-dropdown > a')
				.off('click', 'ul li.dropdown-submenu > a');

			var navHoverElems = [$('ul.menu li.bt-dropdown'), $('ul li.dropdown-submenu'), $('.header-widget[data-trigger="hover"]')];
			var navHoverResult = $();

			$.each(navHoverElems, function() {
				navHoverResult = navHoverResult.add(this);
			});
		
			navHoverResult.off('mouseover mouseleave');
			$('ul li.dropdown-submenu').off('mouseover mouseleave');
			
			if(!(991 >= getWindowWidth() || body.hasClass('mobile'))) {
				$('.nav-toggle, .header-widget, ul.menu li.bt-dropdown, ul li.dropdown-submenu').removeClass('open');
			};
		}
		
		function initMobileNav() {
			
			navClearEvents();
			if(!$('.nav-toggle').hasClass('open')) {
				$('.block-menu').hide();
			};
			
			$(document).on('click', '.nav-toggle', function(e) {
				e.preventDefault();
				$('.header-widget').removeClass('open');
				$(this).toggleClass('open');
				$('.block-menu').slideToggle(500);
			});
			
			$(document).on('click', '.header-widget > a', function(e) {
				e.preventDefault();
				if($(this).parent('.header-widget').hasClass('open')) {
					$('.header-widget').removeClass('open');
				} else {
					if($('.nav-toggle').hasClass('open')) {
						$('.nav-toggle').removeClass('open');
						$('.block-menu').slideUp(500);
					}
					$('.header-widget').removeClass('open');		
					$(this).parent('.header-widget').addClass('open');
				}
			});
			
			$(document).on('click', 'ul.menu li.bt-dropdown > a', function(e) {
				e.preventDefault();
				if( $(this).parent('li.bt-dropdown').hasClass('open')){
					$(this).parent('li.bt-dropdown').removeClass('open');
					return true;
				} 
				$(this).parent('li.bt-dropdown').addClass('open');
			});
			
			$(document).on('click', 'ul li.dropdown-submenu > a', function(e) {
				e.preventDefault();
				if( $(this).parent('li.dropdown-submenu').hasClass('open')){
					$(this).parent('li.dropdown-submenu').removeClass('open');
					return true;
				}
				$(this).parent('li.dropdown-submenu').addClass('open');
			});

		}

		function initDesktopNav() {
			
			navClearEvents();
			$('.block-menu').show();
			
			$(document).on('click', '.header-widget[data-trigger="click"] > a', function(e) {
				e.preventDefault();
				if($(this).parent('.header-widget').hasClass('open')) {
					$('.header-widget').removeClass('open');
				} else {
					$('.header-widget').removeClass('open');		
					$(this).parent('.header-widget').addClass('open');
				}
			});

			var navHoverElems = [$('ul.menu li.bt-dropdown'), $('ul li.dropdown-submenu'), $('.header-widget[data-trigger="hover"]')];
			var navHoverResult = $();

			$.each(navHoverElems, function() {
				navHoverResult = navHoverResult.add(this);
			});
		
			navHoverResult.on({
				mouseover: function (event) {
					if($(this).hasClass('open') && $(this).is(event.target)) {
						return true;
					}
					$('ul.menu li.bt-dropdown').removeClass('open');
					$('.header-widget').removeClass('open');		
					$(this).addClass('open');
				},
				mouseleave: function () {
					if(!$(this).hasClass('open')) {
						return true;
					}
					$(this).removeClass('open');
				}
			});
			
		}

		// Header Widget - Hidden
		$(document).on('click', function(e) {
			if($(e.target).closest('.main-header').length > 0)
				return;
			$('.header-widget').removeClass('open');
		});
		
		function nantriaNav() {
			if ( 991 >= getWindowWidth() || body.hasClass('mobile')) {
				initMobileNav();
			} else {
				initDesktopNav();
			}
		}
		nantriaNav();
		$(window).on('resize', function () {			
			nantriaNav();
		});

		if(!body.hasClass('mobile')) {
			$(window).scroll(function(){

				var scroll = $(this).scrollTop();
				var headerHeight = $('section').first().innerHeight();
				var windowWidth = getWindowWidth();
				if($('#portfolio').length > 0){
					var portfolioPosition = $('#portfolio').offset().top;
				}
				
				$(window).on('resize', function () {
					var scroll = $(this).scrollTop();
					var headerHeight = $('section').first().innerHeight();
					var windowWidth = getWindowWidth();
					if($('#portfolio').length > 0){
						var portfolioPosition = $('#portfolio').offset().top;
					}
				});
				
				if (!mainHeader.hasClass('header-static')) {
					if (windowWidth > 991) {
						if (scroll > 180) {
							mainHeader.addClass('scrolled');
						} else {
							mainHeader.removeClass('scrolled');
						}	
						if (scroll > headerHeight) {
							mainHeader.addClass('header-sticky');
						} else {
							mainHeader.removeClass('header-sticky');
						}
					}
				}
			});
		}
		
		var backToTop = $('.backToTop');
		if(!body.hasClass('mobile')) {
			$(window).scroll(function(){

				var scroll = $(this).scrollTop();
				var windowWidth = getWindowWidth();
				
				$(window).on('resize', function () {
					var scroll = $(this).scrollTop();
					var windowWidth = getWindowWidth();
				});				
				
				if (windowWidth > 991) {
					if (scroll > 370) {
						backToTop.addClass('fadein');
					} else {
						backToTop.removeClass('fadein');
					}
				}		
			});
		}
		
	}
	

	// Portfolio
	function initMasonryLayout() {
		if ($('.isotope-container').length > 0) {
			var $isotopeContainer = $('.isotope-container');
			var $columnWidth = $isotopeContainer.data('column-width');
			
			if($columnWidth == null){
				var $columnWidth = '.isotope-item';
			}
			
			$isotopeContainer.isotope({
				filter: '*',
				animationEngine: 'best-available',
				resizable: false,
				itemSelector : '.isotope-item',
				masonry: {
					columnWidth: $columnWidth
				},
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				}
			}, refreshWaypoints());
		}

		$('nav.isotope-filter ul a').on('click', function() {
			var selector = $(this).attr('data-filter');
			$isotopeContainer.isotope({ filter: selector }, refreshWaypoints());
			$('nav.isotope-filter ul a').removeClass('active');
			$(this).addClass('active');
			return false;
		});

	}


	// magnificPopup
	function initMagnificPopup() {
		$('.mfp-image').magnificPopup({
			type:'image',
			closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="ion-android-close"></i></button>',
			removalDelay: 300,
			mainClass: 'mfp-fade'
		});
		
		$('.mfp-gallery').each(function() {
			$(this).magnificPopup({
				delegate: 'a',
				type: 'image',
				gallery: {
					enabled: true
				},
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="ion-android-close"></i></button>',
				removalDelay: 300,
				mainClass: 'mfp-fade'
			});
		});
		
		$('.mfp-iframe').magnificPopup({
			type: 'iframe',
			iframe: {
				patterns: {
					youtube: {
						index: 'youtube.com/',
						id: 'v=',
						src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
					},
					vimeo: {
						index: 'vimeo.com/',
						id: '/',
						src: '//player.vimeo.com/video/%id%?autoplay=1'
					},
					gmaps: {
						index: '//maps.google.',
						src: '%id%&output=embed'
					}
				},
				srcAction: 'iframe_src'
			},
			closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="ion-android-close"></i></button>',
			removalDelay: 300,
			mainClass: 'mfp-fade'
		});
		
		$('.mfp-ajax').magnificPopup({
			type: 'ajax',
			ajax: {
				settings: null,
				cursor: 'mfp-ajax-cur',
				tError: '<a href="%url%">The content</a> could not be loaded.'
			},
			midClick: true,
			closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="ion-android-close"></i></button>',
			removalDelay: 300,
			mainClass: 'mfp-fade',
			callbacks: {
				ajaxContentAdded: function(mfpResponse) {
					initFlexslider();
				}
			}
		});
		
		$('.open-popup-link').magnificPopup({
			type: 'inline',
			midClick: true,
			closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="ion-android-close"></i></button>',
			removalDelay: 300,
			mainClass: 'mfp-fade'
		});
	}
	
	// Flexslider
	function initFlexslider() {
		
		if ($('.bt-flexcarousel').length > 0) {			
			
			$('.bt-flexcarousel').flexslider({
				selector: '.slides > div.flex-slide',
				animation: 'slide',
				slideshowSpeed: 2000,
				animationSpeed: 700,
				prevText: "<i class='fa fa-angle-left'></i>",
				nextText: "<i class='fa fa-angle-right'></i>",
				controlNav: false
			});
			
		}
				
		if ($('.bt-flexslider').length > 0) {			
			$('.bt-flexslider').each(function() {
				var $flexsSlider = $(this),
					fs_effect = $flexsSlider.data('effect'),
					fs_easing = $flexsSlider.data('easing'),
					fs_direction = $flexsSlider.data('direction'),
					fs_loop = $flexsSlider.data('loop'),
					fs_smoothHeight = $flexsSlider.data('smooth-height'),
					fs_startAt = $flexsSlider.data('startat'),
					fs_slideshowSpeed = $flexsSlider.data('slideshow-speed'),
					fs_animationSpeed = $flexsSlider.data('animation-speed'),
					fs_randomize = $flexsSlider.data('randomize'),
					fs_video = $flexsSlider.data('video'),
					fs_pagination = $flexsSlider.data('pagination'),
					fs_directionNav = $flexsSlider.data('directionnav'),
					fs_keyboard = $flexsSlider.data('keyboard'),
					fs_pausePlay = $flexsSlider.data('pause-play');
				
				if(fs_effect == null){ fs_effect = 'slide'; }
				if(fs_easing == null){ fs_easing = 'swing'; }
				if(fs_direction == null){ fs_direction = 'horizontal'; }
				if(fs_loop == null){ fs_loop = true; }
				if(fs_smoothHeight == null){ fs_smoothHeight = false; }
				if(fs_startAt == null){ fs_startAt = 0; }
				if(fs_slideshowSpeed == null){ fs_slideshowSpeed = 7000; }
				if(fs_animationSpeed == null){ fs_animationSpeed = 700; }
				if(fs_randomize == null){ fs_randomize = false; }	
				if(fs_video == null){ fs_video = false; }
				if(fs_pagination == null){ fs_pagination = true; }
				if(fs_directionNav == null){ fs_directionNav = true; }
				if(fs_keyboard == null){ fs_keyboard = false; }
				if(fs_pausePlay == null){ fs_pausePlay = false; }
				
				$flexsSlider.flexslider({
					selector: ".slides > div.flex-slide",
					animation: ''+ fs_effect +'',
					easing: ''+ fs_easing +'',
					direction: ''+ fs_direction +'',
					animationLoop: fs_loop,
					smoothHeight: fs_smoothHeight,
					startAt: fs_startAt,
					slideshow: true,
					slideshowSpeed: fs_slideshowSpeed,
					animationSpeed: fs_animationSpeed,
					randomize: fs_randomize,
					pauseOnAction: true,
					pauseOnHover: false,
					video: fs_video,
					controlNav: fs_pagination,
					directionNav: fs_directionNav,
					prevText: "<i class='fa fa-angle-left'></i>",
					nextText: "<i class='fa fa-angle-right'></i>",
					keyboard: fs_keyboard,
					pausePlay: fs_pausePlay,
					pauseText: 'Pause',
					playText: 'Play',
					start: function(){
						$flexsSlider.find('.flex-active-slide .animated').each(function() {
							var elem = $(this),
								animation = elem.data('animation'),
								animationDelay = elem.data('animation-delay');

							if(!elem.parents('.flex-slide').hasClass('flex-active-slide') && elem.hasClass('visible')) {				
								elem.removeClass(animation).removeClass('visible');
							}
								
							if(elem.parents('.flex-slide').hasClass('flex-active-slide') && !elem.hasClass('visible')) {			
								if ( animationDelay ) {
									setTimeout(function(){
										elem.addClass( animation + ' visible' );
									}, animationDelay);
								} else {
									elem.addClass( animation + ' visible' );
								}
							}
						});
					},
					after: function(){
						$flexsSlider.find('.animated').each(function() {
							var elem = $(this),
								animation = elem.data('animation'),
								animationDelay = elem.data('animation-delay');
							
							if(!elem.parents('.flex-slide').hasClass('sflex-active-slide') && elem.hasClass('visible')) {				
								elem.removeClass(animation).removeClass('visible');
							}
							
							if(elem.parents('.flex-slide').hasClass('flex-active-slide') && !elem.hasClass('visible')) {			
								if ( animationDelay ) {
									setTimeout(function(){
										elem.addClass( animation + ' visible' );
									}, animationDelay);
								} else {
									elem.addClass( animation + ' visible' );
								}
							}
						});
					}
				});
			});
		}
		
		if ($('.thumbs-gallery').length > 0) {			
			$('.thumbs-gallery').each(function() {
				var $flexsSlider = $(this),
					fs_effect = $flexsSlider.data('effect'),
					fs_easing = $flexsSlider.data('easing'),
					fs_loop = $flexsSlider.data('loop'),
					fs_slideshowSpeed = $flexsSlider.data('slideshow-speed'),
					fs_animationSpeed = $flexsSlider.data('animation-speed');
					
				if(fs_effect == null){ fs_effect = 'slide'; }
				if(fs_easing == null){ fs_easing = 'swing'; }
				if(fs_loop == null){ fs_loop = false; }
				if(fs_slideshowSpeed == null){ fs_slideshowSpeed = 7000; }
				if(fs_animationSpeed == null){ fs_animationSpeed = 700; }
				
				$flexsSlider.flexslider({
					selector: ".slides > div.flex-slide",
					animation: ''+ fs_effect +'',
					easing: ''+ fs_easing +'',
					animationLoop: fs_loop,
					slideshowSpeed: fs_slideshowSpeed,
					animationSpeed: fs_animationSpeed,
					controlNav: 'thumbnails',
					directionNav: false,
					keyboard: false,
					smoothHeight: true
				});
			});
		}
		
	}
	
	function initPlugins() {

		// Smooth Scroll
		$('a.scrollto').off('click');
		$('a.scrollto').on('click', function() {
			var sScroll = $(this),
				sScroll_offset = sScroll.data('offset'),
				sScroll_easing = sScroll.data('easing'),
				sScroll_speed = sScroll.data('speed'),
				sScroll_target = sScroll.attr('href');
				
			if(sScroll_offset == null){ sScroll_offset = 0; }
			if(sScroll_easing == null){ sScroll_easing = 'swing'; }
			if(sScroll_speed == null){ sScroll_speed = 800; }
			if(sScroll_target == null){ sScroll_target = '#'; }
			
			$.smoothScroll({
				offset: sScroll_offset,
				easing: ''+ sScroll_easing +'',
				speed: sScroll_speed,
				scrollTarget: sScroll_target
			});
			return false;
		});
	
		// Responsive Video - FitVids
		$('.video-container').fitVids();
		
		// OwlCarousel
		if ($('.bt-owl-carousel').length > 0) {			
			$('.bt-owl-carousel').each(function() {
				var $owlCarousel = $(this),
					owl_items = $owlCarousel.data('items'),
					owl_itemsLg = $owlCarousel.data('items-lg'),
					owl_itemsMd = $owlCarousel.data('items-md'),
					owl_itemsSm = $owlCarousel.data('items-sm'),
					owl_itemsXs = $owlCarousel.data('items-xs'),
					owl_itemsXxs = $owlCarousel.data('items-xxs'),
					owl_slidespeed = $owlCarousel.data('slidespeed'),
					owl_paginationspeed = $owlCarousel.data('paginationspeed'),
					owl_rewindspeed = $owlCarousel.data('rewindspeed'),
					owl_autoplay = $owlCarousel.data('autoplay'),
					owl_stoponhover = $owlCarousel.data('stoponhover'),
					owl_navigation = $owlCarousel.data('navigation'),
					owl_rewindnav = $owlCarousel.data('rewindnav'),
					owl_scrollperpage = $owlCarousel.data('scrollperpage'),
					owl_pagination = $owlCarousel.data('pagination'),
					owl_paginationnumbers = $owlCarousel.data('paginationnumbers'),
					owl_colmargin = $owlCarousel.data('colmargin');
				
				if(owl_items == null ) { owl_items = 4; }
				if(owl_itemsLg == null ) { owl_itemsLg = Number( owl_items); }
				if(owl_itemsMd == null ) { owl_itemsMd = Number( owl_itemsLg); }
				if(owl_itemsSm == null ) { owl_itemsSm = Number( owl_itemsMd); }
				if(owl_itemsXs == null ) { owl_itemsXs = Number( owl_itemsSm); }
				if(owl_itemsXxs == null ) { owl_itemsXxs = Number( owl_itemsXs); }
				if(owl_slidespeed == null){ owl_slidespeed = 700; }
				if(owl_paginationspeed == null){ owl_paginationspeed = 700; }
				if(owl_rewindspeed == null){ owl_rewindspeed = 700; }
				if(owl_autoplay == null){ owl_autoplay = false; }
				if(owl_stoponhover == null){ owl_stoponhover = false; }				
				if(owl_navigation == null){ owl_navigation = true; }
				if(owl_rewindnav == null){ owl_rewindnav = true; }
				if(owl_scrollperpage == null){ owl_scrollperpage = 1; }			
				if(owl_pagination == null){ owl_pagination = true; }
				if(owl_paginationnumbers == null){ owl_paginationnumbers = false; }	
				
				if(owl_colmargin == null){
					$owlCarousel.find('.carousel-item').css({
						'padding-left': 0,
						'padding-right': 0
					});
				} else {
					$owlCarousel.css({
						'margin-left': -owl_colmargin,
						'margin-right': -owl_colmargin
					});
					$owlCarousel.find('.carousel-item').css({
						'padding-left': owl_colmargin,
						'padding-right': owl_colmargin
					});
				}
				
				$owlCarousel.owlCarousel({
					itemsCustom : [
						[0, owl_itemsXxs],
						[480, owl_itemsXs],
						[768, owl_itemsSm],
						[992, owl_itemsMd],
						[1200, owl_itemsLg]
					],
					slideSpeed : owl_slidespeed,
					paginationSpeed : owl_paginationspeed,
					rewindSpeed : owl_rewindspeed,					
					autoPlay : owl_autoplay,
					stopOnHover : owl_stoponhover,
					navigation : owl_navigation,
					navigationText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
					rewindNav : owl_rewindnav,
					scrollPerPage : owl_scrollperpage,
					pagination : owl_pagination,
					paginationNumbers: owl_paginationnumbers,
					mouseDrag: false
				});
			});
		}
		
		// Swiper Slider
		if ($('.swiper-slider .swiper-container').length > 0) {	
			$('.swiper-slider .swiper-container').each(function() {
				var swiperSlider = $(this),
					swiper_speed = swiperSlider.data('speed'),
					swiper_autoHeight = swiperSlider.data('autoheight'),
					swiper_autoplay = swiperSlider.data('autoplay'),
					swiper_autoplayStopOnLast = swiperSlider.data('autoplaystoponlast'),
					swiper_autoplayDisableOnInteraction = swiperSlider.data('autoplaydisableoninteraction'),
					swiper_freeMode = swiperSlider.data('freemode'),
					swiper_effect = swiperSlider.data('effect'),
					swiper_parallax = swiperSlider.data('parallax'),
					swiper_spaceBetween = swiperSlider.data('spacebetween'),
					swiper_slidesPerView = swiperSlider.data('slidesperview'),
					swiper_centeredSlides = swiperSlider.data('centeredslides'),
					swiper_slidesOffsetBefore = swiperSlider.data('slidesoffsetbefore'),
					swiper_slidesOffsetAfter = swiperSlider.data('slidesoffsetafter'),				
					swiper_paginationType = swiperSlider.data('paginationtype'),
					swiper_paginationHide = swiperSlider.data('paginationhide'),
					swiper_keyboardControl = swiperSlider.data('keyboardcontrol'),
					swiper_loop = swiperSlider.data('loop'),
					swiper_loopedSlides = swiperSlider.data('loopedslides');
					
				if(swiper_speed == null){ swiper_speed = 700; }
				if(swiper_autoHeight == null){ swiper_autoHeight = false; }
				if(swiper_autoplay == null){ swiper_autoplay = null; }
				if(swiper_autoplayStopOnLast == null){ swiper_autoplayStopOnLast = false; }
				if(swiper_autoplayDisableOnInteraction == null){ swiper_autoplayDisableOnInteraction = true; }
				if(swiper_freeMode == null){ swiper_freeMode = false; }
				if(swiper_effect == null){ swiper_effect = 'slide'; }
				if(swiper_parallax == null){ swiper_parallax = false; }
				if(swiper_spaceBetween == null){ swiper_spaceBetween = 0; }
				if(swiper_slidesPerView == null){ swiper_slidesPerView = 'auto'; }
				if(swiper_centeredSlides == null){ swiper_centeredSlides = false; }
				if(swiper_slidesOffsetBefore == null){ swiper_slidesOffsetBefore = 0; }
				if(swiper_slidesOffsetAfter == null){ swiper_slidesOffsetAfter = 0; }
				if(swiper_paginationType == null){ swiper_paginationType = 'bullets'; }
				if(swiper_paginationHide == null){ swiper_paginationHide = true; }
				if(swiper_keyboardControl == null){ swiper_keyboardControl = false; }
				if(swiper_loop == null){ swiper_loop = true; }
				
				if( swiperSlider.find('.swiper-pagination').length > 0 && swiper_paginationType == 'bullets' ) {
					var swiper_pagination = '.swiper-pagination',
						swiper_paginationClickable = true;
				} else if( swiperSlider.find('.swiper-pagination').length > 0 && swiper_paginationType !== 'bullets' ) {
					var swiper_pagination = '.swiper-pagination',
						swiper_paginationClickable = false;
				} else {
					var swiper_pagination = '',
						swiper_paginationClickable = false;
				}
				
				if( swiper_slidesPerView == 'auto' &&  swiper_loop == true ) {
					var swiper_loopedSlides = swiperSlider.find('.swiper-slide').length;
				} else {
					var swiper_loopedSlides = 0;
				}
				
				var mySwiper = new Swiper(swiperSlider, {
					speed: swiper_speed,
					autoHeight: swiper_autoHeight,
					autoplay: swiper_autoplay,
					autoplayStopOnLast: swiper_autoplayStopOnLast,
					autoplayDisableOnInteraction: swiper_autoplayDisableOnInteraction,
					freeMode: swiper_freeMode,
					effect: swiper_effect,
					parallax: swiper_parallax,
					spaceBetween: swiper_spaceBetween,
					slidesPerView: swiper_slidesPerView,
					centeredSlides: swiper_centeredSlides,
					slidesOffsetBefore: swiper_slidesOffsetBefore,
					slidesOffsetAfter: swiper_slidesOffsetAfter,
					grabCursor: false,
					simulateTouch: false,
					pagination: swiper_pagination,
					paginationType: swiper_paginationType,
					paginationClickable: swiper_paginationClickable,
					nextButton: '.swiper-button-next',
					prevButton: '.swiper-button-prev',
					keyboardControl: swiper_keyboardControl,
					loop: swiper_loop,
					loopedSlides: swiper_loopedSlides,
					onInit: function(swiper){
						swiperSlider.find('.swiper-slide-active .animated').each(function() {
							var elem = $(this),
								animation = elem.data('animation'),
								animationDelay = elem.data('animation-delay');

							if(!elem.parents('.swiper-slide').hasClass('swiper-slide-active') && elem.hasClass('visible')) {				
								elem.removeClass(animation).removeClass('visible');
							}
								
							if(elem.parents('.swiper-slide').hasClass('swiper-slide-active') && !elem.hasClass('visible')) {			
								if ( animationDelay ) {
									setTimeout(function(){
										elem.addClass( animation + ' visible' );
									}, animationDelay);
								} else {
									elem.addClass( animation + ' visible' );
								}
							}
						});
					},
					onSlideChangeEnd: function(swiper){
						swiperSlider.find('.animated').each(function() {
							var elem = $(this),
								animation = elem.data('animation'),
								animationDelay = elem.data('animation-delay');
							
							if(!elem.parents('.swiper-slide').hasClass('swiper-slide-active') && elem.hasClass('visible')) {				
								elem.removeClass(animation).removeClass('visible');
							}
							
							if(elem.parents('.swiper-slide').hasClass('swiper-slide-active') && !elem.hasClass('visible')) {			
								if ( animationDelay ) {
									setTimeout(function(){
										elem.addClass( animation + ' visible' );
									}, animationDelay);
								} else {
									elem.addClass( animation + ' visible' );
								}
							}
						});
					}
				});
			});
		}
		
		if ($('.swiper-gallery').length > 0) {
			$('.swiper-gallery').each(function() {
				
				var swiperGallery = $(this),
					swiperGalleryTop = swiperGallery.find('.gallery-top'),
					swiperGalleryTbumbs = swiperGallery.find('.gallery-thumbs'),
					swiperGallery_speed = swiperGalleryTop.data('speed'),
					swiperGalleryTop_spaceBetween = swiperGalleryTop.data('spacebetween'),
					swiperGalleryTbumbs_spaceBetween = swiperGalleryTbumbs.data('spacebetween');
				
				if(swiperGallery_speed == null){ swiperGalleryTop_speed = 700; }
				if(swiperGalleryTop_spaceBetween == null){ swiperGalleryTop_spaceBetween = 0; }
				if(swiperGalleryTbumbs_spaceBetween == null){ swiperGalleryTbumbs_spaceBetween = 0; }
				
				var galleryTop = new Swiper(swiperGalleryTop, {
					speed: swiperGallery_speed,
					spaceBetween: swiperGalleryTop_spaceBetween,
					nextButton: '.swiper-button-next',
					prevButton: '.swiper-button-prev'
				});

				var galleryThumbs = new Swiper(swiperGalleryTbumbs, {
					speed: swiperGallery_speed,
					spaceBetween: swiperGalleryTbumbs_spaceBetween,
					centeredSlides: true,
					slidesPerView: 'auto',
					touchRatio: 0.2,
					slideToClickedSlide: true
				});

				galleryTop.params.control = galleryThumbs;
				galleryThumbs.params.control = galleryTop;
				
			});
		}

		// Countdown
		if (countdown.length > 0) {			
			countdown.each(function() {
				var $countdown = $(this),
					finalDate = $countdown.data('countdown');
				$countdown.countdown(finalDate, function(event) {
					$countdown.html(event.strftime(
						'<div class="counter-container"><div class="counter-box first"><div class="number">%-D</div><span>Day%!d</span></div><div class="counter-box"><div class="number">%H</div><span>Hours</span></div><div class="counter-box"><div class="number">%M</div><span>Minutes</span></div><div class="counter-box last"><div class="number">%S</div><span>Seconds</span></div></div>'
					));
				});
			});
		}

		// Count To		
		if( $('.count-block').is(':appeared') ){
			$('.count-to').countTo();
		} else {
			$('.count-to').countTo();
		}

		// Placeholder
		$('input, textarea').placeholder();
		
		// Select2
		$(".js-selectbox").select2({
			minimumResultsForSearch: Infinity
		});
		
		$(".js-selectbox-search").select2();
		
		$(".js-selectbox-multiple").select2();
		
		// Tooltip
		$('[data-toggle="tooltip"]').tooltip();
		
		// Popover
		$('[data-toggle="popover"]').popover();
		
		// Morphext
		$('.text-rotate').Morphext({
			animation: 'fadeIn',
			separator: '|',
			speed: 3000
		});
		
		// Smooth Scroll
		if ($('body.smooth-scroller').length) {
			setTimeout(function(){
				initSmoothScroll();
			}, 300);
		}
	
	}
	

	// Mailchimp
	function initMailchimp() {
		$('.mailchimp-form').ajaxChimp({
			callback: mailchimpCallback,
			url: "mailchimp-post-url" //Replace this with your own mailchimp post URL. Don't remove the "". Just paste the url inside "".  
		});

		function mailchimpCallback(resp) {
			 if (resp.result === 'success') {
				$('.success-message').html(resp.msg).fadeIn(1000);
				$('.error-message').fadeOut(500);		
			} else if(resp.result === 'error') {
				$('.error-message').html(resp.msg).fadeIn(1000);
			}  
		}

		$('#email').focus(function(){
			$('.error-message').fadeOut();
			$('.success-message').fadeOut();
		});

		$('#email').on('keydown', function(){
			$('.error-message').fadeOut();
			$('.success-message').fadeOut();
		});

		$("#email").on('click', function() {
			$("#email").val('');
		});
	}


	// Contact Form
	function initContactForm() {
		var $contactForm = $('.contact-forn');
		if( $contactForm.length < 1 ){ return true; }

		$contactForm.each( function(){
			var element = $(this),
				elementAlert = element.attr('data-alert-type'),
				elementResult = element.find('.contact-form-result');

			element.find('form').validate({
				submitHandler: function(form) {
					elementResult.hide();

					$(form).ajaxSubmit({
						target: elementResult,
						dataType: 'json',
						success: function( data ) {
							elementResult.html( data.message ).fadeIn( 400 );
							if( data.alert != 'error' ) { $(form).clearForm(); }
						}
					});
				}
			});

		});
	}
	
	
	// Quick Contact Form
	function initQuickContactForm() {
		var $contactForm = $('.quick-contact-forn');
		if( $contactForm.length < 1 ){ return true; }

		$contactForm.each( function(){
			var element = $(this),
				elementAlert = element.attr('data-alert-type'),
				elementResult = element.find('.contact-form-result');

			element.find('form').validate({
				submitHandler: function(form) {
					elementResult.hide();

					$(form).ajaxSubmit({
						target: elementResult,
						dataType: 'json',
						success: function( data ) {
							elementResult.html( data.message ).fadeIn( 400 );
							if( data.alert != 'error' ) { $(form).clearForm(); }
						}
					});
				}
			});

		});
	}
	
	
	// Map
	function intMaps() {
		if ($('.gmap').length > 0) {
			$('.gmap').each(function() {
				var adress = $(this).data('adress');
				var zoom = $(this).data('zoom');
				var map_height = $(this).data('height');
				
				if (map_height){
					$('.gmap').css('height',map_height);
				}
			});
		}
	}
	
	// Custom OnLoad Functions
	function initOnLoadFunctions() {
		
		$('.feature-box-container').each(function(){
			$(this).find('.feature-box').setAllToMaxHeight();
		});
		
		$('.equal-section').each(function(){
			$(this).find('.equal-col').setAllToMaxHeight();
		});
		
		jQuery(window).resize(function(){
			$('.feature-box-container').each(function(){
				$(this).find('.feature-box').setAllToMaxHeight();
			});
			$('.equal-section').each(function(){
				$(this).find('.equal-col').setAllToMaxHeight();
			});
		});
		
	}
	
	// Smooth Scroll Function
	function initSmoothScroll() {
		//
		// SmoothScroll for websites v1.4.4 (Balazs Galambosi)
		// http://www.smoothscroll.net/
		//
		// Licensed under the terms of the MIT license.
		//
		// You may use it in your theme if you credit me. 
		// It is also free to use on any individual website.
		//
		// Exception:
		// The only restriction is to not publish any  
		// extension for browsers or native application
		// without getting a written permission first.
		//
		(function(){var defaultOptions={frameRate:150,animationTime:400,stepSize:100,pulseAlgorithm:true,pulseScale:4,pulseNormalize:1,accelerationDelta:50,accelerationMax:3,keyboardSupport:true,arrowScroll:50,touchpadSupport:false,fixedBackground:true,excluded:""};var options=defaultOptions;var isExcluded=false;var isFrame=false;var direction={x:0,y:0};var initDone=false;var root=document.documentElement;var activeElement;var observer;var refreshSize;var deltaBuffer=[];var isMac=/^Mac/.test(navigator.platform);var key={left:37,up:38,right:39,down:40,spacebar:32,pageup:33,pagedown:34,end:35,home:36};function initTest(){if(options.keyboardSupport){addEvent("keydown",keydown)}}function init(){if(initDone||!document.body)return;initDone=true;var body=document.body;var html=document.documentElement;var windowHeight=window.innerHeight;var scrollHeight=body.scrollHeight;root=document.compatMode.indexOf("CSS")>=0?html:body;activeElement=body;initTest();if(top!=self){isFrame=true}else if(scrollHeight>windowHeight&&(body.offsetHeight<=windowHeight||html.offsetHeight<=windowHeight)){var fullPageElem=document.createElement("div");fullPageElem.style.cssText="position:absolute; z-index:-10000; "+"top:0; left:0; right:0; height:"+root.scrollHeight+"px";document.body.appendChild(fullPageElem);var pendingRefresh;refreshSize=function(){if(pendingRefresh)return;pendingRefresh=setTimeout(function(){if(isExcluded)return;fullPageElem.style.height="0";fullPageElem.style.height=root.scrollHeight+"px";pendingRefresh=null},500)};setTimeout(refreshSize,10);addEvent("resize",refreshSize);var config={attributes:true,childList:true,characterData:false};observer=new MutationObserver(refreshSize);observer.observe(body,config);if(root.offsetHeight<=windowHeight){var clearfix=document.createElement("div");clearfix.style.clear="both";body.appendChild(clearfix)}}if(!options.fixedBackground&&!isExcluded){body.style.backgroundAttachment="scroll";html.style.backgroundAttachment="scroll"}}function cleanup(){observer&&observer.disconnect();removeEvent(wheelEvent,wheel);removeEvent("mousedown",mousedown);removeEvent("keydown",keydown);removeEvent("resize",refreshSize);removeEvent("load",init)}var que=[];var pending=false;var lastScroll=Date.now();function scrollArray(elem,left,top){directionCheck(left,top);if(options.accelerationMax!=1){var now=Date.now();var elapsed=now-lastScroll;if(elapsed<options.accelerationDelta){var factor=(1+50/elapsed)/2;if(factor>1){factor=Math.min(factor,options.accelerationMax);left*=factor;top*=factor}}lastScroll=Date.now()}que.push({x:left,y:top,lastX:left<0?.99:-.99,lastY:top<0?.99:-.99,start:Date.now()});if(pending){return}var scrollWindow=elem===document.body;var step=function(time){var now=Date.now();var scrollX=0;var scrollY=0;for(var i=0;i<que.length;i++){var item=que[i];var elapsed=now-item.start;var finished=elapsed>=options.animationTime;var position=finished?1:elapsed/options.animationTime;if(options.pulseAlgorithm){position=pulse(position)}var x=item.x*position-item.lastX>>0;var y=item.y*position-item.lastY>>0;scrollX+=x;scrollY+=y;item.lastX+=x;item.lastY+=y;if(finished){que.splice(i,1);i--}}if(scrollWindow){window.scrollBy(scrollX,scrollY)}else{if(scrollX)elem.scrollLeft+=scrollX;if(scrollY)elem.scrollTop+=scrollY}if(!left&&!top){que=[]}if(que.length){requestFrame(step,elem,1e3/options.frameRate+1)}else{pending=false}};requestFrame(step,elem,0);pending=true}function wheel(event){if(!initDone){init()}var target=event.target;var overflowing=overflowingAncestor(target);if(!overflowing||event.defaultPrevented||event.ctrlKey){return true}if(isNodeName(activeElement,"embed")||isNodeName(target,"embed")&&/\.pdf/i.test(target.src)||isNodeName(activeElement,"object")){return true}var deltaX=-event.wheelDeltaX||event.deltaX||0;var deltaY=-event.wheelDeltaY||event.deltaY||0;if(isMac){if(event.wheelDeltaX&&isDivisible(event.wheelDeltaX,120)){deltaX=-120*(event.wheelDeltaX/Math.abs(event.wheelDeltaX))}if(event.wheelDeltaY&&isDivisible(event.wheelDeltaY,120)){deltaY=-120*(event.wheelDeltaY/Math.abs(event.wheelDeltaY))}}if(!deltaX&&!deltaY){deltaY=-event.wheelDelta||0}if(event.deltaMode===1){deltaX*=40;deltaY*=40}if(!options.touchpadSupport&&isTouchpad(deltaY)){return true}if(Math.abs(deltaX)>1.2){deltaX*=options.stepSize/120}if(Math.abs(deltaY)>1.2){deltaY*=options.stepSize/120}scrollArray(overflowing,deltaX,deltaY);event.preventDefault();scheduleClearCache()}function keydown(event){var target=event.target;var modifier=event.ctrlKey||event.altKey||event.metaKey||event.shiftKey&&event.keyCode!==key.spacebar;if(!document.body.contains(activeElement)){activeElement=document.activeElement}var inputNodeNames=/^(textarea|select|embed|object)$/i;var buttonTypes=/^(button|submit|radio|checkbox|file|color|image)$/i;if(inputNodeNames.test(target.nodeName)||isNodeName(target,"input")&&!buttonTypes.test(target.type)||isNodeName(activeElement,"video")||isInsideYoutubeVideo(event)||target.isContentEditable||event.defaultPrevented||modifier){return true}if((isNodeName(target,"button")||isNodeName(target,"input")&&buttonTypes.test(target.type))&&event.keyCode===key.spacebar){return true}var shift,x=0,y=0;var elem=overflowingAncestor(activeElement);var clientHeight=elem.clientHeight;if(elem==document.body){clientHeight=window.innerHeight}switch(event.keyCode){case key.up:y=-options.arrowScroll;break;case key.down:y=options.arrowScroll;break;case key.spacebar:shift=event.shiftKey?1:-1;y=-shift*clientHeight*.9;break;case key.pageup:y=-clientHeight*.9;break;case key.pagedown:y=clientHeight*.9;break;case key.home:y=-elem.scrollTop;break;case key.end:var damt=elem.scrollHeight-elem.scrollTop-clientHeight;y=damt>0?damt+10:0;break;case key.left:x=-options.arrowScroll;break;case key.right:x=options.arrowScroll;break;default:return true}scrollArray(elem,x,y);event.preventDefault();scheduleClearCache()}function mousedown(event){activeElement=event.target}var uniqueID=function(){var i=0;return function(el){return el.uniqueID||(el.uniqueID=i++)}}();var cache={};var clearCacheTimer;function scheduleClearCache(){clearTimeout(clearCacheTimer);clearCacheTimer=setInterval(function(){cache={}},1*1e3)}function setCache(elems,overflowing){for(var i=elems.length;i--;)cache[uniqueID(elems[i])]=overflowing;return overflowing}function overflowingAncestor(el){var elems=[];var body=document.body;var rootScrollHeight=root.scrollHeight;do{var cached=cache[uniqueID(el)];if(cached){return setCache(elems,cached)}elems.push(el);if(rootScrollHeight===el.scrollHeight){var topOverflowsNotHidden=overflowNotHidden(root)&&overflowNotHidden(body);var isOverflowCSS=topOverflowsNotHidden||overflowAutoOrScroll(root);if(isFrame&&isContentOverflowing(root)||!isFrame&&isOverflowCSS){return setCache(elems,getScrollRoot())}}else if(isContentOverflowing(el)&&overflowAutoOrScroll(el)){return setCache(elems,el)}}while(el=el.parentElement)}function isContentOverflowing(el){return el.clientHeight+10<el.scrollHeight}function overflowNotHidden(el){var overflow=getComputedStyle(el,"").getPropertyValue("overflow-y");return overflow!=="hidden"}function overflowAutoOrScroll(el){var overflow=getComputedStyle(el,"").getPropertyValue("overflow-y");return overflow==="scroll"||overflow==="auto"}function addEvent(type,fn){window.addEventListener(type,fn,false)}function removeEvent(type,fn){window.removeEventListener(type,fn,false)}function isNodeName(el,tag){return(el.nodeName||"").toLowerCase()===tag.toLowerCase()}function directionCheck(x,y){x=x>0?1:-1;y=y>0?1:-1;if(direction.x!==x||direction.y!==y){direction.x=x;direction.y=y;que=[];lastScroll=0}}var deltaBufferTimer;if(window.localStorage&&localStorage.SS_deltaBuffer){deltaBuffer=localStorage.SS_deltaBuffer.split(",")}function isTouchpad(deltaY){if(!deltaY)return;if(!deltaBuffer.length){deltaBuffer=[deltaY,deltaY,deltaY]}deltaY=Math.abs(deltaY);deltaBuffer.push(deltaY);deltaBuffer.shift();clearTimeout(deltaBufferTimer);deltaBufferTimer=setTimeout(function(){if(window.localStorage){localStorage.SS_deltaBuffer=deltaBuffer.join(",")}},1e3);return!allDeltasDivisableBy(120)&&!allDeltasDivisableBy(100)}function isDivisible(n,divisor){return Math.floor(n/divisor)==n/divisor}function allDeltasDivisableBy(divisor){return isDivisible(deltaBuffer[0],divisor)&&isDivisible(deltaBuffer[1],divisor)&&isDivisible(deltaBuffer[2],divisor)}function isInsideYoutubeVideo(event){var elem=event.target;var isControl=false;if(document.URL.indexOf("www.youtube.com/watch")!=-1){do{isControl=elem.classList&&elem.classList.contains("html5-video-controls");if(isControl)break}while(elem=elem.parentNode)}return isControl}var requestFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(callback,element,delay){window.setTimeout(callback,delay||1e3/60)}}();var MutationObserver=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;var getScrollRoot=function(){var SCROLL_ROOT;return function(){if(!SCROLL_ROOT){var dummy=document.createElement("div");dummy.style.cssText="height:10000px;width:1px;";document.body.appendChild(dummy);var bodyScrollTop=document.body.scrollTop;var docElScrollTop=document.documentElement.scrollTop;window.scrollBy(0,3);if(document.body.scrollTop!=bodyScrollTop)SCROLL_ROOT=document.body;else SCROLL_ROOT=document.documentElement;window.scrollBy(0,-3);document.body.removeChild(dummy)}return SCROLL_ROOT}}();function pulse_(x){var val,start,expx;x=x*options.pulseScale;if(x<1){val=x-(1-Math.exp(-x))}else{start=Math.exp(-1);x-=1;expx=1-Math.exp(-x);val=start+expx*(1-start)}return val*options.pulseNormalize}function pulse(x){if(x>=1)return 1;if(x<=0)return 0;if(options.pulseNormalize==1){options.pulseNormalize/=pulse_(1)}return pulse_(x)}var userAgent=window.navigator.userAgent;var isEdge=/Edge/.test(userAgent);var isChrome=/chrome/i.test(userAgent)&&!isEdge;var isSafari=/safari/i.test(userAgent)&&!isEdge;var isMobile=/mobile/i.test(userAgent);var isIEWin7=/Windows NT 6.1/i.test(userAgent)&&/rv:11/i.test(userAgent);var isEnabledForBrowser=(isChrome||isSafari||isIEWin7)&&!isMobile;var wheelEvent;if("onwheel"in document.createElement("div"))wheelEvent="wheel";else if("onmousewheel"in document.createElement("div"))wheelEvent="mousewheel";if(wheelEvent&&isEnabledForBrowser){addEvent(wheelEvent,wheel);addEvent("mousedown",mousedown);addEvent("load",init)}function SmoothScroll(optionsToSet){for(var key in optionsToSet)if(defaultOptions.hasOwnProperty(key))options[key]=optionsToSet[key]}SmoothScroll.destroy=cleanup;if(window.SmoothScrollOptions)SmoothScroll(window.SmoothScrollOptions);if(typeof define==="function"&&define.amd)define(function(){return SmoothScroll});else if("object"==typeof exports)module.exports=SmoothScroll;else window.SmoothScroll=SmoothScroll})();
	};

	// WINDOW LOAD FUNCTION
	$(window).on('load', function() {
		initPreloader();
		initMasonryLayout();
		initOnLoadFunctions();
		
		// For parallax background
		var resizeTimer;
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			$(window).trigger('resize');
		}, 100);
	});
	
	// DOCUMENT READY FUNCTION
	jQuery(document).ready(function($) {
		initAnimations();
		initPageBackground();
		initNavigation();
		initMagnificPopup();
		initFlexslider();
		initPlugins();
		initMailchimp();
		initContactForm();
		initQuickContactForm();
		intMaps();
	});
	
	// WINDOW RESIZE FUNCTION
	$(window).on('resize', function() {
		initMasonryLayout();
	});
	
	// WINDOW SCROLL AND RESIZE FUNCTION
	$(window).on('scroll resize', function() {
		if(!body.hasClass('mobile')){
			parallaxInit();
		}
	});

})(jQuery);

//Google Tracking Code
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-85701226-1', 'auto');
ga('send', 'pageview');