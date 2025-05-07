import Store from "../models/storeModel.js";
import catchError from "../utils/catchError.js";
import AppError from "../utils/appError.js";

export const deleteStore = catchError(async (req, res, next) => {
  const { id } = req.params;
  
  // Check if store exists before attempting to delete
  const store = await Store.findById(id);
  if (!store) {
    return next(new AppError("Store not found", 404));
  }
  
  // Use soft delete approach by setting isDeleted to true
  const deletedStore = await Store.findByIdAndUpdate(
    id, 
    { isDeleted: true },
    { new: true }
  );

  // Return consistent response structure
  res.status(200).json({
    Message: "Success",
    store: deletedStore
  });
});