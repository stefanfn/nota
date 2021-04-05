#!/bin/bash

IMAGE_NAME="$(basename $(pwd))"

cp -va \
  /etc/msmtprc \
  /usr/local/bin/send_email \
  /usr/local/sbin/logging \
  /usr/local/sbin/source_std \
  files/

tar zcf files/nota.tar.gz nota

docker build -t $IMAGE_NAME .

rm -v files/msmtprc files/send_email files/logging files/source_std files/nota.tar.gz

