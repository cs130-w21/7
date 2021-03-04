# Import Libraries
import pandas as pd
from minisom import MiniSom

# Load Data and filter open places
business = pd.read_json('yelp_academic_dataset_business.json', lines = True)
business_open = business[business['is_open']==1]

# Manually selected list of places based on category
chosen_categories = pd.read_csv('categories.csv', names=["Category", "Count?", "food", "4", "5"])

# Filter only places of interest: restaurants and food places
chosen_list = chosen_categories[chosen_categories['food'] == 1].iloc[:,0].tolist()
business_restaurants = business_open[business_open['categories'].str.contains('|'.join(chosen_list),case=False, na=False)]
print(type(business_restaurants['attributes'][0]))

# Build df of biz_id -> attributes
attribute_list = []
for index, row in business_restaurants.iterrows():
    new_row = {'business_id': row['business_id']}
    if row['attributes'] is not None:
        new_row |= row['attributes']
    # print(new_row)
    attribute_list.append(new_row)
attribute_df = pd.DataFrame(attribute_list)
attribute_df = attribute_df.drop(['BusinessParking'], axis=1)
attribute_df.to_csv('business2.csv', mode='w', index=False)
# print(attribute_df.columns)

# Reduce the 39 attributes to a SOM coordinate
# print("training SOM...")
# som = MiniSom(6,6,38,sigma=0.3,learning_rate=0.5)    # initialize 6x6 SOM
# X = attribute_df.iloc[1:,1:].values
# som.train(X, 100)  # train it on the rows, excluding business_id

# # Get coords of test row
# print(som.winner(X[0]))


# print(attribute_df.head())