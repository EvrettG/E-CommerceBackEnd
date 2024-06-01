const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const dbResponse = await Category.findAll({
      include: [{model: Product}],
    });
    res.status(200).json(dbResponse);
  } catch (error) {
    res.status(500).json({message: `Unexpected error ocoured: ${err}`});
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const dbResponse = await Category.findByPk(req.params.id, {
    include: [{model: Product}],
    });
    if (dbResponse){
      res.status(200).json(dbResponse)
    } else {
      res.status(404).json({message: "Category not found"})
    }  
  } catch (error) {
    res.status(500).json({message: `Unexpected error ocoured: ${err}`});
  }
});

router.post('/', async (req, res) => {
  // create a new category
  /* req.body should look like this
  {
    "category_name": "Sport equipment",
  }
  */
  try {
    const dbResponse = await Category.create(req.body);
    res.status(200).json(dbResponse);
  } catch (error) {
    res.status(500).json({message: `Unexpected error ocoured: ${err}`});
  }
  
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const dbResponse = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (dbResponse){
      res.status(200).json({message: `Category Updated ${dbResponse}` })
    } else {
      res.status(404).json({message: "Category not found"})
    }  
  } catch (error) {
    res.status(500).json({message: `Unexpected error ocoured: ${err}`});
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  id = req.params.id
  try {
    const deleteCategory = await Category.destroy({ where: { id } });
    if (deleteCategory) {
      res.status(200).json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ message: "Category not found"});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
