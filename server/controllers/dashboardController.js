const Note=require('../models/Notes');
const mongoose=require('mongoose');

//get dashboard

exports.dashboard=async(req,res)=>{
    let perPage=2;
    let page=req.query.page || 1;
    
    const locals={
        title:'Dashboard',
        description: 'Free Nodejs App'
    }
    try{
       // console.log(req.user)
        //console.log(req);
        Note.aggregate([
            {
                $sort:{
                    updatedAt: -1,

                }
            },
              {$match:{user:mongoose.Types.ObjectId(req.session.passport.user)}},
            {
                $project:{
                    title:{$substr:['$title',0,30]},
                    body:{$substr:['$body',0,100]},
                    
                }
            }
        ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(function (err,notes){
            Note.count().exec(function(err,count){
                if(err)return next (err);
                
                res.render('dashboard/index',{
                    locals,
                    notes,
                    layout: '../views/layouts/dashboard',
                    current:page,
                    pages: Math.ceil(count/perPage)
                     } );
                     
            })
        })
       
       
    }catch(error){
      console.log(error)
    }
   
}


//get/ 
//view a specific note

exports.dashboardViewNote = async(req,res)=>{

    const note= await Note.findById({_id: req.params.id})
    .where({user :req.session.passport.user}).lean();
   
    if(note){
       
        res.render('dashboard/view-note',{
            noteID: req.params.id,
            note,
            layout:'../views/layouts/dashboard'
        })
    }else{
        res.send("something went wrong")
    }
}

//put/ 
//update specific note
exports.dashboardUpdateNote = async(req,res)=>{
    try{
        await Note.findOneAndUpdate(
           {_id:req.params.id},
            {title:req.body.title,body:req.body.body,updatesAt:Date.now()}
        ).where({user:req.session.passport.user});
        res.redirect('/dashboard');
    }catch(error){
        console.log(error);
    }
}

//delete/
//update specific note
exports.dashboardDeleteNote = async(req,res)=>{
    try {
        await Note.deleteOne({
            _id:req.params.id
        }).where({user:req.session.passport.user});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
}

//get/ 
//Add notes
exports.dashboardAddNote=async(req,res)=>{
    res.render('dashboard/add',({
        layout:'../views/layouts/dashboard'
    }));
}

//post/ 
//Add notes
exports.dashboardAddNoteSubmit = async(req,res)=>{
    try {
       // console.log(req.body)
        req.body.user=req.session.passport.user;
        await Note.create(req.body);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
}

//get/ 
//search
exports.dashboardSearch= async(req,res)=>{
    try{
        res.render('/dashboard/search',{
            searchResults:' ',
            layout:'../views/layout/dashboard'
        })
    }catch(error){}
}

exports.dashboardSearchSubmit= async(req,res)=>{
    try {
        let searchTerm=req.body.searchTerm;
        const searchNoSpecialChars= searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const searchResults = await Note.find({
          $or: [
            { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
            { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
          ],
        }).where({ user: req.session.passport.user});
    
        res.render("dashboard/search", {
          searchResults,
          layout: "../views/layouts/dashboard",
        });
      } catch (error) {
        console.log(error);
      }
    };
    