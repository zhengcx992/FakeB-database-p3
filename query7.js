// query 7: Find the number of users born in each month using MapReduce

var num_month_mapper = function() {
  emit(this.MOB, 1);
}

var num_month_reducer = function(key, values) {
  var sum = 0;
  for (var i = 0; i < values.length; i++) {
    sum += values[i];
  }
  
  return sum;
}

var num_month_finalizer = function(key, reduceVal) {
  // We've implemented a simple forwarding finalize function. This implementation 
  // is naive: it just forwards the reduceVal to the output collection.
  // Feel free to change it if needed. 
  var ret = reduceVal;
  return ret;
}
