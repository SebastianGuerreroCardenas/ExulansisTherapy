
    var openPhotoSwipe = function() {
        var pswpElement = document.querySelectorAll('.pswp')[0];

        // build items array
        var items = [
            {
                src: 'images/1-1.jpg',
                w: 2500,
                h: 1665
            },
            {
                src: 'images/1-2.jpg',
                w: 1500,
                h: 1000
            },
            {
                src: 'images/1-3.jpg',
                w: 1500,
                h: 1000
            },
            {
                src: 'images/1-4.jpg',
                w: 1500,
                h: 1000
            },
            {
                src: 'images/1-5.jpg',
                w: 1500,
                h: 1000
            },
            {
                src: 'images/1-6.jpg',
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

    openPhotoSwipe();
    document.getElementById('btn').onclick = openPhotoSwipe;


