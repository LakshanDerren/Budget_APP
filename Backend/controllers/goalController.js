const Goal = require('../models/Goal');

// @desc    Get user goals
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id }).sort({ priority: 1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a goal
// @route   POST /api/goals
// @access  Private
const addGoal = async (req, res) => {
    const { name, targetAmount, deadline } = req.body;

    try {
        const count = await Goal.countDocuments({ user: req.user.id });
        const newPriority = count + 1;

        const goal = await Goal.create({
            user: req.user.id,
            name,
            targetAmount,
            priority: newPriority,
            deadline,
        });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
    const { isCompleted } = req.body;

    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        // Ensure user owns goal
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        if (isCompleted !== undefined) goal.isCompleted = isCompleted;
        const updatedGoal = await goal.save();
        res.json(updatedGoal);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        // Ensure user owns goal
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await goal.deleteOne();
        res.json({ message: 'Goal removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reorder goals
// @route   PUT /api/goals/reorder
// @access  Private
const reorderGoals = async (req, res) => {
    const { goalId, direction } = req.body;

    try {
        const goal = await Goal.findById(goalId);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const currentPriority = goal.priority;
        let targetPriority;

        if (direction === 'up') {
            targetPriority = currentPriority - 1;
        } else {
            targetPriority = currentPriority + 1;
        }

        if (targetPriority < 1) return res.status(400).json({ message: 'Cannot move up' });

        const swapGoal = await Goal.findOne({ user: req.user.id, priority: targetPriority });

        if (swapGoal) {
            swapGoal.priority = currentPriority;
            goal.priority = targetPriority;

            await swapGoal.save();
            await goal.save();
        }

        const goals = await Goal.find({ user: req.user.id }).sort({ priority: 1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    reorderGoals,
};
