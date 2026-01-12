const express = require('express');
const router = express.Router();
const { getWallet, addTransaction, setDailyLimit } = require('../controllers/walletController');

const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWallet);
router.post('/transaction', protect, addTransaction);
router.put('/limit', protect, setDailyLimit);

module.exports = router;
