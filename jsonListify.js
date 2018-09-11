function generateListifiedJSON(obj, sortKey) {
    var ul = listifyJSON(obj, sortKey);
    ul.id = 'main_list';
    return ul;
}

function listifyJSON(obj, sortKey) {
    if (obj != undefined) {

        // create list element
        let ul = document.createElement('UL');
        
        // iterate through keys
        for (var k in obj)
        {
            if (typeof obj[k] == "object" && obj[k] !== null) {
                // key's value is object, create <li> element containing key
                // then append the value as a child list
                
                // create list element containing key
                let li = document.createElement('LI');
                let textNodeKey = document.createTextNode(k + ': ');
                let spanKey = document.createElement('span');
                spanKey.appendChild(textNodeKey);
                li.appendChild(spanKey);
                spanKey.className = 'objKeys';

                if ( obj[k][sortKey] !== undefined) {
                    let textNodeRoot = document.createTextNode(obj[k][sortKey]);
                    let spanRoot = document.createElement('span');
                    spanRoot.appendChild(textNodeRoot);
                    li.appendChild(spanRoot);
                    spanRoot.className = 'objRoot';
                }
                
                ul.appendChild(li);

                
                if (Object.keys(obj[k]).length !== 0) {
                    // If child object isn't empty:

                    spanKey.className += ' objRootIndex';

                    // recursive call to append value as child list
                    ul.appendChild(listifyJSON(obj[k]));

                    //  1. Add current <li> to class '.collapsible_root'
                    li.className = 'collapsible_root';

                    //  2. Hide child lists
                    let next_element = li.nextElementSibling
                    while (next_element != null && next_element.nodeName.toLowerCase() != 'ul') {
                        next_element = next_element.nextElementSibling;  
                    }
                    next_element.style.display = 'none';



                    //  2. Add onClick event listener to toggle show/hide
                    // add event listener
                    li.addEventListener('click', function () {
                    let next_element = li.nextElementSibling;
                    while (next_element != null && next_element.nodeName.toLowerCase() != 'ul') {
                        next_element = next_element.nextElementSibling;  
                    }
                    if (next_element.style.display == 'none') {
                        next_element.style.display = 'block';
                        li.className += ' collapsible_root_expanded';
                    } 
                    else {
                        next_element.style.display = 'none';
                        li.className = 'collapsible_root';
                    }
                    });

                }
                
            }
            else {
                // key's value is not object, create <li> containing key
                // and value
                
                // append key
                let textNodeKey = document.createTextNode(k);
                let spanKey = document.createElement('span');
                spanKey.setAttribute('class', 'objKeys');
                spanKey.appendChild(textNodeKey);
                let li = document.createElement('LI');
                li.appendChild(spanKey);
                // append value
                let textNodeValue = document.createTextNode(obj[k]);
                let divValue = document.createElement('div');
                divValue.setAttribute('class', 'objValues')
                divValue.appendChild(textNodeValue);
                li.appendChild(divValue);
                // ul.style.listStyleImage = 'none';
                // append list element to list
                ul.appendChild(li);

            }
        }

        // Add spacer 
        let textNodeSpacer = document.createTextNode('\n');
        let li = document.createElement('LI');
        li.setAttribute('class', 'spacer');
        li.appendChild(textNodeSpacer);
        ul.appendChild(li);
        

        return ul;
    }
}   // end listifyJSON()



function listifySortKeys(obj, sortKey) {
    var keys = [];
    for (var i = 0; i < obj.length; i++) {
        for (var key in Object.keys(obj[i])) {
            if (keys.indexOf(Object.keys(obj[i])[key]) < 0) {
                keys.push(Object.keys(obj[i])[key]);
            } 
        }
    }

    let radioSortKeys = document.createElement('FORM');
    radioSortKeys.setAttribute('id', 'radioSortKeys');
    let textNode = document.createTextNode('Sort Keys: ');
    let label = document.createElement('LABEL');
    label.appendChild(textNode);
    radioSortKeys.appendChild(label);
    radioSortKeys.innerHTML += '\n\n';

    for (var i = 0; i < keys.length; i++) {
        let radioInput = document.createElement('INPUT');
        radioInput.setAttribute('type', 'radio');
        radioInput.setAttribute('value', keys[i]);
        radioInput.setAttribute('name', 'radioRootLabel');
        radioInput.addEventListener('click', function (event) {
            var main_list = document.getElementById('main_list');
            var parent_container = main_list.parentElement;
            sortKey = event.target.value;
            var sortedObject = sortObject(jsonData, sortKey); 
            main_list.parentNode.removeChild(main_list);
            var ul = listifyJSON(sortedObject, sortKey);
            ul.id = 'main_list';
            parent_container.appendChild(ul);
        })
        let radioLabel = document.createTextNode(keys[i]);
        let br = document.createElement('BR');
        radioSortKeys.appendChild(radioInput);
        radioSortKeys.appendChild(radioLabel);
        radioSortKeys.appendChild(br);

        // Default to checked if value in global var sortKey has been set and is available as object key
        (keys[i] == sortKey) ? radioInput.checked = true: radioInput.checked = false;
    }
    return radioSortKeys;
}  // end listifySortKeys()




function sortObject(obj, sortKey) {
    var sortedObject = [];
    if (obj != undefined && obj.length > 0) {
        sortedObject = obj.sort(function sortMethod(a, b) {
            if (a[sortKey] && b[sortKey]) {
                switch (typeof a[sortKey] && typeof b[sortKey]) {
                    case 'number' : return (a[sortKey] > b[sortKey]) ? 1 : (a[sortKey] < b[sortKey]) ? -1 : 0; 
                    case 'string' : return (a[sortKey].toLowerCase() > b[sortKey].toLowerCase()) ? 1 : (a[sortKey].toLowerCase() < b[sortKey].toLowerCase()) ? -1 : 0;
                    case 'boolean': return (a[sortKey] - b[sortKey]);
                    case 'object' : {

                        // // // recursively sort objects. defaults to id. 
                        // a = sortObject(a[sortKey], 'id');
                        // b = sortObject(a[sortKey], 'id');
                        // BUG --> Having issues because of lengths of 0 produced by objects returned from recursive call to  sortObject
                    

                        // sort by object length
                        return (a.length && b.length) ? (b.length - a.length) : (a.length) ? 1 : (b.length) ? -1 : 0;
                        
                    }
                }
            }
            return (a[sortKey]) ? -1 : (b[sortKey]) ? 1 : 0;
        })
    }
    return sortedObject;
}   // end sortObject
