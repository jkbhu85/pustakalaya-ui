$(document).ready(function () {
    var $header = $('#globalNav');
    var $footer = $('#footer');
    var $window = $(window);
    var $mainContent = $('#main-content');
    var $navbarToggler = $('#navbarToggler');
    var $collapsibleNav = $('#collapsibleNav');


    function adjustUI() {
        var hh = 0;

        if ($navbarToggler.attr('aria-expanded') === 'true') {
            var navPadding = $header.outerHeight() - $header.height();

            hh = $navbarToggler.outerHeight() + navPadding;
        } else {
            hh = $header.outerHeight();
        }

        var wh = $window.height();
        var fh = $footer.outerHeight();
        var ch = wh - hh - fh;

        if (ch < 0) ch = 1;
        ch = Math.floor(ch);

        $mainContent.css({
            minHeight: ch, marginTop: hh
        });

        /*
        console.log(
            'wh:' + wh +
            ' hh:' + hh +
            ' fh:' + fh +
            ' ch:' + ch
        );
        /* */
    }

    $header.css({
        position: 'fixed', top: '0', left: '0', right: '0'
    });


    window.setTimeout(adjustUI, 400);


    function navbarOverflowFixer(navbarExpanded) {
        if (navbarExpanded && $window.height() < $header.outerHeight()) {
            var h = $navbarToggler.outerHeight();
            var wh = $window.height();
            var navPadding = $header.outerHeight() - $header.height();
            var navHeight = wh - h - navPadding;

            $collapsibleNav.outerHeight(navHeight);

            //console.log('bH:' + h + ' nP:' + navPadding + ' cH:' + navHeight + ' wH:' + $window.height() + ' hH:' + $header.outerHeight());
        }
    }



    var timeoutHolder = null;
    function navbarTogglerClickHandler() {
        // to stop repeated adjustment, if window is resized repeatedly
        if (timeoutHolder) window.clearTimeout(timeoutHolder);

        timeoutHolder = window.setTimeout(function () {
            var expanded = $navbarToggler.attr('aria-expanded') === 'true';

            timeoutHolder = null;

            $collapsibleNav.outerHeight('');
            navbarOverflowFixer(expanded);
        }, 400);
    }

    $('#navbarToggler').on('click', navbarTogglerClickHandler);

    function adjustBody() {
        var $body = $(document.body);
        $body.css('padding-top', $header.outerHeight());
        $body.css('padding-bottom', $footer.outerHeight());
    }

    // adjustBody();

    var uiTimeoutHolder = 0;
    function onWindowResize() {
        if (uiTimeoutHolder) window.clearTimeout(uiTimeoutHolder);

        uiTimeoutHolder = window.setTimeout(adjustUI, 400);

        navbarTogglerClickHandler();
    }

    $window.resize(onWindowResize);
});
