$( document ).ready(function() {
    
    
    //page logic

    //once data is loaded it adds all the galleries to the nav par
    function addNavItems(galleries){
        console.log('Adding Nav Items...');
        for (var i = 0; i < galleries.gallery.length; i++) {
            $('#slide-out').append(`<li><a href="?gallery=${galleries.gallery[i].filename}">${galleries.gallery[i].title}</a></li> <li><div class="divider"></div></li>`);
        }
    }


    function generateSlides(gallery, index) {
        let items = [];
        for (var i = gallery.start; i <= gallery.end; i++) {
            let srcI = `images/${gallery.filename}/${gallery.filename}-${i}.jpg`;
            let wI = (gallery.imageDescriptions['i'+i] === undefined) ? 1500 :  gallery.imageDescriptions['i'+i].size.w;
            let hI = (gallery.imageDescriptions['i'+i] === undefined) ? 1000 :  gallery.imageDescriptions['i'+i].size.h;
            let titleI = (gallery.imageDescriptions['i'+i] === undefined) ? null :  gallery.imageDescriptions['i'+i].description;
            items.push({ src: srcI, w: wI, h: hI, title: titleI})
        }
        return {slides: items} 
    }



    //given a galley, gets all the images, adds photoswipe and respective content
    function createGallery(gallery) {
        let order = gallery.order;
        console.log(order);
        let COUNT = 3;
        $('#title').append(gallery.title);
        $('#description').append(gallery.description);
        let content = "";
        for (var i = gallery.start; i <= gallery.end; i++) {
            if (order) {
                content += `<div class="col s12 m6 l4 center-align test"><img class="thumbnail card hoverable" data-filename="${gallery.filename}" data-index="${i}" id="i${i}" src="images/${gallery.filename}/${gallery.filename}-${i}.jpg"></div>`;
                if (i % COUNT === 0 ) {
                    $('#imagesOrder').append(`<div class="row valign-wrapper"> ${content} </div>`);
                    content = "";
                }
            } else {
                $('#imagesNoOrder').append(`<div class="card hoverable"><div class="card-image"><img class="thumbnail" data-filename="${gallery.filename}" data-index="${i}" id="i${i}" src="images/${gallery.filename}/${gallery.filename}-${i}.jpg"></div></div>`);
            }
        }

        $('img').click(function(e) {
            let indexI = parseInt(e.target.getAttribute('data-index'));
            let filename = e.target.getAttribute('data-filename');
            let galleryS = JSON.parse(localStorage.getItem('g'));
            let gallery = findGallery(galleryS, filename);
            let final = generateSlides(gallery, indexI);
            var offset = $(this).offset();
            openGalleryFromPhoto(final.slides, {showHideOpacity: true, index: indexI  - 1, getThumbBoundsFn: function(i) { 
                                                                                                    var thumbnail = $('#i'+ (i + 1))[0], // find thumbnail
                                                                                                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                                                                                                    rect = thumbnail.getBoundingClientRect(); 

                                                                                                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                                                                                                }});
        });
    }

    //selects a random image to show from all the galleries
    function homePage(galleries) {
        let total = galleries.gallery.length;
        let gal = Math.floor( (Math.random() * total));
        let end = galleries.gallery[gal].end;
        let filename = galleries.gallery[gal].filename;
        $('#cover').append( `<a href="?gallery=${filename}"><img class="responsive-img" src="images/${filename}/${filename}-${ Math.floor((Math.random() * end) + 1) }.jpg"></img></a>`);
    }

    function findGallery(galleries, filename){
        for (var i = 0; i < galleries.gallery.length; i++) {            
            if (galleries.gallery[i].filename === filename) {
                return galleries.gallery[i];
            }
        }
        console.log('no gallery found');
        return null;
    }

    function handleView(galleries){
        let gallery = decodeURI($.urlParam('gallery'));
        console.log(gallery);
        if (gallery != "NO") {
            console.log('gallery name is ' + gallery);
            //add logic for specific gallery
            createGallery(findGallery(galleries, gallery));
        } else {
            console.log('no gallery');
            homePage(galleries)
        }
    }


    //runs once and handles all logic
    function main(){
        console.log('app is starting..')
        galleries = getGalleries();
        localStorage.setItem('g', JSON.stringify(galleries) )
        addNavItems(galleries);
        handleView(galleries);
    }




    //Helper functions

    $.urlParam = function(name){
        try {
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            return results[1] || 0;
        } catch(err) {
            console.log(err);
            return "NO";
        }
    }

    //Load JSON Data
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

    function getGalleries() {

        return {
                "gallery" : [
                                {
                                    "filename": "1",
                                    "title": "Summer",
                                    "order": true,
                                    "start": 1,
                                    "end": 32,
                                    "description": "mus vitae porttitor urna, vitae lobortis mauris. Etiam vulputate viverra venenatis.",
                                    "imageDescriptions": {}
                                },
                                {
                                    "filename": "2",
                                    "title": "Schenley",
                                    "order": false,
                                    "start": 1,
                                    "end": 4,
                                    "description": "mus vitae porttitor urna, vitae lobortis mauris. Etiam vulputate viverra venenatis.",
                                    "imageDescriptions": {"i1": {"size": {"w": 3000, "h": 3000} , "description": "This is a tree" }}
                                }
                ]
            }


        console.log('getting data....')
        loadJSON(function(response) {
            // Parse JSON string into object
            return JSON.parse(response);
        });
    }


    //PhotoSwipe Code
    var openGalleryFromPhoto = function(slides, newOptions) {
        var pswpElement = document.querySelectorAll('.pswp')[0];

        // build items array
        var items = slides;
        
        // define options (if needed)
        var options = newOptions;
        
        console.log(items, options)
        var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };


    //Materilize Jquery
    $(".button-collapse").sideNav();


    main();

});


