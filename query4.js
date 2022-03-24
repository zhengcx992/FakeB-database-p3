
// query 4: find user pairs (A,B) that meet the following constraints:
// i) user A is male and user B is female
// ii) their Year_Of_Birth difference is less than year_diff
// iii) user A and B are not friends
// iv) user A and B are from the same hometown city
// The following is the schema for output pairs:
// [
//      [user_id1, user_id2],
//      [user_id1, user_id3],
//      [user_id4, user_id2],
//      ...
//  ]
// user_id is the field from the users collection. Do not use the _id field in users.
  
function suggest_friends(year_diff, dbname) {
    db = db.getSiblingDB(dbname);
    var pairs = [];
    // TODO: implement suggest friends
    // Return an array of arrays.
    var all_users = db.users.find();

    for (var i = 0; i < all_users.length(); i++) {
        for (var j = 0; j < all_users.length(); j++) {
            if (all_users[i]["gender"] == "male" && all_users[j]["gender"] == "female" 
            && Math.abs(all_users[i]["YOB"] - all_users[j]["YOB"]) < year_diff 
            && all_users[i]["hometown"]["country"] == all_users[j]["hometown"]["country"]
            && all_users[i]["hometown"]["state"] == all_users[j]["hometown"]["state"]
            && all_users[i]["hometown"]["city"] == all_users[j]["hometown"]["city"]) {
                var check = 0;
                for (var k = 0; k < all_users[i]["friends"].length && !check; k++) {
                    if (all_users[j]["user_id"] == all_users[i]["friends"][k]) {
                        check = 1;
                    }
                }
                for (var k = 0; k < all_users[j]["friends"].length && !check; k++) {
                    if (all_users[i]["user_id"] == all_users[j]["friends"][k]) {
                        check = 1;
                    }
                }
                if (check == 0) {
                    pairs.push([all_users[i]["user_id"], all_users[j]["user_id"]])
                }

            }
        }
    }
    return pairs;
}
