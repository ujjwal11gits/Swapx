const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth'); 
const User = require('../models/User');

// POST /api/items/add
router.post('/add', auth, async (req, res) => {
  try {
    const { title, description, image,price } = req.body;

    if (!title || !image) {
      return res.status(400).json({ message: 'Title and image URL are required' });
    }

    const newItem = new Item({
      title,
      description,
      image,
      owner: req.user._id,
      price,
      isFeatured: false // explicitly save
    });

    await newItem.save();

    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (err) {
    console.error('Add Item Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/featured', async (req, res) => {
  try {
    const featuredItems = await Item.find({ isFeatured: true })
      .sort({ createdAt: -1 })
    

    res.status(200).json(featuredItems);
  } catch (err) {
    console.error('Get Featured Items Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/items/latest
router.get('/latest', async (req, res) => {
  try {
    const latestItems = await Item.find()
      .sort({ createdAt: -1 }) // newest first
      

    res.status(200).json(latestItems);
  } catch (err) {
    console.error('Get Latest Items Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




router.patch('/:id/feature', auth, async (req, res) => {
  try {
    const { isFeatured } = req.body;

    // Only allow admin users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.isFeatured = isFeatured;
    await item.save();

    // 🔁 Re-fetch to ensure it's in the response
    const updatedItem = await Item.findById(req.params.id);

    res.status(200).json({
      message: `Item marked as ${isFeatured ? 'featured' : 'not featured'}`,
      item: updatedItem
    });

  } catch (err) {
    console.error('Mark Featured Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/:id/purchase', auth, async (req, res) => {
  try {
    const buyerId = req.user._id;
    const item = await Item.findById(req.params.id).populate('owner');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.isPurchased) {
      return res.status(400).json({ message: 'Item already purchased' });
    }

    if (item.owner._id.equals(buyerId)) {
      return res.status(400).json({ message: 'You cannot purchase your own item' });
    }

    const buyer = await User.findById(buyerId);
    const seller = await User.findById(item.owner._id);

    if (buyer.coins >= item.price) {
      // Complete purchase
      buyer.coins -= item.price;
      seller.coins += item.price;
      item.isPurchased = true;

      await buyer.save();
      await seller.save();
      await item.save();

      return res.status(200).json({
        message: 'Purchase successful using coins',
        itemId: item._id,
        buyerBalance: buyer.coins,
        sellerBalance: seller.coins
      });
    } else {
      const needed = item.price - buyer.coins;
      return res.status(402).json({
        message: 'Insufficient coins. Please purchase more coins.',
        requiredCoins: needed
      });
    }
  } catch (err) {
    console.error('Purchase Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/my-products', auth, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    console.error('Get My Products Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/my-products/purchased', auth, async (req, res) => {
  try {
    const items = await Item.find({
      owner: req.user._id,
      isPurchased: true
    }).sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (err) {
    console.error('Get Purchased Products Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/my-products/available', auth, async (req, res) => {
  try {
    const items = await Item.find({
      owner: req.user._id,
      isPurchased: false
    }).sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (err) {
    console.error('Get Available Products Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/items/all
router.get('/all', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }); // Latest first
    res.status(200).json(items);
  } catch (err) {
    console.error('Get All Items Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (err) {
    console.error('Get Item Details Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});






module.exports = router;
