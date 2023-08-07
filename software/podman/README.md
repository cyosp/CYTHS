# Podman instructions

## Build in local
```bash
podman build .. -f Containerfile -t cyths
```

## Run from registry

### On Raspberry Pi model 3 and Debian Bookworm
 - Disable Bluetooth
```bash
sudo perl -i -pe "s/^(console.*)$/dtoverlay=disable-bt \1/" /boot/firmware/cmdline.txt
```
 - Disable default process attached to the serial port
```bash
sudo systemctl stop serial-getty@ttyS1.service
sudo systemctl mask serial-getty@ttyS1.service
```
 - Map serial port and GPIO adding these options to `podman run`
```bash
--device=/dev/ttyS1
--device=/dev/gpiochip0
```

### With no data
```
podman run \
   -d \
   -p 8080:80 \
   --name cyths \
   docker.io/cyosp/cyths:6.6.0
```

### Demo
 - Ensure `config.json` is writable by *everybody* to be updated inside container
```
podman run \
    -d \
    -p 8080:80 \
    -v ./demo/data/config.json:/etc/cyths/config.json \
    -v ./demo/data/csv:/var/lib/cyths/csv \
    --name cyths-demo \
    docker.io/cyosp/cyths:6.6.0
```
