var fs = require('fs');
var sizeOf = require('image-size');






//https://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object
function readFiles(dirname) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      return;
    }
    let finalObject = { gallery: []}
    to = 0;
    filenames.forEach(function(filename) {
    	to++;
    	if (filename != 'misc') {
    		let i = readImageFolder( filename , 'description');  
    	}
    	if (to == filenames.length) {
    		return finalObject;
    	}
    });
  });

}

function generateImageDescriptions(dirfilename){
	let final = {}
	fs.readdir('images/' + dirfilename, function(err, filenames) {
	    if (err) {
	      return;
	    }
    	let finalObject = { gallery: []}
    	filenames.forEach(function(filename) {
    	});
    });

}

function readImageFolder(dirfilename , description) {
	let gal = {
    		"filename": dirfilename,
    		"title": "Summer",
			"order": false,
			"start": 1,
			"end": 100,
			"description": "mus vitae porttitor urna, vitae lobortis mauris. Etiam vulputate viverra venenatis.",
			"imageDescriptions": {}
    	}

	fs.readdir('images/' + dirfilename, function(err, filenames) {
	    if (err) {
	      return;
	    }
    	let finalObject = { gallery: []}
    	total = 0;
    	filenames.forEach(function(filename) {

    		total++;
    		if (  filename.endsWith('.jpg') ) {
    			let d = readImages(filename, dirfilename );
    			l = filename.split('-')[1];

    			gal.imageDescriptions[ 'i'+ l.substring(0,l.length - 4) ] = d;
    		}
       		if (total == filenames.length) {
    			gal['end'] = filenames.length;
    			createJSONfile(gal);
    			return gal;
    		}
    	});
    });

}

function readImages(name, filename){
	var dimensions = sizeOf(`images/${filename}/${name}`);
	let wGreater = false;  
	if (dimensions.width >= dimensions.height) {
		wGreater = true;
	}

	let bigSIde = wGreater ? dimensions.width : dimensions.height;
	if ( bigSIde > 2000 ) {
		let newWidth = wGreater ? 2000 : ((2000 * dimensions.width) / dimensions.height) ;
		let newHeight = wGreater ? ((2000 * dimensions.height) / dimensions.width): 2000;
		console.log({"name": name, "size": {"w": newWidth , "h": newHeight }, "description": " " });
		return { "size": {"w": newWidth , "h": newHeight }, "description": " " };
	} else {
		return { "size": {"w": dimensions.width , "h": dimensions.height }, "description": " " };
	}
}


function createJSONfile(data) {
	fs.writeFile( `images/${data.filename}.json`, JSON.stringify(data));
}

function main(){
	let j = readFiles('images');
}

main();