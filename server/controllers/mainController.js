//get homepage

exports.homepage=async(req,res)=>{
    const locals={
        title:'nodejs notes',
        description: 'Free Nodejs App'
    }

    res.render('index',{
    locals,
    layout: '../views/layouts/front-page'
     } );
}


//get about

exports.about=async(req,res)=>{
    const locals={
        title:'About- nodejs notes',
        description: 'Free Nodejs App'
    }

    res.render('about',locals);
}