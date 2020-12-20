FROM archlinux
RUN pacman -Sy --noconfirm which nodejs npm msmtp
COPY files /
RUN ./install.sh
EXPOSE 54783

