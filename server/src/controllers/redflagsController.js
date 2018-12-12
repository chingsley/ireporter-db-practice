import moment from 'moment';
import nodemailer from 'nodemailer';
import pool from '../db/config';

const smtpTransport = require('nodemailer-smtp-transport');


/**
 * Class RedlfagsController
 */
class RedflagsController {

  /**
   * 
   * @param {object} req request object
   * @param {object} res response objecet
   * @returns {object} 
   */
  static async newRedflag(req, res) {
    const {
      createdBy,
      location,
      status,
      images,
      videos,
      comment,
    } = req;
    const type = 'red-flag';

    try {
      const insertQuery = `INSERT INTO incidents(
        created_on,
        created_by,
         type,
         location,
         status,
         images,
         videos,
         comment
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
      const newRedflag = (await pool.query(insertQuery, [
        moment(new Date()),
        createdBy,
        type,
        location,
        status,
        images,
        videos,
        comment,
      ])).rows[0];

      res.status(201).json({
        status: 201,
        data: [{
          id: newRedflag.id,
          message: 'created red-flag record',
          'red-flag': newRedflag,

        }],
      });
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }


  /**
   * 
   * @param {object} req request object
   * @param {object} res response objecet
   * @returns {object} response
   */
  static async getAll(req, res) {
    res.send('redflagsController.getAll connected ...');
  }

  /**
     * 
     * @param {object} req request object
     * @param {object} res response objecet
     * @returns {object} response
     */
  static async editStatus(req, res) {
    const queryStr = 'UPDATE incidents SET status=$1 WHERE id=$2 AND type=$3 returning *';
    try {
      const redflag = (await pool.query(queryStr, [req.status, req.params.id, 'red-flag'])).rows[0];
      if (!redflag) {
        return res.status(404).json({
          status: 404,
          error: 'no red-flag matches the specified id',
        });
      }

      res.status(200).json({
        status: 200,
        data: [{
         id: redflag.id,
          message: 'Updated red-flag\'s status',
          'red-flag': redflag,
        }],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

/**
   * 
   * @param {object} req request object
   * @param {object} res response objecet
   * @returns {object} response
   */
  static async editLocation(req, res) {
    const queryStr = 'SELECT * FROM incidents WHERE id=$1 AND type=$2';
    const queryStrUpdate = 'UPDATE incidents SET location=$1 WHERE id=$2 RETURNING *';
    try {
      const redflag = (await pool.query(queryStr, [req.params.id, 'red-flag'])).rows[0];
      if (!redflag) {
        return res.status(404).json({
          status: 404,
          error: `No red-flag matches the id of ${req.params.id}`,
        });
      }
      if(redflag.created_by !== req.userId) {
        return res.status(401).json({
          status: 401,
          error: `You do not have the authorization to edit that red-flag`
        });
      }
      if(redflag.status !== 'draft') {
        return res.status(403).json({
          status: 403,
          error: `The specified red-flag cannot be edited because it is ${redflag.status}`
        });
      }

      const updatedRedflag = (await pool.query(queryStrUpdate, [req.location, req.params.id])).rows[0];
      return res.status(200).json({
        status: 200,
        data: [{
          id: updatedRedflag.id,
          message: `Updated red-flag's location`,
          "red-flag": updatedRedflag
        }]
      });
     
    }catch(error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

/**
   * 
   * @param {object} req request object
   * @param {object} res response objecet
   * @returns {object} 
   */
  static async editComment(req, res) {
    const queryStr = 'SELECT * FROM incidents WHERE id=$1 AND type=$2';
    const queryStrUpdate = 'UPDATE incidents SET comment=$1 WHERE id=$2 RETURNING *';
    try {
      const redflag = (await pool.query(queryStr, [req.params.id, 'red-flag'])).rows[0];
      if (!redflag) {
        return res.status(404).json({
          status: 404,
          error: `No red-flag matches the id of ${req.params.id}`,
        });
      }
      if (redflag.created_by !== req.userId) {
        return res.status(401).json({
          status: 401,
          error: `You do not have the authorization to edit that red-flag`
        });
      }
      if (redflag.status !== 'draft') {
        return res.status(403).json({
          status: 403,
          error: `The specified red-flag cannot be edited because it is ${redflag.status}`
        });
      }

      const updatedRedflag = (await pool.query(queryStrUpdate, [req.comment, req.params.id])).rows[0];
      return res.status(200).json({
        status: 200,
        data: [{
          id: updatedRedflag.id,
          message: `Updated red-flag's comment`,
          "red-flag": updatedRedflag
        }]
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

/**
   * 
   * @param {object} req request object
   * @param {object} res response objecet
   * @returns {object} as response
   */
  static async getOne(req, res) {
    res.send('redflagsController.getOne connected ... ');
  }

/**
   * 
   * @param {object} req request object
   * @param {object} res response objecet
   * @returns {object} 
   */
  static async delete(req, res) {
    res.send('redflagsController.delete connected ... ');
  }
}

export default RedflagsController;
