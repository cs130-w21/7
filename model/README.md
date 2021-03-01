# File Description
* `convert-business.py`
    * Run this file to filter out a list of restaurants from the `yelp_academic_dataset_business.json`.
    * This also helps reduce the memory requires from 152.9MB to 4.8MB.
* `business.csv`: the list of restaurants containing their `business_id` and `category`.
* `downsize-review.sh`
    * This shell script is used to reduce the size of `yelp_academic_dataset_review.json` from 6.32GB to 1GB by getting rid of the reviews itself and other irrelevant information.
    * The file `new-review.json` will be created which only contains the `review_id`, `user_id`, `business_id` and `star`.
* `new-review.json`:
    * Created by `downsize-review.sh`.
    * This file contains information of the users and the number of stars they gave to businesses.
* `convert-review.py`
    * Run this file to filter out only reviews for restaurants existing in `business.csv`.
    * This also helps reduce the number of reviews we have to load in our notebook from 1GB to 366.4MB.
    * The output of this program is the file `restaurant_review.csv`.
* `restaurant_review.csv`: the list of restaurant reviews.

* `load-businesses.sql`:
    * This SQL script is used to load the file `business.csv` to a local MySQL database for transformation.
* `load-reviews.sql`
    * This SQL script is used to load the file `restaurant-review.csv` to a local MySQL database for transformation.
    * The table `cs130_review` will be created.
* `filter-user.sql`:
    * This SQL script filters users with60 or more reviews from the table `cs130_review`.
* `user-review.csv`:
    * This file is created by from `filter_user.sql`.
    * The reason for filtering users with 60 or more reviews is because these users have a better defined eating habits than users with less. The threshold cut is arbitrary.
* `cuisine-type-diet.py`: This file is used to generate 2 lists, saved in `cuisine.csv` and `type.csv`.
* `cuisine.csv`: Created by `cuisine-type-diet.py`.
* `type.csv`: Created by `cuisine-type-diet.py`.
* `feature-augment.sql`:
    * Use to one hot encode *cuisine* and *type* for each business review using MySQL.
    * Due to low processing power, this method was not used.
* `data-processing.py`: 
    * This file performs the final stage of data processing for our model.
    * Three files will be generated:
        * `model-business-info.csv`: containing OneHotEncoded features of different cuisine for each businesses' reviews
        * `model-user-info.csv`: containing users' eating habits
        * `finalDataframe.csv`: the final dataframe resulting from merging `model-business-info.csv` with `model-user-info.csv`
* `packaging.sh`: Compress the three csv files created by `data-processing.py`
