let dropdownValue, storyValue, loc, zoom;

try {
    dropdownValue = localStorage.getItem('mapType') || 'circle';
    storyValue = localStorage.getItem('story');
    loc = localStorage.getItem("location") ? JSON.parse(localStorage.getItem("location")) : { lat: 39, lng: 36 }
    zoom = localStorage.getItem("zoom") ? parseInt(localStorage.getItem("zoom")) : 6;    
}
catch (e) {
    if (e) {
        localStorage.clear();
        window.location.reload();
    }
}

if (storyValue != 'viewed') {
    document.querySelector('.load').classList.add('view');
}

function initDropdown(query) { 
    let dropBody = document.querySelector(`${query} .body`);
    let dropHead = document.querySelector(`${query} .head`);
    let dropBodyElements = document.querySelectorAll(`${query} .body .select-item`);

    console.log(dropHead);

    if (!dropHead) return;

    dropBody.style.display = "none";

    dropHead.onmousedown = (ev) => {
        dropHead.classList.add("click");
    }

    dropHead.onmouseup = (ev) => {
        dropHead.classList.remove("click");
        if (dropBody.classList.contains("open")) {
            dropBody.classList.remove("open");    
            setTimeout(() => {
                dropBody.style.display = "none";
            }, 200);
            return;
        }

        dropBody.style.display = "flex";
        setTimeout(() => {
            dropBody.classList.add("open");
        }, 100)
    }

    for (let el of dropBodyElements) {
        if (el.getAttribute("data-value") == dropdownValue) {
            el.classList.add("focus");
        }
        else {
            el.classList.remove('focus');
        }

        el.onmousedown = () => {
            el.classList.add("click");
        }
        el.onmouseup = () => {
            el.classList.remove("click");
            dropBody.classList.remove("open");    
            dropBody.style.display = "none";
            dropdownValue = el.getAttribute("data-value");
            localStorage.setItem('mapType', dropdownValue);
            for (let ell of dropBodyElements) {
                if (ell.getAttribute("data-value") == dropdownValue) {
                    ell.classList.add("focus");
                }
                else {
                    ell.classList.remove('focus');
                }    
            }
            eval(el.getAttribute("data-fn"));
        }
    }
}

function initButton(query) {
    let dropHead = document.querySelector(`${query}`);

    dropHead.onmousedown = (ev) => {
        dropHead.classList.add("click");
    }

    dropHead.onmouseup = (ev) => {
        dropHead.classList.remove("click");
    }
}

function openLink(link) {
    window.open(link, '_blank');
}

function updateUI(state) {
    switch (state) {
        case 'close':
            var uiGroup = document.querySelector('.ui-group');

            uiGroup.classList.add('close');

            setTimeout(() => {
                uiGroup.style.display = 'none';
            }, 400)
            break;

        case 'open':
            var uiGroup = document.querySelector('.ui-group');

            uiGroup.classList.remove('close');

            setTimeout(() => {
                uiGroup.style.display = 'grid';
            }, 400)
            break;
    }
}

function endStory() {
    let base = document.querySelector('.load');

    base.classList.add('done');
    localStorage.setItem("story", 'viewed');

    setTimeout(() => {
        base.style.display = 'none';
    }, 3000);
}

initDropdown("#view-select");

for (let button of document.querySelectorAll(".button")) {
    initButton(`#${button.id}`);
}