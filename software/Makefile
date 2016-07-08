prefix=/usr/local

all: empty

empty:
	true

install:
		# cyths-receiver
		install -m 755 bin/cyths-receiver $(prefix)/bin
        # config.json
		if [ ! -e /etc/cyths/config.json ] ; \
		then \
			mkdir -p /etc/cyths ; \
			cp etc/cyths/config.json /etc/cyths ; \
			chown www-data:www-data /etc/cyths/config.json ; \
		fi;
		# cyths-receiver as a service
		if [ ! -e /etc/default/cyths-receiver ] ; \
		then \
			cp etc/default/cyths-receiver /etc/default ; \
		fi;
		cp etc/systemd/system/cyths-receiver.service /etc/systemd/system
		systemctl enable /etc/systemd/system/cyths-receiver.service
		systemctl start cyths-receiver.service
		# web folder
		cp -r var/www/html/cyths /var/www/html
		# Add config.json to web folder
		mkdir /var/www/html/cyths/data
		ln -s /etc/cyths/config.json /var/www/html/cyths/data
		# Add CSV folder to web folder
		ln -s /var/lib/cyths/csv /var/www/html/cyths/data

uninstall:
		# web folder
		$(RM) -r /var/www/html/cyths
		# Remove cyths-receiver as a service
		systemctl stop cyths-receiver.service
		systemctl disable /etc/systemd/system/cyths-receiver.service
		$(RM) /etc/systemd/system/cyths-receiver.service
		# cyths-receiver
		$(RM) $(prefix)/bin/cyths-receiver