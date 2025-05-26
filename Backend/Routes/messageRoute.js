const express = require('express');
const router = express.Router();
const Message = require('../Models/messagesModel')

router.post('/send' , async (req,res) => {
    try{
        const message = new Message({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
            phone: req.body.phone
        });

        const result = await message.save();
        res.json(result);
    }catch(error){
        res.status.json({ message: error.message });
    }
})

router.get('/all' , async (req , res) => {
    try{
        const messages = await Message.find();
        res.json({messagesCount: messages.length , messages});
    }catch(error){
        res.status.json({message: error.message})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;