const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  try {
    const dbResponse = await Product.findAll({
       //including its associated Category and Tag data
      include: [{ model: Category }, { model: Tag }],
    });

    //  // Process the response to replace category_id with category_name and remove the category element
    //  const processedResponse = dbResponse.map(product => {
    //   const productData = product.get({ plain: true });
    //   return {
    //     ...productData,
    //     category_id: undefined,  // Remove category_id
    //     category_name: productData.category.category_name,
    //     category: undefined  // Remove the category element
    //   };
    // });
    //  Use processedResponse and above code to alter response to remove category_id and replace it with category_name
    res.status(200).json(dbResponse)
  } catch (error) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const dbResponse = await Product.findByPk(req.params.id, {
      //including its associated Category and Tag data
      include: [{ model: Category }, { model: Tag }],
});
if (dbResponse){
      res.status(200).json(dbResponse)
    } else {
      res.status(404).json({message: "Product not found"})
    }
  } catch (error) {
    res.status(500).json({message: `Unexpected error ocoured: ${err}`});
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball  T-Shirt",
      price: 200.00,
      stock: 3,
      category_id: 1,
      tagIds: [1, 2, 3, 4]
    }
  */
 if(!req.body.product_name && !req.body.price && !req.body.stock && !req.body.category_id){
  return res.status(400).json({ message: 'Invalid body/request sent ' });
 }
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  id = req.params.id
  try {
    const deleteProduct = await Product.destroy({ where: { id } });
    if (deleteProduct) {
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found"});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
