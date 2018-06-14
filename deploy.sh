#!/bin/bash

set -e

source .env

ftp -n <<EOF
open $FTP_HOST
user $FTP_USERNAME $FTP_PASSWORD
put $1 $2
exit
EOF
