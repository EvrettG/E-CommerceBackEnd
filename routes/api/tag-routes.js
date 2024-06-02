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

router.post('/', async (req, res) => {
  // create a new tag
  /* req.body should look like this
  {
  "tag_name": "Golden green",
  "productIds": [1, 3, 5]
  }
  */
  try {
    const tag = await Tag.create(req.body);
    if (req.body.productIds && req.body.productIds.length) {
      const productTagIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: tag.id,
          product_id,
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      return res.status(200).json(productTagIds);
    }
    // if no product tags, just respond with the created tag
    return res.status(200).json(tag);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    // update tag data
    const tag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

if (req.body.productIds && req.body.productIds.length) {
  const productTags = await ProductTag.findAll({
    where: { tag_id: req.params.id },
  });
    // create filtered list of new product_id
    const productTagIds = productTags.map(({ product_id }) => product_id);
    const newProductTags = req.body.productIds
      .filter((product_id) => !productTagIds.includes(product_id))
      .map((product_id) => {
        return {
          tag_id: req.params.id,
          product_id,
        };
      });
 // figure out which ones to remove
 const productTagsToRemove = productTags
 .filter(({ product_id }) => !req.body.productIds.includes(product_id))
 .map(({ id }) => id);
         // run both actions
         await Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      }
      return res.json(tag);
    } catch (err) {
      // console.log(err);
      return res.status(400).json(err);
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
