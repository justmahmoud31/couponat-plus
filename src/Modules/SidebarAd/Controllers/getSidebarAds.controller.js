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
    { startDate: { $exists: false }, endDate: { $exists: false } },
    {
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    },
    {
      startDate: { $lte: currentDate },
      endDate: { $exists: false },
    },
    {
      startDate: { $exists: false },
      endDate: { $gte: currentDate },
    },
  ];

  if (page) {
    filter.$or.push(
      { showOnPages: { $size: 0 } },
      { showOnPages: { $in: [page] } }
    );
  }

  const sidebarAds = await SidebarAd.find(filter).sort({ order: 1 });

  res.status(200).json({
    status: "success",
    results: sidebarAds.length,
    data: sidebarAds,
  });
});
