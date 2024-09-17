const express = require('express')
const {getData, getDataholdInfo, autosave} = require('../controller/dataController.js')


const router = express.Router();

router.get('/', autosave, getData)
router.get('/data',  getDataholdInfo)

module.exports = router

