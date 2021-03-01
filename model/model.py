# Loading libraries
import sys
import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import xgboost as xgb
from matplotlib import pyplot as plt

# Loading data
os.chdir('/Users/ucla/Desktop/cs130/project/7/model')
df = pd.read_csv('finalDataframe.csv')

# Splitting train and test set
X = df.drop(['stars', 'business_id', 'user_id'], axis=1)
y = df.stars

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.33, random_state=42)

xgbmodel = xgb.XGBRegressor()
xgbmodel.fit(X_train, y_train)
y_pred = xgbmodel.predict(X_test)
mean_squared_error(y_test, y_pred)
evaluation = pd.DataFrame({'Actual' : y_test,
                           'Prediction': y_pred,
                           'Error' : y_test-y_pred})
plt.scatter(x=y_pred, y=y_test)
