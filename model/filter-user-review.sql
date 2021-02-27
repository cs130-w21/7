SELECT user_id, business_id, stars
FROM cs130_review A
WHERE EXISTS (
    SELECT user_id
    FROM (
        SELECT user_id
        FROM cs130_review 
        GROUP BY user_id 
        HAVING COUNT(business_id) >= 60) B
    WHERE A.user_id = B.user_id)
INTO OUTFILE '/home/cs143/shared/user-review.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';