$( document ).ready(function() {
    
    
    /*********** 
        Nav Bar
    ************/

    //once data is loaded it adds all the galleries to the nav par
    function addNavItems(galleries){
        console.log('Adding Nav Items...');
        aboutMeNav(galleries);
        for (var i = 0; i < galleries.gallery.length; i++) {
            $('#slide-out').append(`<li><a href="index.html?gallery=${galleries.gallery[i].filename}">${galleries.gallery[i].title}</a></li> <li><div class="divider"></div></li>`);
        }
    }

    function aboutMeNav(galleries) {
        let about = galleries.about;
        $('#mainTitle').append(about.mainTitle);
        $('#name').append(`<span class="white-text name">${about.name}</span>`);
        $('#email').append(`<a href="mailto:${about.email}"><span class="white-text email">${about.email}</span></a>`);
        $('#profile').append(`<img class="circle" src="${about.profilePhoto}">`);
        let photo = randomPhoto(galleries);
        $('#backgroundPhoto').append(`<img src="${photo.path}"></img>`);
    }


    /***************************** 
        Photoswipe logic
    ******************************/


    function generateSlides(gallery, index) {
        let items = [];
        for (var i = gallery.start; i <= gallery.end; i++) {
            let srcI = `images/${gallery.filename}/${gallery.filename}-${i}.jpg`;

            // console.log(srcI);
            let wI = (gallery.imageDescriptions['i'+i] === undefined) ? 1500 :  gallery.imageDescriptions['i'+i].size.w;
            let hI = (gallery.imageDescriptions['i'+i] === undefined) ? 1000 :  gallery.imageDescriptions['i'+i].size.h;
            console.log(gallery.imageDescriptions['i'+i] , 'i'+i , gallery.imageDescriptions);
            let titleI = (gallery.imageDescriptions['i'+i] === undefined) ? null :  gallery.imageDescriptions['i'+i].description;
            items.push({ src: srcI, w: wI, h: hI, title: titleI})
        }
        return {slides: items} 
    }



    function disapearingImages(i){
        setTimeout(function(){
            for(var j = i; j> i - 3; j--) {
                Materialize.fadeInImage(`#i${j}`);
            }
        },1300 + (i * 100));
    }

    //given a galley, gets all the images, adds photoswipe and respective content
    function createGallery(gallery) {
        let order = gallery.order;
        let COUNT = 3;
        $('#title').append(gallery.title);
        $('#description').append(gallery.description);
        let content = "";
        for (var i = gallery.start; i <= gallery.end; i++) {
            if (order) {
                content += `<div class="col s12 m6 l4 center-align test"><img class="thumbnail card hoverable responsive-img" data-filename="${gallery.filename}" data-index="${i}" id="i${i}" src="images/${gallery.filename}/${gallery.filename}-${i}.jpg"></div>`;
                if (i % COUNT === 0 ) {
                    $('#imagesOrder').append(`<div class="row imageRows"> ${content} </div>`);
                    content = "";
                    disapearingImages(i);

                }
            } else {
                $('#imagesNoOrder').append(`<div class="card hoverable"><div class="card-image"><img class="thumbnail" data-filename="${gallery.filename}" data-index="${i}" id="i${i}" src="images/${gallery.filename}/${gallery.filename}-${i}.jpg"></div></div>`);
                Materialize.fadeInImage(`#i${i}`);
            }
        }


        setTimeout(function() { Materialize.showStaggeredList('#menuList');}, 1000 );
        setTimeout(function(){$('.tap-target').tapTarget('open');}, 1000000) //timer for home screen for dialog.

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

        if (window.innerWidth >= 600) {
            $('.imageRows').addClass('valign-wrapper');
        }
    }


    function randomPhoto(galleries) {
        let total = galleries.gallery.length;
        let gal = Math.floor( (Math.random() * total));
        let end = galleries.gallery[gal].end;
        let filename = galleries.gallery[gal].filename;
        return {file: filename, path: `images/${filename}/${filename}-${ Math.floor((Math.random() * end) + 1) }.jpg`}
    }

    //generates home page
    function homePage(galleries) {
        let photo = randomPhoto(galleries);
        $('#cover').append( `<a href="?gallery=${photo.file}"><img class="responsive-img" src="${photo.path}" id="mainPhoto"></img></a>`);
        setTimeout(function() { Materialize.fadeInImage('#mainPhoto')}, 200);
        setTimeout(function() { Materialize.showStaggeredList('#menuList');}, 2000 );
        setTimeout(function(){$('.tap-target').tapTarget('open');}, 20000) //timer for home screen for dialog.
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

                "about": {
                    "name": "Sebastian Guerrero Cardenas",
                    "email": "sebastian.guerrero.cmu@gmail.com",
                    "mainTitle": "Exulansis Therapy",
                    "profilePhoto": "images/2/2-1.jpg"
                },
                "gallery" : [
                                {
                                    "filename": "1",
                                    "title": "Summer Friends",
                                    "order": true,
                                    "start": 1,
                                    "end": 32,
                                    "description": "May 15th was the day when my dad handed me down one of my favorites things and most prized posetions to this day. He gave me his Nikon FM that shoots 35 mm and was a gift to gim when he was 17. He got this camera in exahnge for not going on a trip to New York when he was younger. The camera is very sentimental becasue ithas captured the majority of my childshood, and the majority of what I know about my dads and familys hisstory. I hope to keep using this camear the way it served my family and me",
                                    "imageDescriptions": {
                                                            "i1": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.6
                                                              },
                                                              "description": " "
                                                            },
                                                            "i10": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i11": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i12": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i13": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i14": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1382.3884197828709
                                                              },
                                                              "description": " "
                                                            },
                                                            "i15": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i16": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i17": {
                                                              "size": {
                                                                "w": 1321.934538348803,
                                                                "h": 2000
                                                              },
                                                              "description": " "
                                                            },
                                                            "i18": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i19": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i2": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1389.865563598759
                                                              },
                                                              "description": " "
                                                            },
                                                            "i20": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i21": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i22": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i23": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i24": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i25": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i26": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1332.03125
                                                              },
                                                              "description": " "
                                                            },
                                                            "i27": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1332.03125
                                                              },
                                                              "description": " "
                                                            },
                                                            "i28": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1332.03125
                                                              },
                                                              "description": " "
                                                            },
                                                            "i29": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1332.03125
                                                              },
                                                              "description": " "
                                                            },
                                                            "i3": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i30": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1332.03125
                                                              },
                                                              "description": " "
                                                            },
                                                            "i31": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1380.9954751131222
                                                              },
                                                              "description": " "
                                                            },
                                                            "i32": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i4": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i5": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i6": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i7": {
                                                              "size": {
                                                                "w": 1313,
                                                                "h": 2000
                                                              },
                                                              "description": " "
                                                            },
                                                            "i8": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            },
                                                            "i9": {
                                                              "size": {
                                                                "w": 2000,
                                                                "h": 1333.3333333333333
                                                              },
                                                              "description": " "
                                                            }
                                                          }

                                                            
                                },
                                {
                                    "filename": "2",
                                    "title": "Schenley",
                                    "order": false,
                                    "start": 1,
                                    "end": 4,
                                    "description": "mus vitae porttitor urna, vitae lobortis mauris. Etiam vulputate viverra venenatis.",
                                    "imageDescriptions": {

                                                            }
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
        
        var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };


    //Materilize Jquery
    $(".button-collapse").sideNav();
    $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 300
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true, // Choose whether you can drag to open on touch screens,
            onOpen: function(el) { /* Do Stuff */ }, // A function to be called when sideNav is opened
            onClose: function(el) { /* Do Stuff */ }, // A function to be called when sideNav is closed
        }
    );


    main();

});


