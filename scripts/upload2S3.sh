#/bin/bash

#upload files
aws s3 cp ../dist s3://com.americancsm.public/site/marketing/gdpr_assessment  --recursive --acl public-read
