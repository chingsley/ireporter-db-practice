import moment from 'moment';
import Validator from '../validators/validator';
import pool from '../db/config';

class InspectRedflag {

    static async newRecord(req, res, next) {
        const { location, comment } = req.body;
        const response400 = message => res.status(400).json({ status: 400, error: message });
        if (!location) return response400(`Please provide location coordinates`);
        if (location && location.toString().trim() === '') return response400('please provide location coordinates');
        if (!comment) return response400(`Please provide comment.`);
        if (comment.toString().trim() === '') return response400(`Please provide comment`);
        if (!Validator.isValidCoordinates(location)) return response400(`Invalid coordinates. A valid coordinates must be in the format: lat, lng  [lat ranges from -90 to 90, lng ranges from -180 to 180]`);
        if (!Validator.isValidComment(comment)) return response400(`Comment must be a minium of 3 words`);

        // if available, create array of images and videos
        const imageArr = [];
        const videoArr = [];
        let imageStr = '';
        let videoStr = '';

        if (req.files) {
            if (req.files.images) {
                req.files.images.forEach((image) => {
                    imageArr.push(image.path);
                });
                imageStr = imageArr.join(', ');
            }
            
            if (req.files.videos) {
                req.files.videos.forEach((video) => {
                    videoArr.push(video.path);
                });
                videoStr = videoArr.join(', ');
            }
        }

        // req.createdOn = moment(new Date()); // this will fail at database if done here. It works only when you use moment(new Date()) in the insert statement within the controller
        req.createdBy = req.userId;
        // 'type' will be set in the individual controllers
        req.location = location.toString().trim();
        req.status = 'draft';
        req.images = imageStr;
        req.videos = videoStr;
        req.comment = comment.toString().trim();

        next();
    }// END newRedflag

    static async getAll(req, res, next) {
        console.log('Inspector.getAll connected ...');
        next();
    }// END getAllRedflags


    static async editStatus(req, res, next) {
        const response400 = message => res.status(400).json({status: 400, error: message});
        let {status} = req.body;
        if(!status) return response400('status field is missing');
        if(status && status.toString().trim() === '') return response400('missing value for status.');
        status = status.toLowerCase().trim();
        if(status !== 'draft' && status != 'under investigation' && status !== 'rejected' && status !== 'resolved') {
            return response400('invalid status. Allowed values are draft, under investigation, rejected, or resolved');
        }
        if (!Number.isInteger(Number(req.params.id))) return response400(`'${req.params.id}' is not a valid id. Records have only positive integer id's`);
        if (Number(req.params.id) < 0) return response400('Records have only positive integer id\'s');


        
        req.status = status;
        next();
    }// END editRedflagStatus


    static async editLocation(req, res, next) {
        console.log('Inspector.editLocation connected ..');
        next();
    }// END editRedflagLocation


    static async editComment(req, res, next) {
        console.log('Inspector.editComment connected ..');
        next();
    }// END editRedflagComment


    static async getOne(req, res, next) {
        console.log('Inspector.getOne connected ... ');
        next();
    }// END getOneRedflag


    static async delete(req, res, next) {
        console.log('Inspector.delete connected ... ');
        next();
    }// END deleteRedflag

} // END class Inspect

export default InspectRedflag;