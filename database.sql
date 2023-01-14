-- create database
-- TODO

-- create user
CREATE USER 'bitehack2023'@'%' IDENTIFIED VIA mysql_native_password USING '***';GRANT USAGE ON *.* TO 'bitehack2023'@'%' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;

-- set user privileges
GRANT ALL PRIVILEGES ON bitehack2023. * TO 'bitehack2023'