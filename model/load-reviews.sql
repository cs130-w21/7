CREATE TABLE IF NOT EXISTS cs130_review (
    review_id CHAR(22),
    user_id CHAR(22),
    business_id CHAR(22),
    stars INT
);

LOAD DATA LOCAL INFILE "/home/cs143/shared/restaurant_review.csv"
INTO TABLE cs130_review
COLUMNS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES;