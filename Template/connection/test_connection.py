import mysql.connector

# Replace these values with your RDS instance's connection details
rds_host = 'myrdsinstance.ctvrxbrt1hnb.ap-southeast-1.rds.amazonaws.com'
db_name = 'SBRP'
db_user = 'sbrp_admin'
db_password = '30e?lLIy^,248fX9T'

try:
    conn = mysql.connector.connect(
        host=rds_host,
        user=db_user,
        password=db_password,
        database=db_name,
        port=3306  # Change the port if your RDS instance uses a different one
    )
    if conn.is_connected():
        print("Connected to MySQL RDS")
        # You can now execute SQL queries or perform other database operations here.
        # For example:
        cursor = conn.cursor()
        cursor.execute("SELECT DATABASE()")
        db_name = cursor.fetchone()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        for table in tables:
            print("Table:", table[0])
        print(f"Connected to the database: {db_name[0]}")
        cursor.execute("SELECT * FROM ACCOUNT")
        results = cursor.fetchall()
        for row in results:
            print(row)
        cursor.close()
        conn.close()
except Exception as e:
    print("Error:", e)