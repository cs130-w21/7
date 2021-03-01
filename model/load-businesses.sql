CREATE TABLE IF NOT EXISTS cs130_business (
    business_id CHAR(22),
    categories TEXT
);

LOAD DATA LOCAL INFILE "/home/cs143/shared/business.csv"
INTO TABLE cs130_business
COLUMNS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;