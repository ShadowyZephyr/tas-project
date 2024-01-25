var c = false;
function search(column) {
    var input, filter, table, tr, td, i, textValue
    input = document.getElementById("levelSearch")
    filter = input.value.toUpperCase();
    table = document.getElementById("tasTable")
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[column];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
}
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, headers, h, dir, switchcount = 0;
    table = document.getElementById("tasTable");
    switching = true;
    dir = "a";
    headers = table.getElementsByTagName("TH");
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (n == 1 || n == 3) {
                if (dir == "a") {
                    if (Number(x.innerHTML) > Number(y.innerHTML)) {
                        shouldSwitch = true;
                        break;
                    } 
                } else if (dir == "d") {
                    if (Number(x.innerHTML) < Number(y.innerHTML)) {
                        shouldSwitch = true;
                        break;
                    }
                } 
            } else {
                if (dir == "a") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "d") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
        } else {
            if (switchcount == 0 && dir == "a") {
                dir = "d";
                switching = true;
            }
        }
    }
    for (i = 0; i < headers.length; i++) {
        h = headers[i].innerHTML;
        if (h.endsWith('▾') || h.endsWith('▴')) {
            headers[i].innerHTML = h.substring(0, h.length - 1);
            h = headers[i].innerHTML;
        }
        if (i == n) {
            if (dir == "a") {
                headers[i].innerHTML = h.concat('▴');
            } else {
                headers[i].innerHTML = h.concat('▾');
            }
        }
    }
}
function cancel() {
    c = true;
}   
function download(name) {
    a = document.getElementById(name);
    if (!c && confirm("Download this macro?")) {
        a.click();
    }
    c = false;
}   