const proj_folder  = process.cwd()+'/';
const src_folder   = process.cwd()+'/src';
const lib_folder   = process.cwd()+'/lib';
const build_folder = process.cwd()+'/build';

global.config = {
  paths: {
    src: {
      index: src_folder,
      images: src_folder + '/images',
    },
    build: {
      index: build_folder,
      images: build_folder + '/images',
    },
    lib: lib_folder,
    project: proj_folder
  },
  newsletterType: {
    alumni : 
      {
        headline   : "News for Alumni",
        originDate :  1470052800, // 08/01/2016 @ 12:00pm (UTC)
        interval   : "Monthly",
        headerImg  : "http://image.ucm-email.chaminade.edu/lib/fe9213727d65047e7d/m/1/d25f2a05-83f9-462e-9dcc-1051765db20e.jpg"
      },
    employees : 
      {
        headline   : "News for the Chaminade Ohana",
        originDate :  1471824000, // 08/22/2016 @ 12:00pm (UTC)
        interval   : "Biweekly",
        headerImg  : "http://image.ucm-email.chaminade.edu/lib/fe9213727d65047e7d/m/1/6d051d52-5ade-460a-8d59-791b5d6cbd15.jpg"
      },
    friends : 
      {
        headline   : "Friends of Chaminade University",
        originDate :  1475323200, // 10/01/2016 @ 12:00pm (UTC)
        interval   : "Monthly",
        headerImg  : "http://image.ucm-email.chaminade.edu/lib/fe9213727d65047e7d/m/1/d25f2a05-83f9-462e-9dcc-1051765db20e.jpg"
      },
    oop_memo : 
      {
        headline   : "From the Office of the President",
        originDate : "", // None
        headerImg  : "" // None
      },
    example : 
      {
        headline   : "Chaminade Newsletter Headline",
        headerImg  : "http://image.ucm-email.chaminade.edu/lib/fe9213727d65047e7d/m/1/d25f2a05-83f9-462e-9dcc-1051765db20e.jpg",
        originDate : "" // None
      },
    blank :
      {
        headline   : "", // None
        originDate : "", // None
        headerImg  : ""  // None
      }
  }
};
