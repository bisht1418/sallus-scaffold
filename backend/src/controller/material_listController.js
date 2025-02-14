const MaterialList = require("../model/materia_list");

exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await MaterialList.find();
    const transformedData = {
      status: "success",
      data: {
        en: {},
        no: {},
      },
    };

    materials.forEach((material) => {
      const { category, sub_category, sub_category_en } = material;

      let categoryObjectEn = transformedData.data.en[category];
      if (!categoryObjectEn) {
        categoryObjectEn = {};
        transformedData.data.en[category] = categoryObjectEn;
      }

      let subCategoryArrayEn = categoryObjectEn[sub_category_en];
      if (!subCategoryArrayEn) {
        subCategoryArrayEn = [];
        categoryObjectEn[sub_category_en] = subCategoryArrayEn;
      }

      subCategoryArrayEn.push({
        _id: material._id,
        sub_category_en: sub_category_en,
        product_no: material.product_no,
        description: material.description,
        kg: material.kg,
        userId: material.userId,
        productName: material.productName,
        data: material.date,
      });

      let categoryObjectNo = transformedData.data.no[category];
      if (!categoryObjectNo) {
        categoryObjectNo = {};
        transformedData.data.no[category] = categoryObjectNo;
      }

      let subCategoryArrayNo = categoryObjectNo[sub_category];
      if (!subCategoryArrayNo) {
        subCategoryArrayNo = [];
        categoryObjectNo[sub_category] = subCategoryArrayNo;
      }

      subCategoryArrayNo.push({
        _id: material._id,
        product_no: material.product_no,
        description: material.description,
        kg: material.kg,
        userId: material.userId,
        productName: material.productName,
        data: material.date,
      });
    });

    res.send(transformedData);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error while retrieving materials_list",
    });
  }
};
exports.getSearchAllMaterials = async (req, res) => {
  try {
    const { description } = req.query;
    const query = {};

    if (description) {
      const escapedDescription = description.replace(
        /[-\/\\^$*+?.()|[\]{}]/g,
        "\\$&"
      );
      const regexPattern = escapedDescription.split(" ").join(".*");
      query.description = { $regex: new RegExp(regexPattern, "i") };
    }
    const materials = await MaterialList.find(query);
    const transformedData = {
      status: "success",
      data: {
        en: {},
        no: {},
      },
    };

    materials.forEach((material) => {
      const { category, sub_category, sub_category_en } = material;

      let categoryObjectEn = transformedData.data.en[category];
      if (!categoryObjectEn) {
        categoryObjectEn = {};
        transformedData.data.en[category] = categoryObjectEn;
      }

      let subCategoryArrayEn = categoryObjectEn[sub_category_en];
      if (!subCategoryArrayEn) {
        subCategoryArrayEn = [];
        categoryObjectEn[sub_category_en] = subCategoryArrayEn;
      }

      subCategoryArrayEn.push({
        _id: material._id,
        sub_category_en: sub_category_en,
        product_no: material.product_no,
        description: material.description,
        kg: material.kg,
        userId: material.userId,
        productName: material.productName,
        data: material.date,
      });

      let categoryObjectNo = transformedData.data.no[category];
      if (!categoryObjectNo) {
        categoryObjectNo = {};
        transformedData.data.no[category] = categoryObjectNo;
      }

      let subCategoryArrayNo = categoryObjectNo[sub_category];
      if (!subCategoryArrayNo) {
        subCategoryArrayNo = [];
        categoryObjectNo[sub_category] = subCategoryArrayNo;
      }

      subCategoryArrayNo.push({
        _id: material._id,
        product_no: material.product_no,
        description: material.description,
        kg: material.kg,
        userId: material.userId,
        productName: material.productName,
        data: material.date,
      });
    });

    res.send(transformedData);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error while retrieving materials_list",
    });
  }
};

exports.createMaterialListWithUserId = async (req, res) => {
  try {
    const newMaterialListWithUserId = new MaterialList({ ...req.body });
    const savedMaterialListWithUserId = await newMaterialListWithUserId.save();
    res.status(201).json({
      status: "success",
      data: savedMaterialListWithUserId,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
};

exports.checkMaterialListExisted = async (req, res) => {
  try {
    const materialList = await MaterialList.find({ _id: req.params.id });
    if (materialList.length > 0) {
      res.status(200).json({
        status: "success",
        data: materialList,
        isMaterialExisted: true,
      });
    } else {
      res.status(200).json({
        status: "success",
        isMaterialExisted: false,
      });
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.getMaterialListByUserId = async (req, res) => {
  try {
    const materialList = await MaterialList.find({ userId: req.params.id });
    if (materialList.length > 0) {
      res.status(200).json({
        status: "success",
        data: materialList,
      });
    } else {
      res.status(200).json({
        status: "success",
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};
exports.searchMaterialListByDescription = async (req, res) => {
  try {
    const searchTerm = req.query.description;

    const materialLists = await MaterialList.find({
      $or: [
        { description: { $regex: `^${searchTerm}`, $options: "i" } },
        { category: { $regex: `^${searchTerm}`, $options: "i" } },
        { sub_category: { $regex: `^${searchTerm}`, $options: "i" } },
        { product_no: { $regex: `^${searchTerm}`, $options: "i" } },
        { sub_category_en: { $regex: `^${searchTerm}`, $options: "i" } },
      ],
    });

    res.status(200).json({
      status: "success",
      data: materialLists,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
};
