var express = require('express');
var uuid = require('node-uuid');
var router=express.Router();
var mongoose=require('mongoose');
var Post = mongoose.model('Post');
var Bar = mongoose.model('Bar');
var BarReviews=mongoose.model('Reviews');
var ObjectId = require('mongodb').ObjectID;

// create your own middleware
router.use(function(req,res,next){

	if (req.method=="GET"){
		return next();
	}

	if(!req.isAuthenticated()){
		return res.redirect('/#login');
	}
	return next();
})


router.route('/barreview')
.get(function(req, res){
        BarReviews.find(function(err, reviews){
            if(err){
                return res.send(500, err);
            }
            return res.send(reviews);
        });
    })
.post(function(req, res){        
        var barreview = new BarReviews();
        barreview.barId = req.body.barId;
        barreview.review=req.body.review;
        barreview.rating=req.body.rating;        
        barreview.userId = req.body.userId;

        barreview.save(function(err, reviews) {
            if (err){
                return res.send(500, err);
            }
            return res.json(reviews);
        });
    });

router.route('/barreview/:id')
.put(function(req,res){
    res.send('ddd')
    // BarReviews.find({_id:req.params.id},function(err,reviews){
    //     if(err){
    //         res.send(500,err)
    //     }
    //     res.send(200,reviews);
    // })
});

router.route('/barreview/:id')
.get(function(req, res){
        BarReviews.find({barId:req.params.id},function(err, reviews){
            if(err){
                return res.send(500, err);
            }
            return res.json(reviews);
        });
    })
// .put(function(req, res){
//          BarReviews.findOne({_id:ObjectId(req.params.id)}, function(err, post){
//             res.send(post);
//          });
//      })
// .put(function(req,res){
//     BarReviews.findById(req.params.id,function(barReview){
//         barReview.review=req.body.review;
//         barReview.rating=req.body.rating;
//         barReview.created_at=req.body.created_at;

//         barReview.save(function(err,data){
//             if(err){
//                 res.send(500,err);
//             }
//             res.json(data);
//         });
//     });
// })
.delete(function(req, res) {
        BarReviews.remove({
            _id: ObjectId(req.params.id)
        }, function(err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
});



router.route('/bars')
.get(function(req,res){
    Bar.find(function(err,bars){
        if(err){
            return res.send(500,err);
        }
        return res.send(bars);
    });
})

.post(function(req,res){
    var objBar=new Bar();
    objBar.id=uuid.v4();
    
    objBar.name=req.body.name;
    objBar.address=req.body.address;
    objBar.stateId=req.body.stateId;
    objBar.cuisines=req.body.cuisines;
    objBar.type=req.body.type;
    objBar.description1=req.body.description1;
    objBar.description2=req.body.description2;
    objBar.description3=req.body.description3;
    objBar.contactNumber=req.body.contactNumber;
    objBar.img.data = fs.readFileSync('C:\\Users\\Public\\Pictures\\Sample Pictures\\Chrysanthemum.jpg');
    objBar.img.contentType = 'image/png';

    objBar.save(function(err,user){
        if(err){
              return res.send(500, err);
        }
         return res.json(objBar);
    });
});



module.exports=router;