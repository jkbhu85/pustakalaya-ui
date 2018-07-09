function main() {
    loadHeader();
    loadFooter();
    loadNav();
    ui();
}

main();

function loadHeader() {
    const header = document.querySelector('#header');

    if (header) {
        const url = window.location.href;
        const searchKey = '/ptkuidocs/';
        const docPos = url.indexOf(searchKey) + 1;

        const urlPrefix = url.substr(0, url.indexOf(searchKey) + searchKey.length);
        const newUrl =  urlPrefix + 'index.html';
        
        let imgPrefix = '';
        let depth = findDepth(url, searchKey);

        for (let i = 0; i < depth; i++) {
            imgPrefix += '../';
        }

        if (imgPrefix.length === 0) imgPrefix = './';

        const imgUrl = imgPrefix + 'img/saraswati.png';
        // image source: https://pngimg.com/download/41911

        header.innerHTML =
        `<a href="${newUrl}" class="header-link">
            <table>
                <tbody>
                    <tr>
                        <td><img class="header-logo" src="${imgUrl}"/></td>
                        <td>
                            <div class="header-text">
                                <div class="header-text-top">Pustakalaya</div>
                                <div class="header-text-bottom">User Interface</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </a>`;
    }
}

function findDepth(url, startAfter) {
    if (!url) return -1;

    let start = 0;
    if (startAfter && startAfter.length > 0 && url.indexOf(startAfter) > -1) {
        start = url.indexOf(startAfter) + startAfter.length;
    } else {
        return 0;
    }

    let depth = 0;
    while (start < url.length) {
        
        if (url[start] === '/') {
            depth++;
        }
        start++;
    }

    return depth;
}

function loadFooter() {
    const footer = document.querySelector('#footer');

    if (footer) {
        footer.innerHTML = '<div style="text-align:center;">&copy; Jitendra Kumar</div>';
    }
}

function loadNav() {
    const navElm = document.getElementsByTagName("nav")[0];

    if (navElm) {
        navElm.style.display = 'hidden';
    }
}

function ui() {
    let timeoutHolder = 0;
    const TIME_PERIOD = 200;
    const header = document.querySelector('#header');
    const footer = document.querySelector('#footer');
    const nav = document.querySelector('nav');
    const content = document.querySelector('.main-content');

    if (!content) return;

    function findWindowDimensions() {
        const testDiv = document.createElement('div');
        testDiv.style.position = 'fixed';
        testDiv.style.top = '0';
        testDiv.style.right = '0';
        testDiv.style.bottom = '0';
        testDiv.style.left = '0';

        document.body.appendChild(testDiv);
        var w = testDiv.clientWidth;
        var h = testDiv.clientHeight;
        document.body.removeChild(testDiv);

        return { width: w, height: h };
    }

    function adjustUI() {
        const dims = findWindowDimensions();

        const hh = (header ? header.offsetHeight : 0);
        const fh = (footer ? footer.offsetHeight : 0);
        const nh = (nav ? nav.offsetHeight : 0);
        const wh = dims.height;

        var ch = Math.floor(wh - hh - nh -fh);

        if (ch <= 0) ch = 1;

        content.style.minHeight = ch + 'px';
    }

    window.addEventListener('resize', function () {
        if (timeoutHolder) window.clearTimeout(timeoutHolder);

        timeoutHolder = window.setTimeout(adjustUI, TIME_PERIOD);
    });

    window.setTimeout(
        function () { adjustUI(); },
        TIME_PERIOD
    );
};