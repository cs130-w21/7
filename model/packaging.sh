#! /bin/bash
tar cvf - finalDataframe.csv model-business-info.csv model-user-info.csv | gzip -9 - > data.tar.gz