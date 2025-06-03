import { SidebarAd } from "../../../../database/Models/SidebarAd.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getSidebarAds = catchError(async (req, res, next) => {
  const { module, page } = req.query;
  const currentDate = new Date();

  let filter = { isActive: true };

  if (module) {
    filter.module = module;
  }

  filter.$or = [
    {
      $and: [
        { $or: [{ startDate: null }, { startDate: { $exists: false } }] },
        { $or: [{ endDate: null }, { endDate: { $exists: false } }] },
      ],
    },
    {
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    },
    {
      startDate: { $lte: currentDate },
      $or: [{ endDate: null }, { endDate: { $exists: false } }],
    },
    {
      $or: [{ startDate: null }, { startDate: { $exists: false } }],
      endDate: { $gte: currentDate },
    },
  ];

  if (page) {
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [{ showOnPages: { $size: 0 } }, { showOnPages: { $in: [page] } }],
    });
  }

  const sidebarAds = await SidebarAd.find(filter).sort({ order: 1 });

  res.status(200).json({
    status: "success",
    results: sidebarAds.length,
    data: sidebarAds,
  });
});
