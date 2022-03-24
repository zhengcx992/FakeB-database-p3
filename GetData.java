import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.TreeSet;
import java.util.Vector;
import java.util.HashMap;



//json.simple 1.1
// import org.json.simple.JSONObject;
// import org.json.simple.JSONArray;

// Alternate implementation of JSON modules.
import org.json.JSONObject;
import org.json.JSONArray;

public class GetData{
	
    static String prefix = "project3.";
	
    // You must use the following variable as the JDBC connection
    Connection oracleConnection = null;
	
    // You must refer to the following variables for the corresponding 
    // tables in your database

    String cityTableName = null;
    String userTableName = null;
    String friendsTableName = null;
    String currentCityTableName = null;
    String hometownCityTableName = null;
    String programTableName = null;
    String educationTableName = null;
    String eventTableName = null;
    String participantTableName = null;
    String albumTableName = null;
    String photoTableName = null;
    String coverPhotoTableName = null;
    String tagTableName = null;

    // This is the data structure to store all users' information
    // DO NOT change the name
    JSONArray users_info = new JSONArray();		// declare a new JSONArray

	
    // DO NOT modify this constructor
    public GetData(String u, Connection c) {
	super();
	String dataType = u;
	oracleConnection = c;
	// You will use the following tables in your Java code
	cityTableName = prefix+dataType+"_CITIES";
	userTableName = prefix+dataType+"_USERS";
	friendsTableName = prefix+dataType+"_FRIENDS";
	currentCityTableName = prefix+dataType+"_USER_CURRENT_CITIES";
	hometownCityTableName = prefix+dataType+"_USER_HOMETOWN_CITIES";
	programTableName = prefix+dataType+"_PROGRAMS";
	educationTableName = prefix+dataType+"_EDUCATION";
	eventTableName = prefix+dataType+"_USER_EVENTS";
	albumTableName = prefix+dataType+"_ALBUMS";
	photoTableName = prefix+dataType+"_PHOTOS";
	tagTableName = prefix+dataType+"_TAGS";
    }
	
	
    //implement this function

    @SuppressWarnings("unchecked")
    public JSONArray toJSON() throws SQLException{ 

    	JSONArray users_info = new JSONArray();

        HashMap<Long, JSONObject> users_map = new HashMap<Long, JSONObject>();
        // HashMap.keySet() return all keys
        // HashMap.get(key) return the value of the key

        try (Statement stmt = oracleConnection.createStatement(
                ResultSet.TYPE_SCROLL_INSENSITIVE,
                ResultSet.CONCUR_READ_ONLY)) {
        
            ResultSet rst = stmt.executeQuery(
                    "SELECT user_id, first_name, last_name, gender, " +
                    "YEAR_OF_BIRTH as YOB, MONTH_OF_BIRTH as MOB, DAY_OF_BIRTH as DOB " +
                    "FROM " + userTableName);
            
            while (rst.next()) { // step through result rows/records one by one
                JSONObject info = new JSONObject();
                Long uid = rst.getLong(1);
                info.put("user_id", uid);
                info.put("first_name", rst.getString(2));
                info.put("last_name", rst.getString(3));
                info.put("gender", rst.getString(4));
                info.put("YOB", rst.getInt(5));
                info.put("MOB", rst.getInt(6));
                info.put("DOB", rst.getInt(7));
                info.put("friends", new JSONArray());
                info.put("hometown", new JSONObject());
                info.put("current", new JSONObject());
                users_map.put(uid, info);
            }

            rst = stmt.executeQuery(
                    "SELECT curr.user_id, c.CITY_NAME as city, c.STATE_NAME as state, c.COUNTRY_NAME as country " +
                    "FROM " + cityTableName + " c, " + currentCityTableName + " curr " +
                    "WHERE c.CITY_ID = curr.CURRENT_CITY_ID");
            
            while (rst.next()) {
                Long uid = rst.getLong(1);
                // curr_info.put("city", rst.getString(2));
                // curr_info.put("state", rst.getString(3));
                // curr_info.put("country", rst.getString(4));
                users_map.get(uid).getJSONObject("current").put("city", rst.getString(2));
                users_map.get(uid).getJSONObject("current").put("state", rst.getString(3));
                users_map.get(uid).getJSONObject("current").put("country", rst.getString(4));
            }

            rst = stmt.executeQuery(
                    "SELECT h.user_id, c.CITY_NAME as city, c.STATE_NAME as state, c.COUNTRY_NAME as country " +
                            "FROM " + cityTableName + " c, " + hometownCityTableName + " h " +
                            "WHERE c.CITY_ID = h.HOMETOWN_CITY_ID");

            while (rst.next()) {
                // JSONObject curr_info = new JSONObject();
                Long uid = rst.getLong(1);
                // curr_info.put("city", rst.getString(2));
                // curr_info.put("state", rst.getString(3));
                // curr_info.put("country", rst.getString(4));
                users_map.get(uid).getJSONObject("hometown").put("city", rst.getString(2));
                users_map.get(uid).getJSONObject("hometown").put("state", rst.getString(3));
                users_map.get(uid).getJSONObject("hometown").put("country", rst.getString(4));
            }

            rst = stmt.executeQuery("SELECT user1_id, user2_id FROM " + friendsTableName);
            while (rst.next()) {
                Long uid = rst.getLong(1);
                users_map.get(uid).getJSONArray("friends").put(rst.getLong(2));
            }

            for (Long uid : users_map.keySet()) {
                users_info.put(users_map.get(uid));
            }

            rst.close();
            stmt.close();
            
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
		
		return users_info;
    }

    // This outputs to a file "output.json"
    public void writeJSON(JSONArray users_info) {
	// DO NOT MODIFY this function
	try {
	    FileWriter file = new FileWriter(System.getProperty("user.dir")+"/output.json");
	    file.write(users_info.toString());
	    file.flush();
	    file.close();

	} catch (IOException e) {
	    e.printStackTrace();
	}
		
    }
}
