// query6 : Find the Average friend count per user for users
//
// Return a decimal variable as the average user friend count of all users
// in the users document.

function find_average_friendcount(dbname){
  db = db.getSiblingDB(dbname)
  // TODO: return a decimal number of average friend count
  db.users.aggregate([
    {$unwind: "$friends"},
    {$project: {_id: false, user_id: true, friends: true}},
    {$out: "flat_users"}
  ])
  return db.flat_users.find().count() / db.users.find().count();
}
