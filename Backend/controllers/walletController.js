const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get wallet data
// @route   GET /api/wallet
// @access  Private
const getWallet = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // Middleware ensures user exists, but check safety
        if (!user) return res.status(404).json({ message: 'User not found' });

        const transactions = await Transaction.find({ user: req.user.id })
            .sort({ date: -1 })
            .limit(50);

        res.json({
            pocketBalance: user.pocketBalance,
            vaultBalance: user.vaultBalance,
            dailyLimit: user.dailyLimit,
            spentToday: user.spentToday,
            quickAddItems: user.quickAddItems,
            transactions,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add transaction
// @route   POST /api/wallet/transaction
// @access  Private
const addTransaction = async (req, res) => {
    const { amount, type, category, wallet, note } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        // specific logic based on type and wallet
        if (type === 'deposit') {
            if (wallet === 'pocket') {
                user.pocketBalance += amount;
            } else {
                user.vaultBalance += amount;
            }
        } else if (type === 'expense') {
            if (wallet === 'pocket') {
                user.pocketBalance -= amount;
                user.spentToday += amount;
            } else {
                user.vaultBalance -= amount;
            }

            // Update Quick Add Items logic
            const existingItemIndex = user.quickAddItems.findIndex(
                (item) => item.name.toLowerCase() === category.toLowerCase()
            );

            if (existingItemIndex !== -1) {
                user.quickAddItems[existingItemIndex].amount = amount;
            } else {
                user.quickAddItems.push({
                    name: category,
                    amount,
                    icon: 'pricetag',
                });
            }
        }

        await user.save();

        const transaction = await Transaction.create({
            user: userId,
            amount,
            type,
            category,
            wallet,
            note,
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set Daily Limit
// @route   PUT /api/wallet/limit
// @access  Private
const setDailyLimit = async (req, res) => {
    const { limit } = req.body;
    try {
        const user = await User.findById(req.user.id);
        user.dailyLimit = limit;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWallet,
    addTransaction,
    setDailyLimit,
};
