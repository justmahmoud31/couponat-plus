import { Store } from "../../../../database/Models/Store.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { AppError } from "../../../Utils/AppError.js";

export const deleteStore = catchError(async (req, res, next) => {
  const oneStore = await Store.findById(req.params.id);
  if (!oneStore) {
    return next(new AppError("Store Not Found", 404));
  }
  oneStore.isDeleted = true;
  await oneStore.save();
  res.status(201).json({
    Message: "Success",
  });
});

export const revertStore = catchError(async (req, res, next) => {
  const oneStore = await Store.findById(req.params.id);
  if (!oneStore) {
    return next(new AppError("Store Not Found", 404));
  }
  oneStore.isDeleted = false;
  await oneStore.save();
  res.status(200).json({
    Message: "Success",
    store: oneStore,
  });
});

export const permanentDeleteStore = catchError(async (req, res, next) => {
  const { id } = req.params;
  const { deleteRelated } = req.body;

  const store = await Store.findById(id);
  if (!store) {
    return next(new AppError("Store Not Found", 404));
  }

  const { Coupon } = await import("../../../../database/Models/Coupon.js");
  const { Product } = await import("../../../../database/Models/Product.js");
  const { Rate } = await import("../../../../database/Models/Rate.js");

  if (deleteRelated === "true" || deleteRelated === true) {
    await Rate.deleteMany({ store_id: id });

    await Coupon.deleteMany({ store_id: id });

    await Product.deleteMany({ store_id: id });
  } else {
    await Coupon.updateMany({ store_id: id }, { $unset: { store_id: "" } });

    await Product.updateMany({ store_id: id }, { $unset: { store_id: "" } });

    await Rate.deleteMany({ store_id: id });
  }

  if (store.logo) {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const logoPath = path.default.resolve(store.logo);
      if (fs.default.existsSync(logoPath)) {
        fs.default.unlinkSync(logoPath);
      }
    } catch (err) {
      console.error("Error deleting logo file:", err);
    }
  }

  await Store.findByIdAndDelete(id);

  res.status(200).json({
    Message: "Store permanently deleted",
  });
});
