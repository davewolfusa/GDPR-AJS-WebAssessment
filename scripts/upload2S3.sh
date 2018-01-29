#/bin/bash

#upload files
aws s3 cp ./dist s3://com.americancsm.public  --recursive --acl public-read
