const express = require('express');
const router = express.Router();
const fs = require('fs');
const { check, param, validationResult } = require('express-validator');
const {StandardAnswers} = require('../StandardAnswers');
const path = require('path');

const authAdmin = require('../../middleware/authAdmin');
const validate = require('../../validators/methods');

const Painting = require('../../models/Painting');

//@route    GET api/painting/
//@desc     Get all painting records
//@access   Public
router.get('/', (req, res) => {
    Painting.find()
        .then(items => res.json(items))
        .catch((err) => {
          let {status, answer} = StandardAnswers['DB_error_general'];
          res.status(status).json(answer);
        })
});

//@route    GET api/painting/ids
//@desc     Gets all the ids of the stored paintings.
//@access   Public
router.get('/ids', (req, res) => {
    Painting.find({})
        .select('date')
        .sort({ date: -1 })
        .then(ids => res.json(ids))
        .catch((err) => {
          let {status, answer} = StandardAnswers['DB_error_general'];
          res.status(status).json(answer);
        })
});


//@route    GET api/painting/:id
//@desc     Get a paining according to id
//@access   Public
router.get('/:id',
    param('id').exists(),
    (req, res) => {
        // Check valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // errors.array() gives you the things gone wrong
          let answer = StandardAnswers['invalid_request_general_admin'];
          return res.status(answer.status).json(answer.answer);
        }
        // Valid
        Painting.findById(req.params.id)
            .then(item => res.json(item))
            .catch(err => {
              let answer = StandardAnswers['painting_not_found_client'];
              res.status(answer.status).json(answer.answer)
            });
    });


//========================= ADMIN ========================//

//@route    POST api/painting/
//@desc     Create new painting meta data
//@access   Admin
router.post('/',
    authAdmin,
    validate('createPainting'),
    (req, res) => {
        console.log(req.user)
        //Check input is valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let answer = StandardAnswers['invalid_request_general_admin'];
            return res.status(answer.status).json(answer.answer);
            // return res.status(422).json({ errors: errors.array() });
        }

        const { name, filename, date, description, materials, price, status, size, stock_amount } = req.body;
        const newPainting = new Painting({
            name,
            materials,
            date,
            description,
            filename,
            price,
            status,
            size,
            stock_amount
        });

        newPainting
            .save()
            .then(painting => res.json(painting))
            .catch(err => {
              let {status, answer} = StandardAnswers['painting_not_created_admin'];
              res.status(status).json(answer)
            });
    }
);

//@route    DELETE api/painting/:id
//@desc     Delete a painting
//@access   Admin
router.delete('/:id',
    authAdmin,
    validate('deletePainting'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let answer = StandardAnswers['invalid_request_general_client'];
            return res.status(answer.status).json(answer.answer);
            // return res.status(422).json({ errors: errors.array() });
        }
        Painting.findById(req.params.id)
            .then(painting => {
              painting.remove()
                .then(() => res.json({ success: true }))
                .catch(err => {
                  let answer = StandardAnswers['DB_error_general'];
                  return res.status(answer.status).json(answer.answer);
                })
            })
            .catch(err => {
              let answer = StandardAnswers['painting_not_found_admin'];
              return res.status(answer.status).json(answer.answer);
            })
    });

//@route    PATCH api/painting/:id
//@desc     Edit painting meta data
//@access   Admin
router.patch('/:id',
    authAdmin,
    validate('editPainting'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let answer = StandardAnswers['invalid_request_general_admin'];
            answer.answer.furthermessage = errors.array();
            return res.status(answer.status).json(answer.answer);
            // return res.status(422).json({ errors: errors.array() });
        }
        const { name, filename, date, description, materials, price, status, size, stock_amount } = req.body;

        Painting.findById(req.params.id)
            .then(painting => {
                const paintingObj = {
                    name: name || painting.name,
                    filename: filename || painting.filename,
                    date: date || painting.date,
                    description: description || painting.description,
                    materials: materials || painting.materials,
                    price: price || painting.price,
                    status: status || painting.status,
                    size: size || painting.size,
                    stock_amount: stock_amount || painting.stock_amount
                };

                Painting.updateOne(
                    { _id: req.params.id },
                    paintingObj,
                    { upsert: true, new: true }
                )
                    .then((painting)=>{
                        res.status(200).json({ success: true });
                    })
                    .catch(err => {
                      let answer = StandardAnswers['painting_not_updated_admin'];
                      return res.status(answer.status).json(answer.answer);
                    })

            })
            .catch(err => {
              let answer = StandardAnswers['painting_not_found_admin'];
              return res.status(answer.status).json(answer.answer);
            });
    });

