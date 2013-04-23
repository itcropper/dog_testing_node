var mongo = require('mongodb');
var url = require('url');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('dogdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'dogdb' database");
        db.collection('dogs', {strict:true}, function(err, collection) {
            if (err && !collection) {
                console.log("The 'dogs' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});


exports.getDogList = function(req, res){
	res.render('../pages/doglist.html');
}

exports.findById = function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
    var id = req.params.name;
    console.log(query['name']);
    console.log('Retrieving dog: ' + query['name']);
    db.findOne({'name':new BSON.ObjectID(query['name'])}, function(err, item) {
        res.send(item);
    });
};

exports.findAll = function(req, res) {
	console.log("GETTIN ALL DOGS")
    db.collection('dogs', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addDog = function(req, res) {
    var dog = req.body;
    console.log('Adding dog: ' + JSON.stringify(dog));
    db.collection('dogs', function(err, collection) {
        collection.insert(dog, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateDog = function(req, res) {
    var id = req.params.id;
    var dog = req.body;
    console.log('Updating dog: ' + id);
    console.log(JSON.stringify(dog));
    db.collection('dogs', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, dog, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating dog: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(dog);
            }
        });
    });
}

exports.deleteDog = function(req, res) {
    var id = req.params.id;
    console.log('Deleting dog: ' + id);
    db.collection('dogs', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var dogs = [
    {
        name: "Belgian Malinoise",
        year: "2009",
        imageurl: "http://cdn.pedigreedatabase.com/dogbreeds/belgian_malinois.jpg",
        weight: "65",
        color: "Black and Tan",
        description: "fantastic dog with intimidation. Always looking to please"
    },
    {
        name: "Bernese Mountain Dog",
        year: "2012",
        imageurl: "http://www.dogbreedinfo.com/images14/BerneseMountainDogKLEOPATRAHERUSPOSEIDONAS.JPG",
        weight: "85",
        color: "Black and Tan",
        description: "Good temperment. Always looking to please"
    },
    {
        name: "Yorkshire Terrier",
        year: "2012",
        imageurl: "http://www.dogbreedhealth.com/wp-content/uploads/2011/04/Yorkshire-Terrier.jpg",
        weight: "15",
        color: "Black and Tan",
        description: "Good temperment.Cheerful and happy"
    },

    ];

    db.collection('dogs', function(err, collection) {
        collection.insert(dogs, {safe:true, '$exists' : false}, function(err, result) {});
    });

};