const { validationResult } = require('express-validator');
const departmentModel = require('../models/departmentModel');

async function getDepartments(req, res, next) {
  try {
    const departments = await departmentModel.getAllDepartments();
    res.json({ departments });
  } catch (err) {
    next(err);
  }
}

async function getDepartment(req, res, next) {
  try {
    const { id } = req.params;
    const department = await departmentModel.getDepartmentById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ department });
  } catch (err) {
    next(err);
  }
}

async function createDepartment(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, description } = req.body;
    const newDepartment = await departmentModel.createDepartment({ name, description });
    res.status(201).json({ department: newDepartment });
  } catch (err) {
    next(err);
  }
}

async function updateDepartment(req, res, next) {
  try {
    const { id } = req.params;
    const department = await departmentModel.getDepartmentById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    const data = { ...req.body };
    await departmentModel.updateDepartment(id, data);
    const updated = await departmentModel.getDepartmentById(id);
    res.json({ department: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteDepartment(req, res, next) {
  try {
    const { id } = req.params;
    const department = await departmentModel.getDepartmentById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    await departmentModel.deleteDepartment(id);
    res.json({ message: 'Department deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};