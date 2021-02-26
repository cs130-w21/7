### Attributes
* user_id
* business_id
* business_name
* city
* state
* postal_code
* latitude
* longitude
* stars
* review_count
* is_open
* attributes
* categories
* user given stars

### Logic
For field `term`, use *restaurants* or *food*
<https://www.yelp.com/developers/documentation/v3/business_search>

* Two options
	* Find now
		* Use the user's latitude and longitude
		* default range is 10 miles
		* option open_now = true
	* Specifying search
		* input a location
		* input range
		* option open_at is specified
		* specifying price range of \$, \$\$, \$\$\$

After getting a list of restaurants near by, predict the star ratings for those restaurants using the machine learning algorithm and sort them base on the prediction.

Using the URL of the place to show the website.