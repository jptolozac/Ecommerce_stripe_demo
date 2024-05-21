const express = require("express");
const router = express.Router();

const libroRepository = require("../repository/libro.repository");
const response = require("../responses/response");
const formatBookResponse = require("../helpers/formatBookResponse.helper")

router.get("/", getAll);
router.get("/categorias/:categoria", findByCategory);
router.get("/libros_mas_vendidos", getBestSellingBooks);
router.get("/libros_mas_vendidos_2024", getBestSellingBooksReleasedIn2024);
router.get("/:id", get);
// router.put("/:id", libroValidator, validarErrores, update);
// router.delete("/:id", destroy);

async function getAll(req, res) {
  const query = req.query.q;
  console.log(query);
  try {
    let alllibros;
    if(query)
      alllibros = await libroRepository.findByText(query);
    else
      alllibros = await libroRepository.getAll();

    alllibros = await Promise.all(alllibros.map(async (libro) => await formatBookResponse(req, res, libro)));
    console.log(alllibros);
    response.success(req, res, alllibros);
  } catch (error) {
    console.log(error);
    response.error(req, res, error);
  }
}

async function getBestSellingBooks(req, res) {
  try {
    let libros = await libroRepository.getBestSellingBooks();
    libros = await Promise.all(libros.map(async (libro) => await formatBookResponse(req, res, libro)));
    response.success(req, res, libros);
  } catch (error) {
    console.log(error);
    response.error(req, res, "Error interno");
  }
}

async function getBestSellingBooksReleasedIn2024(req, res) {
  try {
    let libros = await libroRepository.getBestSellingBooksReleasedIn2024();
    libros = await Promise.all(libros.map(async (libro) => await formatBookResponse(req, res, libro)));
    response.success(req, res, libros);
  } catch (error) {
    console.log(error);
    response.error(req, res, "Error interno");
  }
}

async function findByCategory(req, res){
  const category = req.params.categoria
  try {
    if(category){
      let libros = await libroRepository.getByCategory(category)
      libros = await Promise.all(libros.map(async (libro) => await formatBookResponse(req, res, libro)));
      return response.success(req, res, libros)
    }
    return response.error(req, res, "Categoria inválida", 400)
  } catch (error) {
    console.log(error);
    response.error(req, res, "Error interno")
  }
}

async function get(req, res) {
  try {
    let libro = await libroRepository.get(req.params.id);
    libro = await formatBookResponse(req, res, libro[0]);
    response.success(req, res, libro);
  } catch (error) {
    console.log(error.stack);
    response.error(req, res, error);
  }
}

// async function update(req, res) {
//   try {
//     req.body.password = await bcrypt.hash(req.body.password, 5)
//     await libroRepository.update(req.params.id, new libroeDTO(req.body));
//     response.success(
//       req,
//       res,
//       `Se actualizó el libroe ${req.params.id} correctamente`
//     );
//   } catch (error) {
//     console.log(error.stack);
//     response.error(req, res, "Error al actualizar el libroe");
//   }
// }

// async function destroy(req, res) {
//   try {
//     await libroRepository.destroy(req.params.id);
//     response.success(req, res, `Se eliminó el libroe ${req.params.id}`);
//   } catch (error) {
//     console.log(error.stack);
//     response.error(req, res, error);
//   }
// }

module.exports = router;
