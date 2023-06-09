const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const db = require("../utils/dbConfig");
const { Station } = require("../models/Station");
const { Journey } = require("../models/Journey");

const pageSize = 10;

// Get a page
router.get("/", (req, res) => {
  const offset = pageSize * req.query.page - pageSize;
  const search = req.query.search;

  let searchCondition = {};

  if (search && search !== "null" && search !== "") {
    searchCondition = {
      [Op.or]: [
        // Case insensitive search based on station names, can be departure or return station
        { name_fi: { [Op.iLike]: `%${search}%` } },
        { address_fi: { [Op.iLike]: `%${search}%` } },
      ],
    };
  }

  Station.findAll({
    where: searchCondition,
    limit: pageSize,
    offset: offset,
    order: db.col("id"),
  })
    .then((stations) => {
      console.log(stations);
      res.status(200).json(stations);
    })
    .catch((err) => console.log(err));
});

// Get all stations for explore view
router.get("/all", (req, res) => {
  Station.findAll({ order: db.col("id") })
    .then((stations) => {
      console.log(stations);
      res.status(200).json(stations);
    })
    .catch((err) => console.log(err));
});

// Get total number of pages
router.get("/totalPages", (req, res) => {
  Station.count()
    .then((totalRows) => {
      const totalPages = Math.ceil(totalRows / pageSize);
      res.status(200).json({ totalPages });
    })
    .catch((err) => console.log(err));
});

// Get total number of available pages with given options
router.get("/availablePages", (req, res) => {
  const search = req.query.search;

  searchCondition = {
    [Op.or]: [
      // Case insensitive search based on station names, can be departure or return station
      { name_fi: { [Op.iLike]: `%${search}%` } },
      { address_fi: { [Op.iLike]: `%${search}%` } },
    ],
  };

  Station.count({
    where: searchCondition,
  })
    .then((countedJourneys) => {
      let totalPages = countedJourneys / pageSize;
      totalPages = Math.ceil(totalPages);
      res.status(200).json({ totalPages });
    })
    .catch((err) => console.log(err));
});

// Get two stations for single journey view's map
router.get("/twoStations", (req, res) => {
  const stationIDs = [req.query.departure, req.query.return];

  Station.findAll({
    where: {
      id: stationIDs,
    },
  })
    .then((stations) => {
      res.status(200).json({ stations });
    })
    .catch((err) => console.log(err));
});

// Get a single station
router.get("/:id", (req, res) => {
  Station.findByPk(req.params.id)
    .then((station) => {
      console.log(station);
      res.status(200).json(station);
    })
    .catch((err) => console.log(err));
});

// Get total journeys for a station
router.get("/:id/journeys", async (req, res) => {
  try {
    // Count departures
    const departuresCount = await Journey.count({
      where: { departure_station_id: req.params.id },
      raw: true,
    });

    // Count returns
    const returnsCount = await Journey.count({
      where: { return_station_id: req.params.id },
      raw: true,
    });

    const result = {
      departuresCount,
      returnsCount,
    };

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
