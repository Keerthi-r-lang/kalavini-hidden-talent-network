const sendRequest = async (req, res) => {
  res.json({ message: "Send Request Working" });
};

const getRequests = async (req, res) => {
  res.json({ message: "Get Requests Working" });
};

const updateRequestStatus = async (req, res) => {
  res.json({ message: "Update Request Working" });
};

module.exports = {
  sendRequest,
  getRequests,
  updateRequestStatus,
};