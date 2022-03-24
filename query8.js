// query 8: Find the city average friend count per user using MapReduce
// Using the same terminology in query 6, we are asking you to write the mapper,
// reducer and finalizer to find the average friend count for each city.


var city_average_friendcount_mapper = function() {
  // implement the Map function of average friend count
  emit(this.hometown.city, {userscount: 1, friendscount: this.friends.length});
};

var city_average_friendcount_reducer = function(key, values) {
  // implement the reduce function of average friend count
  var users = 0;
  var friends = 0;
  for(i = 0; i < values.length; i++) {
    users += values[i].userscount;
    friends += values[i].friendscount;
  }
  var val = {userscount: users, friendscount: friends};
  return val;
};

var city_average_friendcount_finalizer = function(key, reduceVal) {
  // We've implemented a simple forwarding finalize function. This implementation 
  // is naive: it just forwards the reduceVal to the output collection.
  // Feel free to change it if needed.
  var ret = reduceVal;
  return (ret.friendscount / (ret.userscount * 1.0));
}