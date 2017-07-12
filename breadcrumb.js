
// patterns to match uri
// here we define uri patterns to match against page uri
// and then we specify index of the regex found matches that we want for our breadcrumb steps
var genericPathsMapping = [
    {"uriPattern": /^(?:.*?)\/users\/(.*?)\/(?:(.*?)\/(?:(.*?)(?:\..*)?)?)?$/i, "associatedBreadcrumbStepsIndexes": [ "1|getFullName", 2, 3]},
    {"uriPattern": /^(?:.*?)\/(help)\/(?:(.*?)(?:\..*)?)?$/, "associatedBreadcrumbStepsIndexes": [ 1, 2]}
];

// some sample uri
var uris = [
    "http://dropbox.com/users/1364/files/joon.js",
    "http://dropbox.com/users/1364/",
    "http://dropbox.com/users/1364/files/",
    "http://dropbox.com/help/uploading.html",
    "http://dropbox.com/help",
    "http://dropbox.com/nowhere"
];

// main func
function getBreadcrumb(uri){

    if(!uri.endsWith("/")){
        uri += "/";
    }

    // for each defined pattern
    for(var map of genericPathsMapping){
        //  check if it matches the current uri
        if(map.uriPattern.test(uri)){
            // if so then get all matches defined in the regex
            var matches = uri.match(map.uriPattern);
            // and index of desired steps
            var bcIndexes = map.associatedBreadcrumbStepsIndexes;
            // add default home step to output
            var output = [{"title": "home", "uri": "http://dropbox.com/"}];
            // for each step in associatedBreadcrumbStepsIndexes
            for(var index of bcIndexes){
                // if index is simply a number
                if(typeof index === "number"){
                    // get its associated match e.g users or mohsen
                    var bc = matches[index];
                    // its uri
                    if(bc != undefined){
                        var bcUri = getBreadcrumbAssociatedUri(uri, bc);
                        // and add it to output
                        output.push({"title": bc, "uri": bcUri });
                    }
                }
                // else if a function is set to retrieve the value
                else{
                    var _index = index.substring(0, 1);
                    var func = index.substring(2);                    
                    if(matches[_index] != undefined){
                        // get its title by calling the func
                        var bc = eval(func)(_index);
                        // the uri
                        var bcUri = getBreadcrumbAssociatedUri(uri, _index);
                        // and add it to output
                        output.push({"title": bc, "uri": bcUri });
                    }
                }
            }

            // return the output that contains breadcrumb steps titles and uris
            return output;
        }
    }

    return [{"title": "Can't find you, Where the hell are you dude ?", "uri": "http://"}];
}

// function to get the uri of each step of breadcrumb
// we return part of the main uri that ends with breadcrump step + /
function getBreadcrumbAssociatedUri(uri, bc){
    // get index of breadcrump step
    var bcIndex = uri.lastIndexOf(bc);
    // get index of first / after breadcrump step
    var slashIndex = uri.indexOf("/", bcIndex);
    // return the uri
    return uri.substring(0, slashIndex + 1);
}

function getFullName(userId){
    return "mohsen joon";
}


// generate sample html content for breadcrumb
var container = document.getElementById("breadcrumb");

for(var uri of uris){
    // each breadrumb div
    var div = document.createElement("div");
    // title (uri)
    var divTitle = document.createElement("div");
    divTitle.innerText = uri;
    div.appendChild(divTitle);
    
    // one anchor for each part of breadcrumb
    uriBc = getBreadcrumb(uri);    
    for(var i = 0; i <= uriBc.length - 1; i++){
        var a = document.createElement("a");    
        if(i < uriBc.length - 1)
            a.href = uriBc[i].uri;
        a.innerText = uriBc[i].title;    
        div.appendChild(a);

        if(i < uriBc.length - 1){
            var arrow = document.createElement("span");
            arrow.innerText = " > ";
            div.appendChild(arrow);
        }
    }
    container.appendChild(div);
}