/*
//@route    PATCH api/painting/
//@desc     Reset a parameter of all paintings to a chosen value.
//@access   Admin
router.patch('/',
    authAdmin,
    validate('editPaintings'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        // These are the ones you can edit alltogether
        const { date, description, materials, status, size, stock_amount } = req.body;
        const paintingStatus = status; //For some reason status is not available in .then (below)
        console.log('Changing all paintings...');

        Painting.find()
            .then(paintings => {

                // Async function to update and count updated paintings
                const updateAll = async () => {
                    var paintingsTotal = 0;
                    var paintingsEditted = 0;
                    var paintingsErrors = [];    // Stores erroneous ids.

                    // Go through each painting and try to udate all. Count how many updated.
                    let promise = new Promise((resolve, reject) => {
                        for (var i = 0; i < paintings.length; i++) {

                            paintingsTotal = paintingsTotal + 1;

                            var painting = paintings[i];
                            var paintingObj = {
                                date: date || painting.date,
                                description: description || painting.description,
                                materials: materials || painting.materials,
                                status: paintingStatus || painting.status,
                                size: size || painting.size,
                                stock_amount: stock_amount || painting.stock_amount
                            };

                            Painting.updateOne(
                                { _id: painting._id },
                                paintingObj,
                                { upsert: true, new: true }
                            )
                                .catch(err => {
                                    console.log('Failed');
                                    paintingsErrors.push(painting._id);
                                    paintingsEditted = paintingsEditted - 1;
                                })
                            paintingsEditted = paintingsEditted + 1;
                        };
                        resolve({
                            paintingsEditted,
                            paintingsTotal,
                            paintingsErrors
                        });
                    })

                    let result = await promise;

                    return result;
                }

                // Call async function
                updateAll().then(result => {
                    const { paintingsEditted, paintingsTotal, paintingsErrors } = result;
                    // Output how it went
                    const message = `Editted ${paintingsEditted} out of ${paintingsTotal} paintings successfully.`;
                    const status = 200;
                    if (paintingsErrors.length > 0) {
                        const status = 500;
                    }

                    res.status(status).json({ 'message': message, 'failed': paintingsErrors });
                });
            })
            .catch(err => res.status(500).json({ success: false }));
    })
*/

