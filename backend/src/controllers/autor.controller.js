const autorRepository = require("../repository/autor.repository")
const response = require("../responses/response");

async function get(req, res, id) {
  try {
    let autor = await autorRepository.get(id);
    return autor;
  } catch (error) {
    console.log(error.stack);
    response.error(req, res, error);
  }
}

module.exports = { get }