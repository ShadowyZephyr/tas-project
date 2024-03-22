let page = 1;
let rowsPerPage = 15;
let infobox, replay, currentMacros
let dir = 1;
let searchFilter = 'name';
let sorting = 'time';
const macros = fullMacroData.macros;
const searchFilters = ['name','creator','contributor'];
let macrosLength;
window.onload = (e) => {
    document.getElementById('sf0').checked = true;
    infobox = document.getElementById('infobox');
    currentMacros = macros;
    display(macros);
}
function getReplayFromId(macroid) {
    for(let i = 0; i < currentMacros.length; i++) {
        const item = currentMacros[i];
        if(item.id == macroid) {
            return item;
        }
    }
}
function hideButtons() {
    document.getElementById('download-mh').style.display = 'none';
    document.getElementById('download-ybot').style.display = 'none';
    document.getElementById('download-mh').style.visibility = 'hidden';
    document.getElementById('download-ybot').style.visibility = 'hidden';
}
const onClick = (event) => {
    const elem = event.srcElement;
    if (elem.id == 'next') {
        next();
    } else if (elem.id == 'previous') {
        previous();
    } else if (elem.id == 'x') {
        document.getElementById('video').classList.remove('shown');
        hideButtons();
        infobox.style.visibility = 'hidden';
    } else if (Array.from(elem.classList).includes('download')) {
        if(elem.id == 'download-ybot') {
            download(replay.id, 'ybot', '.ybot')
        }
        if(elem.id == 'download-mh') {
            download(replay.id, 'megahack', '.gdr')
        }
    } else if (Array.from(elem.classList).includes("searchFilter")) {
        const index = elem.id.charAt(2);
        searchFilter = searchFilters[index];
    } else if (elem.tagName == 'TD' && elem.parentElement.tagName == 'TR') {
        infobox.style.visibility = 'visible';
        const macroId = elem.parentElement.id;
        replay = getReplayFromId(macroId);
        document.getElementById('level').innerText = replay.name + ' in ' + replay.time + ' by ' + replay.contributor;
        document.getElementById('version').innerText = replay.version; 
        document.getElementById('mode').innerText = replay.mode;    
        document.getElementById('rating').innerText = fullMacroData.ratings[replay.rating];
        document.getElementById('difficulty').innerText = fullMacroData.difficulties[replay.difficulty];
        document.getElementById('levelid').innerText = replay.levelid.toString();
        document.getElementById('creator').innerText = replay.creator;
        document.getElementById('tps').innerText = replay.tps.toString();
        if(replay.desc) {
            document.getElementById('desc').innerText = replay.desc;
        } else {
            document.getElementById('desc').innerText = '';
        }
        if (replay.video) {
            document.getElementById('video').classList.add('shown');
            document.getElementById('video').src = replay.video;
        } else {
            document.getElementById('video').classList.remove('shown');
            document.getElementById('video').src = '';
        }
        hideButtons();
        if (replay.download) {
            if(replay.bot.includes('ybot')) {
                document.getElementById('download-ybot').style.visibility = 'visible';
                document.getElementById('download-ybot').style.display = 'block';
            }
            if(replay.bot.includes('mhr')) {
                document.getElementById('download-mh').style.visibility = 'visible';
                document.getElementById('download-mh').style.display = 'block';
            }
        }
    }
}
window.addEventListener('click', onClick);
function commonElem(arr1, arr2) {
    return arr1.some(item => arr2.includes(item))
}
function filterMacros() {
    const filter = {
        rateFilter: [],
        typeFilter: [],
        botFilter: [],
        videoFilter: [false, true]
    }
    const elems = document.getElementsByClassName('rateFilter');
    const bots = document.getElementsByClassName('botFilter');
    for (let i = 0; i < elems.length; i++) {
        if (elems[i].checked) {
            filter.rateFilter.push(i);
        }
    }
    if(document.getElementById('platformer').checked) {
        filter.typeFilter.push('platformer');
    }
    if(document.getElementById('classic').checked) {
        filter.typeFilter.push('classic');
    }
    for (let i = 0; i < bots.length; i++) {
        if (bots[i].checked) {
            filter.botFilter.push(bots[i].id);
        }
    }
    if(!(document.getElementById('video').checked)) {
        filter.videoFilter = [true];
    }
    console.log(filter.videoFilter);
    let tempMacros = [];
    for(const macro of currentMacros) {
            const hasVideo = macro.video ? true : false;
        console.log(filter.rateFilter.includes(macro.rating + 1),filter.typeFilter.includes(macro.mode),commonElem(filter.botFilter,macro.bot),filter.videoFilter.includes(macro.video))
        if(filter.rateFilter.includes(macro.rating + 1) && filter.typeFilter.includes(macro.mode) && commonElem(filter.botFilter,macro.bot) && filter.videoFilter.includes(hasVideo)) {
            tempMacros.push(macro);
        }
    }
    display(tempMacros);
}
function download(name, folder, filetype) {
    let a = document.getElementById('downloader');
    let path = '/tas-project/' + folder + '/' + name + filetype;
    a.setAttribute('href', path);
    if (confirm("Download this macro?")) {
        a.click();
    }
}   
function display(items) {
    document.getElementById('tasTableBody').innerHTML = '';
    const start = (page - 1) * (rowsPerPage);
    const end = page * (rowsPerPage) - 1;
    macrosLength = items.length;
    const toDisplay = items.slice(start,end+1);
    for (let i = 0; i < toDisplay.length; i++) {
        const rowData = toDisplay[i];
        const tr = document.createElement('tr');
        tr.id = rowData.id;
        const level = document.createElement('td');
        level.innerText = rowData.name;
        tr.appendChild(level);
        const time = document.createElement('td');
        time.innerText = rowData.time;
        tr.appendChild(time);
        const contributor = document.createElement('td');
        contributor.innerText = rowData.contributor;
        tr.appendChild(contributor);
        const difficulty = document.createElement('td');
        difficulty.innerText = fullMacroData.difficulties[rowData.difficulty];
        tr.appendChild(difficulty);
        const update = document.createElement('td');
        update.innerText = rowData.version;
        tr.appendChild(update);
        document.getElementById('tasTableBody').appendChild(tr);     
    }
    const counter = document.getElementById('counter');
    counter.innerText = 'Page ' + page + ' (showing ' + (start+1) + '-' + Math.min(end+1,items.length) + ' of ' + items.length + ')';
}
function next() {
    if (page < macrosLength/rowsPerPage) {
        page += 1;
        filterMacros();
    }
}
function previous() {
    if(page > 1) {
        page -= 1;
        filterMacros();
    }
}
function search() {
    let input = document.getElementById('levelSearch').value;
    currentMacros = [];
    for (let i = 0; i < macros.length; i++) {
        const macro = macros[i];
        if(macro[searchFilter].toLowerCase().includes(input.toLowerCase())) {
            currentMacros.push(macro);
        }
    }
    filterMacros();
}
function fixCase(thing) {
    if(typeof thing == 'string') {
        return thing.toLowerCase();
    }
    return thing;
}
function sortMacros(n) {
    const headers = ['name', 'time', 'contributor','difficulty','version'];
    const th = document.getElementById('tasTable').getElementsByTagName("TH");
    let param = headers[n];
    if (sorting == param) {
        dir = dir * -1;
    } else {
        sorting = param;
        dir = 1;
    }
    macros.sort((a, b) => {
        if(fixCase(a[param]) < fixCase(b[param])) {
            return -1 * dir;
        } else if (fixCase(a[param]) > fixCase(b[param])) {
            return 1 * dir;
        }
        return 0;
    })
    search();
    for (i = 0; i < headers.length; i++) {
        h = th[i].innerHTML;
        if (h.endsWith('▾') || h.endsWith('▴')) {
            th[i].innerHTML = h.substring(0, h.length - 1);
            h = th[i].innerHTML;
        }
        if (i == n) {
            if (dir == 1) {
                th[i].innerHTML = h.concat('▴');
            } else {
                th[i].innerHTML = h.concat('▾');
            }
        }
    }
}