# Python program to convert text 
# file to JSON 
  
  
import json 
  
  
# the file to be converted 
filename = 'info.txt'
  
# resultant dictionary 
arr1 = []

with open(filename) as fh: 
      
  
      
    # count variable for employee id creation 
    l = 1
      
    for line in fh:  
        arr1.append(line.replace('\n',''))
  
  
# creating json file         
out_file = open("cuisine-js.json", "w") 
json.dump(arr1, out_file) 
out_file.close() 