import { removeFileFromCloudinary } from "../Middleware/fileUpload.js";
import EmployeeModel from "../Model/EmployeeSchema.js";

///////////// CREATE EMPLOYEE ////////////////

export const CreateEmployee = async (req, res) => {
  const { name, email, phone, desigination, gender, coures } = req.body;
  const image = req.imagUrl;

  if (!name || !email || !phone || !desigination || !gender || !coures)
    return res.status(400).json("pleas fill all the filds");

  const newEmployee = await EmployeeModel.create({
    name,
    email,
    phone,
    desigination,
    gender,
    coures,
    image,
    public_id: req.publiId,
  });

  res.status(201).json(newEmployee);
};

//////////// UPDATE EMPLOYEE /////////////

export const update = async (req, res) => {
  const id = req.params.id;
  const { body, query } = req;

  console.log(req.body);
  let setQurey = {};

  if (query.imageType === "null") {
    // delete body.image;
    setQurey = { $set: body };
  } else if (query.imageType === "image") {
    const imageId = await EmployeeModel.findById(id)
    await removeFileFromCloudinary(imageId.public_id);
    setQurey = { $set: { ...body, image: req.imagUrl } };
  }

  const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, setQurey, {
    new: true,
  });

  if (!updatedEmployee) {
    return res.status(404).json({ error: "Employee not found" });
  }

  res.status(200).json(updatedEmployee);
};



////////// GET ALL EMPLYEES //////////////////

export const getEmployees = async (req, res) => {
  const employee = await EmployeeModel.find()
  if(!employee) {
    res.status(400).json({error:"No Employees founded"})
  }
  res.status(200).json(employee)
}