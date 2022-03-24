// query2 : unwind friends and create a collection called 'flat_users' 
// where each document has the following schema:
/*
{
  user_id:xxx
  friends:xxx
}
*/

function unwind_friends(dbname){
    db = db.getSiblingDB(dbname);
    // TODO: unwind friends
    db.users.aggregate([
      {$unwind: "$friends"},
      {$project: {_id: false, user_id: true, friends: true}},
      {$out: "flat_users"}
    ])
    
    // returns nothing. It creates a collection instead as specified above.
}
