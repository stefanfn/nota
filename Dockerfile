FROM archlinux
COPY files /
RUN pacman -Sy --noconfirm which nodejs npm msmtp && \
  ./install.sh && \
  rm -rf /var/cache/pacman/pkg
EXPOSE 54783

