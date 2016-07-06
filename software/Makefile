prefix=/usr/local

all: empty

empty:
        true

install: bin/cyths-receiver
        install -m 755 bin/cyths-receiver $(prefix)/bin
        if [ ! -e /etc/cyths/config.json ] ; \
        then \
        	mkdir -p /etc/cyths ; \
        	cp etc/cyths/config.json /etc/cyths ; \
        fi;

uninstall:
        $(RM) $(prefix)/bin/cyths-receiver
