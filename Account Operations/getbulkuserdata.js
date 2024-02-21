async function getbulkuserdata(req, res, userDatabase) {
  let { tokenList } = req.body;
  let users = await userDatabase.find({ token: { $in: tokenList } });
  if (users !== null) {
    res.json({ status: true, users });
  } else {
    res.json({ status: false, response: "No users found" });
  }
}

export default getbulkuserdata;
