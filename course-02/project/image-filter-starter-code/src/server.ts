import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { nextTick } from 'process';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get("/filteredimage/",async (req, res, next) => {
    try{
      let url = req.query;
      
      if(!url)
      {
        return res.status(400).send("Please enter a valid image url");
      }
      else
      {
        var pattern = new RegExp('^https?:.*\.(jpg|jpeg|png|webp|avif|gif|svg)');
        if(pattern.test(req.query.url))
        {
          let filteredimage : string = await filterImageFromURL(req.query.url) as string;
    
          res.status(200);
          res.sendFile(filteredimage);
          res.on('finish', () => deleteLocalFiles([filteredimage]));
          
        }
        else
        {
          return res.status(400).send("Please enter a valid image url");
        }
      }
    }
    catch(err)
    {
      return res.status(400).send("Failed to apply filters, try again later");;
    }
    
  });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();