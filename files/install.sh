#!/bin/bash

# Emailskript in den Pfad schieben
mv -v send_email /usr/local/bin
mv -v source_std logging /usr/local/sbin

# msmtp konfigurieren
mv -v msmtprc /etc/

# nota installieren
tar zxf nota.tar.gz
cd nota
npm install

