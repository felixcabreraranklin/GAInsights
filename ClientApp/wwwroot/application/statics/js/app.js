$(function() {
    var is_pushed = $('body').hasClass('pushed');
    var height = $(window).height();
    var width = $(window).width();

    $.fn.resizeApp = function(height, isMobile){
        if(typeof isMobile!=='undefined' && isMobile){
            if (width < 1280) {
                $('.content-container').css('overflow-y','auto');
                $(this).css('overflow-y','initial'); 
                $(this).css('height','auto');  
            }else{
                $(this).css('overflow-y','auto');
                $(this).height( $(window).height() - height);
            }
        }else{
            $(this).css('overflow-y','auto');
            $(this).height( $(window).height() - height);
        }
    };

    var fn = (function() {
        return {
            getHeight: function() {
                height = $(window).height();
                width = $(window).width();
                if (width < 1280) {
                    $('body').addClass('is_responsive');
                } else {
                    $('body').removeClass('is_responsive');
                }
                var left_bar_head = $('.sidebar-head').height();
                var left_bar_footer = $('.sidebar-footer').height();
                var navigator_menu = $('.navigator-menu').height();
                var pushed = $('.sidebar-pushed').height();
                $('.sidebar-menu').height(height - left_bar_head - left_bar_footer - pushed);
                $('.content-container').height(height - navigator_menu);
                if (width < 1280) {
                    fn.closeLeftbar();
                    fn.closeContainer();
                } else {
                    fn.openLeftbar();
                    fn.openContainer();
                }
            },
            getInnerDocument : function(){
                $('.inner-document-one').resizeApp(330);
                $('.inner-document-two').resizeApp(200);
                $('.inner-document-order-tables').resizeApp(180, true);
                $('.inner-document-order-tables-list').resizeApp(250, true);
            },
            openLeftbar: function() {
                $('body').addClass('open');
                $('.sidebar-container').stop().animate({
                    'left': '0px'
                }, 'fast');
            },
            closeLeftbar: function() {
                $('body').removeClass('open');
                $('.sidebar-container').stop().animate({
                    'left': '-300px'
                }, 'fast');
            },
            openContainer: function() {
                if (width < 1280) {
                    $('.content-overlay').fadeIn('fast');
                    $('.content-container .content-inner').stop().animate({
                        'margin-left': '0px'
                    }, 'fast');
                    $('.navigator-menu').stop().animate({
                        'padding-left': '0px'
                    }, 'fast');
                } else {
                    $('.content-overlay').hide();
                    $('.content-container .content-inner').stop().animate({
                        'margin-left': '255px'
                    }, 'fast');
                    if (is_pushed) {
                        $('.navigator-menu').stop().animate({
                            'padding-left': '255px'
                        }, 'fast');
                    } else {
                        $('.navigator-menu').stop().animate({
                            'padding-left': '0px'
                        }, 'fast');
                    }
                }
            },
            closeContainer: function() {
                $('.content-overlay').hide();
                $('.content-container .content-inner').stop().animate({
                    'margin-left': '0px'
                }, 'fast');
                $('.navigator-menu').stop().animate({
                    'padding-left': '0px'
                }, 'fast');
            }
        };
    })();


    $(window).resize(function() {
        fn.getHeight();
        fn.getInnerDocument();
    });
    $(window).resize();

    $(document).on('click', '.link-hamburger', function(e, d) {
        e.preventDefault();
        if ($('body').hasClass('open')) {
            fn.closeLeftbar();
            fn.closeContainer();
        } else {
            fn.openLeftbar();
            fn.openContainer();
        }
    });
    $(document).on('click', '.content-overlay', function(e) {
        $('.link-hamburger').click();
    });

    $(document).on('click', '.menu-link', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $parent = $(this).parent();
        var $container = $parent.children('.menu-container');
        //close all menus 
        $('.open-navigator').each(function() {
            if (!$container.hasClass('open-navigator')) {
                $(this).removeClass('open-navigator');
                $(this).hide();
                $(this).prev().hide();
            }
        });
        if ($container.hasClass('open-navigator')) {
            $container.removeClass('open-navigator');
            $container.hide();
            $parent.children('.menu-arrow').hide();
        } else {
            $container.addClass('open-navigator');
            $container.fadeIn('fast');
            $parent.children('.menu-arrow').fadeIn('fast');
        }
    });

    $(document).click(function(e) {
        $('.open-navigator').each(function() {
            $(this).removeClass('open-navigator');
            $(this).hide();
            $(this).prev().hide();
        });
    });

    $(document).on('show.bs.modal', '.modal', function () {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
    $(document).on('hidden.bs.modal', '.modal', function () {
        $('.modal:visible').length && $(document.body).addClass('modal-open');
    });

});