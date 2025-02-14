const express = require('express');
const { getAllMaterials, createMaterialListWithUserId, checkMaterialListExisted, getMaterialListByUserId, getSearchAllMaterials, searchMaterialListByDescription } = require('../controller/material_listController');

const Material_listRoute = express.Router()

Material_listRoute.get('/', getAllMaterials)
Material_listRoute.post('/', createMaterialListWithUserId)
Material_listRoute.get('/check-material/:id', checkMaterialListExisted)
Material_listRoute.get('/user-id/:id', getMaterialListByUserId)
Material_listRoute.get('/search', getSearchAllMaterials)
Material_listRoute.get('/material/search', searchMaterialListByDescription)

module.exports = Material_listRoute;