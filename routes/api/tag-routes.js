const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const dbResponse = await Tag.findAll({
      include: [{model: Product}],
    });
    res.status(200).json(dbResponse)
  } catch (error) {
    res.status(500).json({message: `Unexpected error ocoured: ${err}`});
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const dbResponse = await Tag.findByPk(req.params.id, {
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

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const dbResponse = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (dbResponse){
      res.status(200).json({message: `Tag Updated ${dbResponse}` })
    } else {
      res.status(404).json({message: "Tag not found"})
    }  
  } catch (error) {
    res.status(500).json({message: `Unexpected error ocoured: ${err}`});
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  id = req.params.id
  try {
    const deleteTag = await Tag.destroy({ where: { id } });
    if (deleteTag) {
      res.status(200).json({ message: "Tag deleted successfully" });
    } else {
      res.status(404).json({ message: "Tag not found"});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