//@route        PATCH api/painting/:id/photos/delete/filename
//@decription   Delete photo for this painting
//              Takes an argument of filename, which corresponds to the filename to delete.
//              Deletes photo from filesystem.
//@access       Admin
router.patch('/:id/photos/delete/filename',
    authAdmin,
    validate('deleteFilename'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          let {answer, status} = StandardAnswers['invalid_request_photo_filename_admin']
          return res.status(status).json(answer);
        }


        const SUCCESS = 1
        const PAINTING_NOT_FOUND = 2
        const FILENAME_NOT_SAVED = 3
        const FILENAME_IS_LAST = 4
        const PHOTO_NOT_SAVED = 5
        const FAILURE_FILENAME = 6
        const FAILURE_PHOTO = 7

        const on_Success = (res) => {
          res.status(200).send()
        }
        const on_Painting_Not_Found = (res) => {
          let {status, answer} = StandardAnswers['painting_not_found_admin']
          res.status(status).json(answer)
        }
        const on_Filename_Not_Saved = (res) => {
          let {status, answer} = StandardAnswers['invalid_request_general_admin']
          res.status(status).json(answer)
        }
        const on_Filename_Is_Last = (res) => {
          let {status, answer} = StandardAnswers['painting_last_photo_remaining_admin']
          res.status(status).json(answer)
        }
        const on_Filename_Failure = (res) => {
          let {status, answer} = StandardAnswers['DB_error_general']
          res.status(status).json(answer)
        }
        const on_Photo_Not_Saved = (res) => {
          res.status(200).send()
        }
        const on_Photo_Failure = (res, filename) => {
          let {status, answer} = StandardAnswers['painting_photo_not_deleted_admin']
          res.status(status).json(answer({ filename_photo: filename }))
        }


        // RETURN reply
        // REPLY PAINTING NOT FOUND
        // REPLY SUCCESS
        // RETURN PAINTING AS painting
        const checkExists = (paintingID) => {return new Promise((resolve, reject)=> {
          Painting.findById(paintingID)
          .then(painting => {
            resolve({painting: painting, reply: SUCCESS})
          })
          .catch(err => {
            resolve({ reply: PAINTING_NOT_FOUND })
            // PERHAPS THIS ERROR COULD ORIGINATE FROM DATABASE DISCONNECTING //
          })
        })}

        // RETURN reply
        // REPLY FILENAME NOT SAVED
        // REPLY FILENAME IS LAST
        // REPLY FAILURE FILENAME
        // REPLY SUCCESS
        const deleteFilename = (painting, deleteFilename) => {return new Promise((resolve, reject)=> {
          console.log(painting)
          if (painting.filename.includes(deleteFilename)){
            let index = painting.filename.indexOf(deleteFilename)
            painting.filename.splice(index, 1)
            painting.save()
            .then((success) => {
              resolve({reply: SUCCESS})
            })
            .catch((err) => {
              resolve({reply: FAILURE_FILENAME})
            })
          } else {
            resolve({reply: FILENAME_NOT_SAVED})
          }
        })}

        // RETURN reply
        // REPLY SUCCESS
        // REPLY FAILURE PHOTO
        // REPLY PHOTO NOT SAVED
        const deletePhoto = (deleteFilename) => {return new Promise((resolve, reject)=> {
          fs.access(fs_path, (err)=>{
            if (err){
              console.log(err);
              resolve({reply: PHOTO_NOT_SAVED});
            } else  {
              let fs_path = path.resolve('userImages', deleteFilename);
              fs.unlink(fs_path, (err)=>{
                if (err){
                  console.log('Failed to delete file '+fs_path)
                  console.log(err)
                  resolve({reply: FAILURE_PHOTO})
                } else {
                  resolve({reply: SUCCESS})
                }
              })
            }
          })
        })}

        const mainRunner = (paintingID, deleteFilename) => {
          checkExists(paintingID)
          .then(output1 => {
            switch(output1.reply){

            case SUCCESS:
                deleteFilename(output1.painting, deleteFilename)
                .then(output2 => {
                    switch (output2.reply){

                    case SUCCESS:
                        deletePhoto(deletePhoto)
                        .then(output3 => {
                          switch(output3.reply) {

                          case SUCCESS:
                            return on_Success(res)

                          case PHOTO_NOT_SAVED:
                            return on_Photo_Not_Saved(res)

                          case FAILURE_PHOTO:
                            return on_Photo_Failure(res, deleteFilename)


                          }
                        })

                    case FILENAME_NOT_SAVED:
                      return on_Filename_Not_Saved(res)

                    case FILENAME_IS_LAST:
                      return on_Filename_Is_Last(res)

                    case FAILURE_FILENAME:
                      return on_Filename_Failure(res)

                    }
                })

            case PAINTING_NOT_FOUND:
              return on_Painting_Not_Found(res)

            }
          })
        }

        const { filename } = req.body;
        const id = req.params.id;

        mainRunner(id, filename);

});

//@route        PATCH api/painting/:id/photos/add/filename
//@decription   Add photo filename for this painting
//              Takes an argument of filename, which corresponds to the filename to add.
//@access       Admin
router.patch('/:id/photos/add/filename',
    authAdmin,
    validate('addFilename'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          let {answer, status} = StandardAnswers['invalid_request_photo_filename_admin']
          return res.status(status).json(answer);
        }

        const SUCCESS = 1
        const PAINTING_NOT_FOUND = 2
        const FILENAME_NOT_SAVED = 3

        const on_Success = (res) => {
          res.status(200).send()
        }
        const on_Painting_Not_Found = (res) => {
          let {status, answer} = StandardAnswers['painting_not_found_admin']
          res.status(status).json(answer)
        }
        const on_Filename_Not_Saved = (res) => {
          let {status, answer} = StandardAnswers['DB_error_general']
          res.status(status).json(answer)
        }

        Painting.findById(req.params.id)
        .then(painting => {
          painting.filename.push(req.body.filename)
          painting.save()
          .then((success) => {
            return on_Success(res)
          })
          .catch((err) => {
            return on_Filename_Not_Saved(res)
          })
        })
        .catch((err) => {
          return on_Painting_Not_Found(res)
        })

})




module.exports = router;
