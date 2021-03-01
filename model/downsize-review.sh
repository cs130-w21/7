#! /bin/bash

# removing uncessary fields of the documents
grep -o '{\"review_id\".*"stars":\d\.\d' yelp_academic_dataset_review.json > new-review.json
# adding the '}' back to the end of each document so that they are in valid json format
sed -i '' 's/$/\}/' new-review.json