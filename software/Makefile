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
		# web folder
		cp -r var/www/html/cyths /var/www/html
		# Add config.json to web folder
		mkdir /var/www/html/cyths/data
		ln -s /etc/cyths/config.json /var/www/html/cyths/data

uninstall:
		$(RM) $(prefix)/bin/cyths-receiver
		$(RM) -r /var/www/html/cyths
