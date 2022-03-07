
 // flatten object by concatting values
 function concatValues( obj ) {
    var value = '';
    for ( var prop in obj ) {
        value += obj[ prop ];
    }
    return value;
}

/* use value of search field to filter
    var $quicksearch = $('#class-search-input').keyup( debounce( function() {
        qsRegex = new RegExp( $quicksearch.val(), 'gi' );
        $grid.isotope();
    }, 200 ) );*/


    // debounce so filtering doesn't happen every millisecond
    function debounce( fn, threshold ) {
        var timeout;
        threshold = threshold || 100;
        return function debounced() {
            clearTimeout( timeout );
            var args = arguments;
            var _this = this;
            function delayed() {
            fn.apply( _this, args );
            }
            timeout = setTimeout( delayed, threshold );
        };
    }

/*search term*/
function search(){
    var searchTerm=$('#class-search-input').val();
    var href="/MyCLL/Instances?search="+encodeURIComponent(searchTerm);

    var cname=getUrlParameter('cname');
    if(cname){
        href=href+'&cname='+cname;
    }

    window.location.href = href;
}



/*https://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript*/
function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts= url.split('?');   
    if (urlparts.length>=2) {

        var prefix= encodeURIComponent(parameter)+'=';
        var pars= urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i= pars.length; i-- > 0;) {    
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                pars.splice(i, 1);
            }
        }

        url= urlparts[0]+'?'+pars.join('&');
        return url;
    } else {
        return url;
    }
}

/* Helper function to get URL Params
https://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
*/
var getUrlParameter = function getUrlParameter(sParam,customUrl) {

    var sPageURL = window.location.search.substring(1);

    if(customUrl!=null){
        sPageURL = customUrl.split('?')[1];
    }   

    var sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function init(){
    $('.catbackbutton').on('click',function(){

        /*Persist filters through URL if using return to previous page button*/
        var url = window.location.href;
        var urlParts = /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(url);
        var hostname = urlParts[1]; // www.example.com
        var path = urlParts[2];
        var qs = "?";

        var dayOfWeekParam=getUrlParameter('dayofweek');
        qs += dayOfWeekParam ? 'dayofweek='+dayOfWeekParam : "";

        var timeOfDayParam=getUrlParameter('timeofday');
        qs += timeOfDayParam ? '&timeofday='+timeOfDayParam : "";

        var creditbearingParam=getUrlParameter('creditbearing');
        qs += creditbearingParam ? '&creditbearing='+creditbearingParam : "";

        var modeOfDeliveryParam=getUrlParameter('modeofdelivery');
        qs += modeOfDeliveryParam ? '&modeofdelivery='+modeOfDeliveryParam : "";

        var campaignProgrammeParam=getUrlParameter('campaignProgramme');
        qs += campaignProgrammeParam ? '&campaignProgramme='+campaignProgrammeParam : "";

        if(path=="/MyCLL/Instances"){
            var cidParam=getUrlParameter('cid');
            var cnameParam=getUrlParameter('cname');
            qs += cidParam ? '&cid='+cidParam : "";
            qs += cnameParam ? '&cname='+cnameParam : "";
        }

        var referrerURL = document.referrer;
        if(path=="/MyCLL/Classes"){
            if(referrerURL.includes("&")){
                var referrercid = getUrlParameter('cid',referrerURL);
                var referrercname = getUrlParameter('cname',referrerURL);
                if(referrercid!="" && referrercid!=null && referrercname!="" && referrercname!=null){
                    /*window.history.back();*/
                    qs += referrercid ? '&cid='+referrercid : "";
                    qs += referrercname ? '&cname='+referrercname : "";
                    var link = document.createElement("a");
                    link.referrerPolicy = "no-referrer";
                    link.rel = "noreferrer";

                    link.href = "https://" + hostname + "/MyCLL/Classes" + qs;
                    link.click();
                    //window.location.replace("https://" + hostname + "/MyCLL/Classes" + qs);
                } else {
                    window.location.replace("https://" + hostname + qs);
                }
            } else {
                window.location.replace("https://" + hostname + qs);
            }
            
            console.log(hostname + qs);
        } else if(path=="/MyCLL/Instances"){
            if(referrerURL.includes("/MyCLL/Classes")){
                var redirect = "https://" + hostname + "/MyCLL/Classes" + qs;
                window.location.replace(redirect);
            } else {
                window.history.back();    
            }
        } else {
            window.history.back();
        }
    });

    $('#class-search-button').on('click',function(){
        search();
    });

    $("#class-search-input").keyup(function(e){ 
        var code = e.which; // recommended to use e.which, it's normalized across browsers
        if(code==13){
            search();
        }
    });
}