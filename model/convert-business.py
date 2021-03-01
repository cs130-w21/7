# Import Libraries
import pandas as pd

# Load Data and filter open places
business = pd.read_json('yelp_academic_dataset_business.json', lines = True)
business_open = business[business['is_open']==1]

# Manually selected list of places based on category
chosen_categories = pd.read_csv('categories.csv')

# Filter only places of interest: restaurants and food places
chosen_list = chosen_categories[chosen_categories['food'] == 1].iloc[:,0].tolist()
business_restaurants = business_open[business_open['categories'].str.contains('|'.join(chosen_list),case=False, na=False)]

# Exporting business
final_business = business_restaurants[['business_id', 'categories']]
final_business.to_csv('business.csv', mode='w', index=False)
