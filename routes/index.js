const SeedingController = require('../controllers/seeding.controller');
const SummaryController = require('../controllers/summary.controller')
const asyncHandler = require('../utils/asyncHandler')
const multer = require('multer');

const router = require('express').Router()
const upload = multer({ dest: 'uploads/' });

router.get('/', asyncHandler(SummaryController.getSummary))
router.get('/detail', asyncHandler(SummaryController.getDetailSummary))

router.post('/',
    upload.single('file'),
    asyncHandler(SummaryController.postSummary))

router.post('/seed-clients', SeedingController.seedClients);

module.exports = router