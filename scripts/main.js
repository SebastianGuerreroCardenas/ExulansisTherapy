$( document ).ready(function() {
    
    var openPhotoSwipe = function() {
        var pswpElement = document.querySelectorAll('.pswp')[0];

        // build items array
        var items = [
            {
                src: 'images/1/1-1.jpg',
                w: 2500,
                h: 1665,
                title: 'Father'
            },
            {
                src: 'images/1/1-2.jpg',
                w: 1500,
                h: 1000
            },
            {
                src: 'images/1/1-3.jpg',
                w: 1500,
                h: 1000
            },
            {
                src: 'images/1/1-4.jpg',
                w: 1500,
                h: 1000
            },
            {
                src: 'images/1/1-5.jpg',
                w: 1500,
                h: 1000
            },
            {
                src: 'images/1/1-6.jpg',
                w: 1500,
                h: 1000
            },
        ];
        
        // define options (if needed)
        var options = {
                 // history & focus options are disabled on CodePen        
            history: false,
            focus: false,

            showAnimationDuration: 0,
            hideAnimationDuration: 0
            
        };
        
        var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    //openPhotoSwipe();


    $('#btn').click(function(e) {
        openPhotoSwipe();
    })

    // $.getJSON('gallery.json', function(data) {
    //     console.log(data);
    // });


    function loadJSON(callback) {   

        var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
        xobj.open('GET', 'gallery.json', true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
              if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
              }
        };
        xobj.send(null);  
 }
 loadJSON(function(response) {
  // Parse JSON string into object
    var actual_JSON = JSON.parse(response);
 });

    //document.getElementById('btn').onclick = openPhotoSwipe;

    $(".button-collapse").sideNav();




});


