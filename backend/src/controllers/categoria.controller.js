const express = require('express');
const router = express.Router();

const categoriaRepository = require("../repository/categoria.repository");
const response = require("../responses/response");

const { Categoria } = require("../dto/categoria.dto");

router.get('/', getAll)
router.get('/:id', get)

async function getByBook(req, res, bookId) {
  try {
    let categoria = await categoriaRepository.getByBook(bookId);
    return categoria
  } catch (error) {
    console.log(error.stack);
    response.error(req, res, error);
  }
}

async function getAll(req, res) {
  // const query = req.query.categoria
  try {
    // let allCategories = query ? await categoriaRepository.findAll(query) : await categoriaRepository.getAll()
    let allCategories = await categoriaRepository.getAll()
    allCategories = allCategories.map(category => new Categoria(category))
    response.success(req, res, allCategories);
  } catch (error) {
    response.error(req, res, error);
  }
}

async function get(req, res) {
  try {
    const category = await categoriaRepository.get(req.params.id);
    response.success(req, res, new Categoria(category[0]));
  } catch (error) {
    console.log(error.stack);
    response.error(req, res, error);
  }
}


module.exports = { getByBook, router }