const express = require("express");
const router = express.Router();
const {
  sendRequest,
  getRequests,
  updateRequestStatus,
} = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");
 
router.use(protect);
 
router.post("/", sendRequest);
router.get("/", getRequests);
router.put("/:id", updateRequestStatus);
 
module.exports = router;