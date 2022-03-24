// find the oldest friend for each user who has a friend. 
// For simplicity, use only year of birth to determine age, if there is a tie, use the one with smallest user_id
// return a javascript object : key is the user_id and the value is the oldest_friend id
// You may find query 2 and query 3 helpful. You can create selections if you want. Do not modify users collection.
//
//You should return something like this:(order does not matter)
//{user1:userx1, user2:userx2, user3:userx3,...}

function oldest_friend(dbname){
  db = db.getSiblingDB(dbname);
  var results = {};
  // TODO: implement oldest friends
  // return an javascript object described above
  var all_users = db.users.find();
  for(var i = 0; i < all_users.length(); i++) {
    for(var j = 0; j < all_users.length(); j++) {
      for(var k = 0; k < all_users[j]["friends"].length; k++) {
        if(all_users[j]["friends"][k] === all_users[i]["user_id"]) {
          all_users[i]["friends"].push(all_users[j]["user_id"]);
        }
      }
    }
  }
  var yob = db.users.find({}, { user_id: true, YOB: true, _id: false})
  const yob_map = {};
  for(var a = 0; a < yob.length(); a++) {
    yob_map[yob[a]["user_id"]] = yob[a]["YOB"];
  }
  // db.users.aggregate([
  //   { $group: { _id: "$current.city", users: { $push: "$user_id" } }},
  //   { $out: "cities"}
  // ])
  for(var i = 0; i < all_users.length(); i++) {
    var tempoldestyear = -1;
    var temp_friend_id = -1;
    for(var j = 0 ; j < all_users[i]["friends"].length; j++) {
      var currentfriend = all_users[i]["friends"][j];
      if(yob_map[currentfriend] > tempoldestyear) {
        tempoldestyear = yob_map[currentfriend];
        temp_friend_id = currentfriend;
      }
      else if(yob_map[currentfriend] === tempoldestyear) {
        if(currentfriend < temp_friend_id) {
          temp_friend_id = currentfriend;
        }
      }
    }
    if(all_users[i]["friends"].length) {
      results[all_users[i]["user_id"]] = temp_friend_id;
    }
  }
  return results
}
